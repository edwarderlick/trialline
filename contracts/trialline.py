# { "Depends": "py-genlayer:test" }
import json
import hashlib
import re
from dataclasses import dataclass
import genlayer as gl
from genlayer import *

@evm.contract_interface
class _Recipient:
    class View: pass
    class Write: pass

@storage.allow
@dataclass
class StampRecord:
    id: str
    poster: Address
    nct_id: str
    status: str
    bond: u256
    state: str
    result_overall_status: str
    result_brief_title: str
    result_reason: str
    stamper: str

def fetch_nih(nct: str) -> str:
    url = f"https://clinicaltrials.gov/api/v2/studies/{nct}"
    try:
        headers = {"Accept": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        resp = nondet.web.get(url, headers=headers)
        body_bytes = getattr(resp, "body", b"")
        body_str = body_bytes.decode("utf-8") if isinstance(body_bytes, bytes) else str(body_bytes)
        doc = json.loads(body_str)
        status = doc.get("protocolSection", {}).get("statusModule", {}).get("overallStatus", "")
        if not status:
            return json.dumps({"kind": "THIN", "reason": "Missing overallStatus"})
        return json.dumps({"kind": "OK", "status": status})
    except Exception as e:
        return json.dumps({"kind": "THIN", "reason": f"Fetch crashed: {str(e)[:100]}", "nct": "", "overall_status": "", "brief_title": ""})

class TrialLine(contract.Contract):
    config: storage.TreeMap[str, str]
    stamps: storage.TreeMap[str, StampRecord]
    credits: storage.TreeMap[Address, u256]

    def __init__(self):
        self.config["owner"] = str(message.sender_address)

    @public.write
    def withdraw(self):
        caller = message.sender_address
        amount = self.credits.get(caller, u256(0))
        if amount == u256(0):
            raise gl.vm.UserError("No credits")
        
        # Transfer the funds back to the caller
        try:
            _Recipient(caller).emit_transfer(value=amount)
        except Exception:
            raise gl.vm.UserError("Transfer failed")

        # Zero the balance after successful transfer
        self.credits[caller] = u256(0)

    @public.write.payable
    def post_stamp(self, nct: str, status: str, nonce: str) -> str:
        caller = message.sender_address
        value = message.value
        if value <= u256(0):
            raise gl.vm.UserError("Value must be > 0")

        norm_nct = nct.strip().upper().replace(" ", "")
        if not re.match(r"^NCT\d{8}$", norm_nct):
            raise gl.vm.UserError("Invalid NCT ID format")
        
        h_ctx = hashlib.sha256(
            str(caller).encode("utf-8") +
            str(value).encode("utf-8") +
            str(nonce).encode("utf-8") +
            str(norm_nct).encode("utf-8") +
            str(status).encode("utf-8")
        ).hexdigest()
        
        stamp_id = h_ctx
        
        if stamp_id in self.stamps:
            raise gl.vm.UserError("Stamp already exists")
            
        stamp = StampRecord(
            id=stamp_id,
            poster=caller,
            nct_id=norm_nct,
            status=status,
            bond=value,
            state="PENDING",
            result_overall_status="",
            result_brief_title="",
            result_reason="",
            stamper=""
        )
        self.stamps[stamp_id] = stamp
        return stamp_id

    @public.view
    def get_stamp(self, stamp_id: str) -> str:
        if stamp_id not in self.stamps:
            return "{}"
        stamp = self.stamps[stamp_id]
        return json.dumps({
            "id": stamp.id,
            "poster": str(stamp.poster),
            "nct": stamp.nct_id,
            "expected_status": stamp.status,
            "value": str(stamp.bond),
            "status": stamp.state,
            "stamper": stamp.stamper,
            "result_overall_status": stamp.result_overall_status,
            "result_reason": stamp.result_reason
        })

    @public.view
    def list_ids(self) -> list:
        return list(self.stamps.keys())

    @public.view
    def get_credit(self, account: str) -> str:
        addr = Address(account)
        val = self.credits.get(addr, u256(0))
        return str(val)

    @public.view
    def get_economics(self) -> str:
        owner_str = self.config.get("owner", "")
        treasury = u256(0)
        if owner_str:
            treasury = self.credits.get(Address(owner_str), u256(0))
            
        locked = u256(0)
        for stamp in self.stamps.values():
            if stamp.state == "PENDING":
                locked += stamp.bond
                
        credits_out = u256(0)
        for val in self.credits.values():
            credits_out += val
            
        return json.dumps({
            "treasury": str(treasury),
            "locked_in_open": str(locked),
            "credits_outstanding": str(credits_out)
        })

    @public.write
    def match(self, stamp_id: str):
        caller = message.sender_address
        if stamp_id not in self.stamps:
            raise gl.vm.UserError("Stamp not found")
        stamp = self.stamps[stamp_id]
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")
        
        value = stamp.bond
        poster = stamp.poster
        nct = stamp.nct_id
        expected_status = stamp.status

        try:
            result_str = eq_principle.strict_eq(lambda: fetch_nih(nct))
            result = json.loads(result_str)
            kind = result.get("kind", "THIN")
        except Exception:
            kind = "THIN"
            result = {"kind": "THIN", "reason": "Consensus Mismatch or Error"}

        if kind == "THIN":
            current_poster_credit = self.credits.get(poster, u256(0))
            self.credits[poster] = current_poster_credit + value
            stamp.state = "THIN"
            stamp.result_reason = result.get("reason", "")
        else:
            ret_status = result.get("status", "")
            if not ret_status:
                current_poster_credit = self.credits.get(poster, u256(0))
                self.credits[poster] = current_poster_credit + value
                stamp.state = "THIN"
                stamp.result_reason = "Empty status returned"
            elif ret_status == expected_status:
                protocol_fee = u256(int(value) * 25 // 1000)
                poster_share = value - protocol_fee
                
                owner_str = self.config.get("owner", str(caller))
                owner_addr = Address(owner_str)
                
                current_owner_credit = self.credits.get(owner_addr, u256(0))
                self.credits[owner_addr] = current_owner_credit + protocol_fee
                
                current_poster_credit = self.credits.get(poster, u256(0))
                self.credits[poster] = current_poster_credit + poster_share
                
                stamp.state = "MATCH"
                stamp.result_overall_status = ret_status
            else:
                current_caller_credit = self.credits.get(caller, u256(0))
                self.credits[caller] = current_caller_credit + value
                stamp.state = "MISS"
                stamp.result_overall_status = ret_status

        stamp.stamper = str(caller)
        self.stamps[stamp_id] = stamp

    @public.write
    def cancel(self, stamp_id: str):
        caller = message.sender_address
        if stamp_id not in self.stamps:
            raise gl.vm.UserError("Stamp not found")
        stamp = self.stamps[stamp_id]
        if str(stamp.poster) != str(caller):
            raise gl.vm.UserError("Only poster can cancel")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")
        
        current_credit = self.credits.get(caller, u256(0))
        self.credits[caller] = current_credit + stamp.bond
        
        stamp.state = "CANCELED"
        stamp.result_reason = "Canceled by poster"
        self.stamps[stamp_id] = stamp
