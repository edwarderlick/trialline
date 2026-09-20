import json
import hashlib
import urllib.request
import urllib.error
import typing
import genlayer.std as gl

@gl.evm.contract_interface
class _Recipient:
    class View: pass
    class Write: pass

@gl.contract
class TrialLine:
    def __init__(self):
        self.owner = gl.msg.sender
        self.stamps = gl.HashMap(str, dict)
        self.credits = gl.HashMap(str, int)

    def _pay(self, to: str, amount: int) -> bool:
        if amount == 0: return True
        try:
            _Recipient(to).emit_transfer(value=amount)
            return True
        except Exception:
            return False

    @gl.public.write
    def withdraw(self):
        caller = gl.msg.sender
        amount = self.credits.get(caller, 0)
        if amount == 0:
            raise gl.vm.UserError("No credits")
            
        paid = self._pay(caller, amount)
        if not paid:
            raise gl.vm.UserError("Transfer failed")
        # Do NOT zero out before paying
        self.credits[caller] = 0

    @gl.public.write
    def post_stamp(self, nct: str, status: str, nonce: str) -> str:
        caller = gl.msg.sender
        value = gl.msg.value
        if value <= 0:
            raise gl.vm.UserError("Value must be > 0")
            
        dt = str(gl.block.timestamp)
        # origin + sender + datetime + value + nct + status + nonce
        origin = str(gl.tx.origin)
        raw_id = origin + str(caller) + dt + str(value) + nct + status + nonce
        stamp_id = hashlib.sha256(raw_id.encode('utf-8')).hexdigest()
        
        if stamp_id in self.stamps:
            raise gl.vm.UserError("Stamp already exists")
            
        stamp = {
            "id": stamp_id,
            "poster": str(caller),
            "nct": nct,
            "expected_status": status,
            "value": str(value),
            "status": "PENDING",
            "stamper": None,
            "result": None
        }
        self.stamps[stamp_id] = stamp
        return stamp_id
        
    @gl.public.view
    def get_stamp(self, stamp_id: str) -> dict:
        return self.stamps.get(stamp_id)
        
    @gl.public.view
    def list_ids(self) -> list:
        return list(self.stamps.keys())

    @gl.public.view
    def get_economics(self) -> dict:
        return {"total_stamps": len(self.stamps.keys())}
        
    def fetch_nih(self, nct: str) -> str:
        url = f"https://clinicaltrials.gov/api/v2/studies/{nct}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = response.read(32768)
                doc = json.loads(data.decode('utf-8'))
                status = doc.get("protocolSection", {}).get("statusModule", {}).get("overallStatus", "")
                if not status:
                    return json.dumps({"kind": "THIN", "reason": "Missing overallStatus"})
                return json.dumps({"kind": "OK", "status": status})
        except urllib.error.HTTPError as e:
            return json.dumps({"kind": "THIN", "reason": str(e.code)})
        except Exception as e:
            return json.dumps({"kind": "THIN", "reason": "Error"})

    @gl.public.write
    def match(self, stamp_id: str):
        caller = gl.msg.sender
        stamp = self.stamps.get(stamp_id)
        if not stamp:
            raise gl.vm.UserError("Stamp not found")
            
        if stamp["status"] != "PENDING":
            raise gl.vm.UserError("Not pending")
            
        value = int(stamp["value"])
        poster = str(stamp["poster"])
        nct = stamp["nct"]
        expected_status = stamp["expected_status"]
        
        try:
            result_str = gl.eq_principle.strict_eq(self.fetch_nih, [nct])
            result = json.loads(result_str)
            kind = result.get("kind", "THIN")
        except Exception:
            kind = "THIN"
            result = {"kind": "THIN", "reason": "Consensus Mismatch or Error"}
            result_str = json.dumps(result)
            
        if kind == "THIN":
            # 100% refund
            self.credits[poster] = self.credits.get(poster, 0) + value
            stamp["status"] = "THIN"
        elif result.get("status", "") == expected_status:
            # MATCH
            protocol_fee = value * 25 // 1000
            poster_share = value - protocol_fee
            self.credits[self.owner] = self.credits.get(self.owner, 0) + protocol_fee
            self.credits[poster] = self.credits.get(poster, 0) + poster_share
            stamp["status"] = "MATCH"
        else:
            # MISS
            self.credits[caller] = self.credits.get(caller, 0) + value
            stamp["status"] = "MISS"
            
        stamp["stamper"] = str(caller)
        stamp["result"] = result_str
        
        # Write back to storage trap
        self.stamps[stamp_id] = stamp
