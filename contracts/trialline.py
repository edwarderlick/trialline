# { "Depends": "py-genlayer:test" }
import json
import hashlib
from dataclasses import dataclass
import genlayer as gl
from genlayer import *

@evm.contract_interface
class _Recipient:
    class View: pass
    class Write: pass

# After EXPIRE_BLOCKS with no challenger, anyone may call expire() for a
# guaranteed 100% refund to the poster (resolves as EXPIRED / THIN-class).
EXPIRE_BLOCKS = u256(200)

# Minimum bond required to post a stamp (1 GEN = 1e18 wei equivalent in u256)
MIN_BOND = u256(1)

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

    @public.write.payable
    def fund(self):
        """
        Deposit GEN to your credits balance for use as bond collateral.
        Call this before post_stamp if you need to pre-fund your account.
        """
        caller = message.sender_address
        value = message.value
        if value <= u256(0):
            raise gl.vm.UserError("Must send GEN to fund")
        current = self.credits.get(caller, u256(0))
        self.credits[caller] = current + value

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

    @public.write
    def post_stamp(self, nct: str, status: str, nonce: str, bond_amount: u256) -> str:
        """
        Post a new attestation stamp. The bond_amount is deducted from
        the caller's credits balance (pre-fund via fund() or via message.value).

        bond_amount: amount in wei (u256) to lock as collateral.
        """
        caller = message.sender_address

        # Also accept inline value top-up in the same tx
        inline_value = message.value
        if inline_value > u256(0):
            current = self.credits.get(caller, u256(0))
            self.credits[caller] = current + inline_value

        # Validate bond_amount
        if bond_amount < MIN_BOND:
            raise gl.vm.UserError("Bond must be >= 1")

        # Validate NCT ID — no regex, safe string ops only
        norm_nct = nct.strip().upper().replace(" ", "")
        if len(norm_nct) != 11 or not norm_nct.startswith("NCT") or not norm_nct[3:].isdigit():
            raise gl.vm.UserError("Invalid NCT ID format")

        # Validate status is a known enum
        valid_statuses = [
            "RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING",
            "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED",
            "WITHDRAWN", "SUSPENDED"
        ]
        if status not in valid_statuses:
            raise gl.vm.UserError("Invalid status")

        # Deduct bond from credits
        balance = self.credits.get(caller, u256(0))
        if balance < bond_amount:
            raise gl.vm.UserError("Insufficient credits — call fund() first")
        self.credits[caller] = balance - bond_amount

        h_ctx = hashlib.sha256(
            str(caller).encode("utf-8") +
            str(bond_amount).encode("utf-8") +
            str(nonce).encode("utf-8") +
            str(norm_nct).encode("utf-8") +
            str(status).encode("utf-8")
        ).hexdigest()

        stamp_id = h_ctx

        if self.stamps.get(stamp_id) is not None:
            raise gl.vm.UserError("Stamp already exists")

        stamp = StampRecord(
            id=stamp_id,
            poster=caller,
            nct_id=norm_nct,
            status=status,
            bond=bond_amount,
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
        if self.stamps.get(stamp_id) is None:
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
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")

        # ── Self-resolution guard ──────────────────────────────────────────
        if str(caller) == str(stamp.poster):
            raise gl.vm.UserError("Poster cannot self-resolve")

        # ── Expire guard ───────────────────────────────────────────────────
        elapsed = message.block_number - stamp.posted_at_block
        if elapsed >= EXPIRE_BLOCKS:
            raise gl.vm.UserError("Stamp has expired — use expire()")

        value = stamp.bond
        poster = stamp.poster
        nct = stamp.nct_id
        expected_status = stamp.status

        try:
            result_str = gl.eq_principle.strict_eq(lambda: fetch_nih(nct))
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
    def expire(self, stamp_id: str):
        """
        Anyone may call expire() on a PENDING stamp that has surpassed
        EXPIRE_BLOCKS without being challenged. Resolves as EXPIRED and
        refunds the full bond to the original poster.
        """
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
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
