import pytest
from unittest.mock import patch, MagicMock
import sys
import json
import hashlib

# Mock genlayer environment
gl_mock = MagicMock()
gl_mock.u256 = int
gl_mock.Address = str
gl_mock.message = MagicMock()
gl_mock.message.block_number = 100  # default block — well past LOCK_BLOCKS (10)
gl_mock.message.sender_address = "0xOwner"
gl_mock.message.value = 0

class HashMapMock(dict):
    def __init__(self, *args, **kwargs):
        super().__init__()
    
    def get(self, key, default=None):
        return super().get(key, default)

gl_mock.HashMap = HashMapMock
gl_mock.storage = MagicMock()
gl_mock.storage.TreeMap = HashMapMock


def passthrough(func_or_cls):
    return func_or_cls

def contract_interface_mock(cls):
    def __init__(self, address):
        self.address = address
    def emit_transfer(self, value):
        raise Exception("Mock transfer failure to trigger credits fallback")
    cls.__init__ = __init__
    cls.emit_transfer = emit_transfer
    return cls

gl_mock.contract = MagicMock()
gl_mock.contract.Contract = object
gl_mock.evm = MagicMock()
gl_mock.evm.contract_interface = contract_interface_mock
gl_mock.public = MagicMock()
gl_mock.public.write = passthrough
gl_mock.public.write.payable = passthrough
gl_mock.public.view = passthrough
gl_mock.public.payable = passthrough
gl_mock.vm = MagicMock()
gl_mock.vm.UserError = Exception
gl_mock.eq_principle = MagicMock()

sys.modules['genlayer'] = gl_mock
sys.modules['genlayer.std'] = gl_mock
gl_mock.storage.allow = passthrough
sys.modules['genlayer.storage'] = gl_mock.storage


@pytest.fixture
def contract():
    # Reset shared message mock to clean defaults for every test
    gl_mock.message.sender_address = "0xOwner"
    gl_mock.message.value = 0
    gl_mock.message.block_number = 100

    # Must reimport fresh each test because module caches gl_mock state
    import importlib
    import contracts.trialline as tl_mod
    importlib.reload(tl_mod)
    TrialLine = tl_mod.TrialLine

    contract_inst = TrialLine.__new__(TrialLine)
    contract_inst.config = HashMapMock()
    contract_inst.stamps = HashMapMock()
    contract_inst.credits = HashMapMock()
    contract_inst.__init__()
    return contract_inst

def test_post_stamp_unique_hashes(contract):
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 5
    gl_mock.message.origin_address = "0xOrigin"
    
    hashes = set()
    for i in range(5):
        stamp_id = contract.post_stamp("NCT00000001", "COMPLETED", f"nonce{i}")
        hashes.add(stamp_id)
        
    assert len(hashes) == 5

def test_match(contract):
    # Setup post
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    gl_mock.message.origin_address = "0xOrigin"
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    # Now simulate a stamper calling match
    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        # Simulate MATCH result
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})
        
        contract.match(stamp_id)
        
        # Check balances
        assert contract.credits.get("0xOwner", 0) == 25
        assert contract.credits.get("0xPoster", 0) == 975
        
        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "MATCH"

def test_miss(contract):
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    gl_mock.message.origin_address = "0xOrigin"
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    # Stamper calls match
    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        # Simulate MISS result
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "RECRUITING"})
        
        contract.match(stamp_id)
        
        # Check balances
        assert contract.credits.get("0xOwner", 0) == 0
        assert contract.credits.get("0xPoster", 0) == 0
        assert contract.credits.get("0xStamper", 0) == 1000
        
        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "MISS"
        assert stamp["stamper"] == "0xStamper"

def test_thin(contract):
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    gl_mock.message.origin_address = "0xOrigin"
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    # Stamper calls match
    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        # Simulate THIN result
        strict_eq_mock.return_value = json.dumps({"kind": "THIN", "reason": "404"})
        
        contract.match(stamp_id)
        
        assert contract.credits.get("0xOwner", 0) == 0
        assert contract.credits.get("0xStamper", 0) == 0
        assert contract.credits.get("0xPoster", 0) == 1000
        
        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "THIN"

def test_post_stamp_invalid_nct(contract):
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    with pytest.raises(Exception, match="Invalid NCT ID format"):
        contract.post_stamp("INVALID123", "COMPLETED", "nonce1")

def test_cancel_stamp_success(contract):
    # Post at block 100, then cancel at block 115 (past lock window of 10, before expire of 200)
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    gl_mock.message.block_number = 115  # elapsed = 15 > LOCK_BLOCKS(10), < EXPIRE_BLOCKS(200)
    contract.cancel(stamp_id)
    
    # Check balance
    assert contract.credits.get("0xPoster", 0) == 1000
    
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "CANCELED"

def test_cancel_stamp_unauthorized(contract):
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    # Try to cancel as someone else
    gl_mock.message.sender_address = "0xHacker"
    with pytest.raises(Exception, match="Only poster can cancel"):
        contract.cancel(stamp_id)

def test_withdraw_success(contract):
    gl_mock.message.sender_address = "0xPoster"
    contract.credits["0xPoster"] = 5000
    
    with patch.object(contract.__class__, '_pay', autospec=True):
        # In withdraw we test emit_transfer, so let's mock it to succeed for this test
        # Actually withdraw calls _Recipient directly, so we just temporarily replace it
        pass
    
    # Let's mock _Recipient to succeed just for this test
    original_mock = gl_mock.evm.contract_interface
    
    def success_mock(cls):
        def __init__(self, address):
            self.address = address
        def emit_transfer(self, value):
            pass # Success!
        cls.__init__ = __init__
        cls.emit_transfer = emit_transfer
        return cls

    from contracts.trialline import _Recipient
    _Recipient.emit_transfer = lambda self, value: None
    
    contract.withdraw()
    
    # After successful withdrawal, balance should be zero
    assert contract.credits.get("0xPoster", 0) == 0
    
    # After successful withdrawal, balance should be zero
    assert contract.credits.get("0xPoster", 0) == 0

def test_withdraw_no_funds(contract):
    gl_mock.message.sender_address = "0xPoorPerson"
    
    with pytest.raises(Exception, match="No credits"):
        contract.withdraw()

# ── Timing & access-control boundary tests ──────────────────────────────────

def test_cancel_during_lockup_fails(contract):
    """Poster cannot cancel within the first 10 blocks after posting."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")
    
    # Try to cancel at block 105 — elapsed = 5 < LOCK_BLOCKS(10)
    gl_mock.message.block_number = 105
    with pytest.raises(Exception, match="Stamp is locked for 10 blocks after posting"):
        contract.cancel(stamp_id)

def test_cancel_after_lockup_succeeds(contract):
    """Poster CAN cancel after the 10-block lock window passes."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 2000
    
    stamp_id = contract.post_stamp("NCT00000999", "RECRUITING", "nonce_lock")
    
    # Cancel at block 111 — elapsed = 11 > LOCK_BLOCKS(10)
    gl_mock.message.block_number = 111
    contract.cancel(stamp_id)
    
    assert contract.credits.get("0xPoster", 0) == 2000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "CANCELED"

def test_self_resolution_blocked(contract):
    """Poster cannot call match() on their own stamp."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_self")
    
    # Poster tries to match their own stamp
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})
        with pytest.raises(Exception, match="Poster cannot self-resolve"):
            contract.match(stamp_id)

def test_expire_after_window(contract):
    """Anyone can expire a stamp after EXPIRE_BLOCKS (200) with no challenger."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 3000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_expire")
    
    # Move to block 305 — elapsed = 205 > EXPIRE_BLOCKS(200)
    gl_mock.message.block_number = 305
    gl_mock.message.sender_address = "0xAnyone"
    contract.expire(stamp_id)
    
    # Full bond returned to poster
    assert contract.credits.get("0xPoster", 0) == 3000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "EXPIRED"

def test_expire_before_window_fails(contract):
    """expire() must fail if stamp has not yet passed EXPIRE_BLOCKS."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 1000
    
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_early")
    
    # Block 150 — elapsed = 50 < EXPIRE_BLOCKS(200)
    gl_mock.message.block_number = 150
    gl_mock.message.sender_address = "0xAnyone"
    with pytest.raises(Exception, match="Stamp has not expired yet"):
        contract.expire(stamp_id)
