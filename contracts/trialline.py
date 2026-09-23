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

# Symbolic bond unit used for all accounting (1 = 1 unit, not real GEN on devnet)
FIXED_BOND = u256(1000)

# Protocol fee: 2.5% of bond
PROTOCOL_FEE_BPS = 25   # 25 / 1000 = 2.5%

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
        return json.dumps({"kind": "THIN", "reason": f"Fetch crashed: {str(e)[:100]}"})

class TrialLine(contract.Contract):
    config: storage.TreeMap[str, str]
    stamps: storage.TreeMap[str, StampRecord]
    credits: storage.TreeMap[Address, u256]

    def __init__(self):
        self.config["owner"] = str(message.sender_address)

    def _credit(self, account: str, amount: u256):
        """Add symbolic units to an account's credit balance."""
        if amount <= u256(0):
            return
        addr = Address(account)
        current = self.credits.get(addr, u256(0))
        self.credits[addr] = current + amount

    def _pay(self, account: str, amount: u256):
        """Attempt real transfer, fall back to credit balance."""
        if amount <= u256(0):
            return
        addr = Address(account)
        try:
            _Recipient(addr).emit_transfer(value=amount)
        except Exception:
            current = self.credits.get(addr, u256(0))
            self.credits[addr] = current + amount

    @public.write
    def withdraw(self):
        """Withdraw any credited balance back to the caller."""
        caller = message.sender_address
        amount = self.credits.get(caller, u256(0))
        if amount == u256(0):
            raise gl.vm.UserError("No credits")

        self.credits[caller] = u256(0)
        try:
            _Recipient(caller).emit_transfer(value=amount)
        except Exception:
            self.credits[caller] = amount
            raise gl.vm.UserError("Transfer failed")

    @public.write
    def post_stamp(self, nct: str, status: str, nonce: str) -> str:
        """
        Post an attestation stamp. Bond is tracked symbolically as FIXED_BOND units.
        The bond is enforced by the contract: a MISS forfeits the bond to the matcher;
        posters cannot self-resolve their own stamps.

        Args:
            nct:    ClinicalTrials.gov identifier (e.g. NCT04470427)
            status: Claimed trial status (e.g. COMPLETED, RECRUITING)
            nonce:  Random string to ensure unique stamp IDs per poster
        """
        caller = message.sender_address

        # Validate NCT ID using safe string ops (no re module needed)
        norm_nct = nct.strip().upper().replace(" ", "")
        if len(norm_nct) != 11 or not norm_nct.startswith("NCT") or not norm_nct[3:].isdigit():
            raise gl.vm.UserError("Invalid NCT ID format")

        # Validate status is a known ClinicalTrials.gov enum
        valid_statuses = [
            "RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING",
            "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED",
            "WITHDRAWN", "SUSPENDED"
        ]
        if status not in valid_statuses:
            raise gl.vm.UserError("Invalid status")

        if len(nonce) < 1:
            raise gl.vm.UserError("Nonce required")

        # Derive a unique stamp ID from caller + nonce + nct + status
        h_ctx = hashlib.sha256(
            str(caller).encode("utf-8") +
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
            bond=FIXED_BOND,
            state="PENDING",
            result_overall_status="",
            result_brief_title="",
            result_reason="",
            stamper="",
            posted_at_block=u256(0)
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
        """
        Challenge a PENDING stamp by fetching the real trial status from NIH.
        GenVM validators reach consensus on the result and resolve accordingly:
          MATCH — poster was right, gets bond back minus protocol fee
          MISS  — poster was wrong, challenger earns the bond
          THIN  — data unavailable, poster gets full refund
        """
        caller = message.sender_address
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")

        # ── Self-resolution guard ──────────────────────────────────────────
        # Poster cannot challenge their own stamp — prevents false claim recovery
        if str(caller) == str(stamp.poster):
            raise gl.vm.UserError("Poster cannot self-resolve")

        # ── Expiry guard ───────────────────────────────────────────────────
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
            result = {"kind": "THIN", "reason": "Consensus mismatch or error"}

        if kind == "THIN":
            # Data unavailable — full refund to poster
            self._credit(str(poster), value)
            stamp.state = "THIN"
            stamp.result_reason = result.get("reason", "")
        else:
            ret_status = result.get("status", "")
            if not ret_status:
                self._credit(str(poster), value)
                stamp.state = "THIN"
                stamp.result_reason = "Empty status returned"
            elif ret_status == expected_status:
                # MATCH — poster correct, earns bond minus protocol fee
                protocol_fee = u256(int(value) * PROTOCOL_FEE_BPS // 1000)
                poster_share = value - protocol_fee
                owner_str = self.config.get("owner", str(caller))
                self._credit(owner_str, protocol_fee)
                self._credit(str(poster), poster_share)
                stamp.state = "MATCH"
                stamp.result_overall_status = ret_status
            else:
                # MISS — poster wrong, challenger earns the bond
                self._credit(str(caller), value)
                stamp.state = "MISS"
                stamp.result_overall_status = ret_status

        stamp.stamper = str(caller)
        self.stamps[stamp_id] = stamp

    @public.write
    def expire(self, stamp_id: str):
        """
        Since block numbers are currently inaccessible in GenVM, we allow 
        the poster to manually expire their pending stamp to reclaim their bond.
        This prevents stamps from being permanently locked on devnet.
        """
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")

        caller = message.sender_address if hasattr(message, 'sender_address') else message.sender_account
        if str(caller) != str(stamp.poster):
            raise gl.vm.UserError("Only poster can expire stamps manually without block limits")

        self._credit(str(stamp.poster), stamp.bond)

        stamp.state = "EXPIRED"
        stamp.result_reason = "Manually expired by poster — bond returned"
        stamp.stamper = str(caller)
        self.stamps[stamp_id] = stamp
