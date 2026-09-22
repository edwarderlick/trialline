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

# ── Resolution window constants ─────────────────────────────────────────────
# Posters cannot cancel within the first LOCK_BLOCKS after posting.
# This prevents escaping a challenged stamp before anyone can respond.
LOCK_BLOCKS   = u256(10)

# After EXPIRE_BLOCKS with no challenger, anyone may call expire() for a
# guaranteed 100% refund to the poster (resolves as EXPIRED / THIN-class).
EXPIRE_BLOCKS = u256(200)

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
    posted_at_block: u256   # block when post_stamp() was called

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

    def _pay(self, account: str, amount: u256):
        if amount <= u256(0):
            return
        addr = Address(account)
        try:
            _Recipient(addr).emit_transfer(value=amount)
        except Exception:
            current_credit = self.credits.get(addr, u256(0))
            self.credits[addr] = current_credit + amount

    @public.write
    def withdraw(self):
        caller = message.sender_address
        amount = self.credits.get(caller, u256(0))
        if amount == u256(0):
            raise gl.vm.UserError("No credits")

        # Zero the balance before transfer (CEI pattern)
        self.credits[caller] = u256(0)

        # Transfer the funds back to the caller
        try:
            _Recipient(caller).emit_transfer(value=amount)
        except Exception:
            # Revert the zeroing if transfer fails
            self.credits[caller] = amount
            raise gl.vm.UserError("Transfer failed")

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
            stamper="",
            posted_at_block=message.block_number
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
            "result_reason": stamp.result_reason,
            "posted_at_block": str(stamp.posted_at_block),
            "lock_until_block": str(stamp.posted_at_block + LOCK_BLOCKS),
            "expire_at_block": str(stamp.posted_at_block + EXPIRE_BLOCKS)
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

        # ── Self-resolution guard ──────────────────────────────────────────
        # The poster is not allowed to stamp their own claim. This prevents
        # them from manipulating the resolution outcome.
        if str(caller) == str(stamp.poster):
            raise gl.vm.UserError("Poster cannot self-resolve")

        # ── Expire guard ───────────────────────────────────────────────────
        # If the stamp has passed the expiry window, it must be settled via
        # expire() instead, not match().
        elapsed = message.block_number - stamp.posted_at_block
        if elapsed >= EXPIRE_BLOCKS:
            raise gl.vm.UserError("Stamp has expired — use expire()")

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
            self._pay(str(poster), value)
            stamp.state = "THIN"
            stamp.result_reason = result.get("reason", "")
        else:
            ret_status = result.get("status", "")
            if not ret_status:
                self._pay(str(poster), value)
                stamp.state = "THIN"
                stamp.result_reason = "Empty status returned"
            elif ret_status == expected_status:
                protocol_fee = u256(int(value) * 25 // 1000)
                poster_share = value - protocol_fee

                owner_str = self.config.get("owner", str(caller))

                self._pay(owner_str, protocol_fee)
                self._pay(str(poster), poster_share)

                stamp.state = "MATCH"
                stamp.result_overall_status = ret_status
            else:
                self._pay(str(caller), value)
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

        # ── Lock-in window check ───────────────────────────────────────────
        # Cancellation is forbidden within the first LOCK_BLOCKS after posting.
        # This prevents a poster from escaping accountability by canceling the
        # moment a challenger appears.
        elapsed = message.block_number - stamp.posted_at_block
        if elapsed < LOCK_BLOCKS:
            raise gl.vm.UserError("Stamp is locked for 10 blocks after posting — cannot cancel yet")

        # ── Expire window check ────────────────────────────────────────────
        # After EXPIRE_BLOCKS the poster must use expire() instead of cancel().
        if elapsed >= EXPIRE_BLOCKS:
            raise gl.vm.UserError("Stamp has expired — use expire() to reclaim bond")

        self._pay(str(caller), stamp.bond)

        stamp.state = "CANCELED"
        stamp.result_reason = "Canceled by poster"
        self.stamps[stamp_id] = stamp

    @public.write
    def expire(self, stamp_id: str):
        """
        Anyone may call expire() on a PENDING stamp that has surpassed
        EXPIRE_BLOCKS without being challenged. Resolves as EXPIRED and
        refunds the full bond to the original poster.

        This prevents bonds being permanently locked if nobody challenges.
        """
        if stamp_id not in self.stamps:
            raise gl.vm.UserError("Stamp not found")
        stamp = self.stamps[stamp_id]
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")

        elapsed = message.block_number - stamp.posted_at_block
        if elapsed < EXPIRE_BLOCKS:
            raise gl.vm.UserError("Stamp has not expired yet")

        self._pay(str(stamp.poster), stamp.bond)

        stamp.state = "EXPIRED"
        stamp.result_reason = "Expired with no challenger — bond returned to poster"
        stamp.stamper = str(message.sender_address)
        self.stamps[stamp_id] = stamp
