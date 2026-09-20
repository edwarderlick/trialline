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

gl_mock.contract = MagicMock()
gl_mock.contract.Contract = object
gl_mock.evm = MagicMock()
gl_mock.evm.contract_interface = passthrough
gl_mock.public = MagicMock()
gl_mock.public.write = passthrough
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
    from contracts.trialline import TrialLine
    
    gl_mock.message.sender_address = "0xOwner"
    contract_inst = TrialLine.__new__(TrialLine)
    contract_inst.config = HashMapMock()
    contract_inst.stamps = HashMapMock()
    contract_inst.credits = HashMapMock()
    contract_inst.__init__()
    
    # We also need to mock _pay for tests
    # Return False so the contract falls back to using the 'credits' mapping
    contract_inst._pay = MagicMock(return_value=False)
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


