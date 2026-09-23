# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }
import datetime
import json
import hashlib
from dataclasses import dataclass
import genlayer as gl
from genlayer import *

# Challenge window measured from the transaction timestamp. GenVM exposes
# message.datetime, not a block number. Cancel and expire are refused for
# this entire window so a poster cannot front-run a challenge.
CHALLENGE_WINDOW_SECONDS = 600

# 25 / 1000 = 2.5%
PROTOCOL_FEE_BPS = 25


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
    posted_at_unix: u256


def fetch_nih(nct: str) -> str:
    url = f"https://clinicaltrials.gov/api/v2/studies/{nct}"
    try:
        headers = {"Accept": "application/json", "User-Agent": "Mozilla/5.0"}
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


def _tx_unix() -> int:
    raw = getattr(message, "raw", None)
    stamp = raw.get("datetime") if isinstance(raw, dict) else None
    if not stamp:
        stamp = getattr(message, "datetime", None)
    if not stamp:
        raise gl.vm.UserError("Transaction time unavailable")
    text = str(stamp).strip().replace("Z", "+00:00")
    parsed = datetime.datetime.fromisoformat(text)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=datetime.timezone.utc)
    return int(parsed.timestamp())


class TrialLine(contract.Contract):
    config: storage.TreeMap[str, str]
    stamps: storage.TreeMap[str, StampRecord]
    credits: storage.TreeMap[Address, u256]

    def __init__(self):
        self.config["owner"] = str(message.sender_address)

    def _credit(self, account: Address, amount: u256):
        if amount <= u256(0):
            return
        current = self.credits.get(account, u256(0))
        self.credits[account] = current + amount

    def _window_open(self, stamp: StampRecord) -> bool:
        return _tx_unix() < int(stamp.posted_at_unix) + CHALLENGE_WINDOW_SECONDS

    @public.view
    def get_rules(self) -> str:
        return json.dumps({
            "challenge_window_seconds": CHALLENGE_WINDOW_SECONDS,
            "protocol_fee_bps": PROTOCOL_FEE_BPS,
        })

    @public.write
    def withdraw(self):
        """Pay credited bond claims out of the contract balance."""
        caller = message.sender_address
        amount = self.credits.get(caller, u256(0))
        if amount == u256(0):
            raise gl.vm.UserError("No credits")

        self.credits[caller] = u256(0)
        try:
            chain.Account(caller).emit_transfer(value=amount)
        except Exception:
            self.credits[caller] = amount
            raise gl.vm.UserError("Transfer failed")

    @public.write.payable
    def post_stamp(self, nct: str, status: str, nonce: str) -> str:
        """
        Lock the attached GEN as the bond for a claimed NIH status.
        The bond is message.value. It is not minted, and it is not
        credited back until match, thin, or a post-window expire.
        """
        caller = message.sender_address
        bond = message.value
        if bond <= u256(0):
            raise gl.vm.UserError("Bond required")

        norm_nct = nct.strip().upper().replace(" ", "")
        if len(norm_nct) != 11 or not norm_nct.startswith("NCT") or not norm_nct[3:].isdigit():
            raise gl.vm.UserError("Invalid NCT ID format")

        valid_statuses = [
            "RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING",
            "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED",
            "WITHDRAWN", "SUSPENDED"
        ]
        if status not in valid_statuses:
            raise gl.vm.UserError("Invalid status")

        if len(nonce) < 1:
            raise gl.vm.UserError("Nonce required")

        posted_at = _tx_unix()
        h_ctx = hashlib.sha256(
            str(caller).encode("utf-8") +
            str(int(bond)).encode("utf-8") +
            str(nonce).encode("utf-8") +
            str(norm_nct).encode("utf-8") +
            str(status).encode("utf-8") +
            str(posted_at).encode("utf-8")
        ).hexdigest()

        if self.stamps.get(h_ctx) is not None:
            raise gl.vm.UserError("Stamp already exists")

        self.stamps[h_ctx] = StampRecord(
            id=h_ctx,
            poster=caller,
            nct_id=norm_nct,
            status=status,
            bond=bond,
            state="PENDING",
            result_overall_status="",
            result_brief_title="",
            result_reason="",
            stamper="",
            posted_at_unix=u256(posted_at),
        )
        return h_ctx

    @public.view
    def get_stamp(self, stamp_id: str) -> str:
        if self.stamps.get(stamp_id) is None:
            return "{}"
        stamp = self.stamps[stamp_id]
        posted = int(stamp.posted_at_unix)
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
            "posted_at_unix": str(posted),
            "expires_at_unix": str(posted + CHALLENGE_WINDOW_SECONDS),
            "challenge_window_seconds": CHALLENGE_WINDOW_SECONDS,
        })

    @public.view
    def list_ids(self) -> list:
        return list(self.stamps.keys())

    @public.view
    def get_credit(self, account: str) -> str:
        return str(self.credits.get(Address(account), u256(0)))

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
            "credits_outstanding": str(credits_out),
            "challenge_window_seconds": CHALLENGE_WINDOW_SECONDS,
        })

    @public.write
    def match(self, stamp_id: str):
        """
        Challenge a PENDING stamp inside the window.
        MATCH — poster was right: bond minus fee back to the poster
        MISS  — poster was wrong: full bond to the challenger
        THIN  — NIH data unusable: full bond back to the poster
        """
        caller = message.sender_address
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")
        if str(caller) == str(stamp.poster):
            raise gl.vm.UserError("Poster cannot self-resolve")
        if not self._window_open(stamp):
            raise gl.vm.UserError("Challenge window closed — use expire()")

        value = stamp.bond
        poster = stamp.poster
        expected_status = stamp.status

        try:
            result_str = gl.eq_principle.strict_eq(lambda: fetch_nih(stamp.nct_id))
            result = json.loads(result_str)
            kind = result.get("kind", "THIN")
        except Exception:
            kind = "THIN"
            result = {"kind": "THIN", "reason": "Consensus mismatch or error"}

        if kind == "THIN":
            self._credit(poster, value)
            stamp.state = "THIN"
            stamp.result_reason = result.get("reason", "")
        else:
            ret_status = result.get("status", "")
            if not ret_status:
                self._credit(poster, value)
                stamp.state = "THIN"
                stamp.result_reason = "Empty status returned"
            elif ret_status == expected_status:
                protocol_fee = u256(int(value) * PROTOCOL_FEE_BPS // 1000)
                poster_share = value - protocol_fee
                owner_str = self.config.get("owner", str(caller))
                self._credit(Address(owner_str), protocol_fee)
                self._credit(poster, poster_share)
                stamp.state = "MATCH"
                stamp.result_overall_status = ret_status
            else:
                self._credit(caller, value)
                stamp.state = "MISS"
                stamp.result_overall_status = ret_status

        stamp.stamper = str(caller)
        self.stamps[stamp_id] = stamp

    @public.write
    def cancel(self, stamp_id: str):
        """
        Cancellation cannot release a bond while a challenge is still possible.
        After the window, the poster must call expire().
        """
        caller = message.sender_address
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")
        if str(caller) != str(stamp.poster):
            raise gl.vm.UserError("Only poster can cancel")
        if self._window_open(stamp):
            raise gl.vm.UserError("Cancel cannot bypass an open challenge")
        raise gl.vm.UserError("Challenge window closed — use expire()")

    @public.write
    def expire(self, stamp_id: str):
        """Refund the original bond to the poster only after the challenge window."""
        stamp = self.stamps.get(stamp_id)
        if stamp is None:
            raise gl.vm.UserError("Stamp not found")
        if stamp.state != "PENDING":
            raise gl.vm.UserError("Not pending")
        if self._window_open(stamp):
            raise gl.vm.UserError("Challenge window still open")

        caller = message.sender_address
        self._credit(stamp.poster, stamp.bond)
        stamp.state = "EXPIRED"
        stamp.result_reason = "Challenge window elapsed with no challenger"
        stamp.stamper = str(caller)
        self.stamps[stamp_id] = stamp
