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
gl_mock.message.block_number = 100
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


def _fund(contract, addr, amount):
    """Helper: directly credit an address (simulates calling fund())"""
    contract.credits[addr] = contract.credits.get(addr, 0) + amount


def test_post_stamp_unique_hashes(contract):
    _fund(contract, "0xPoster", 5000)
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0

    hashes = set()
    for i in range(5):
        stamp_id = contract.post_stamp("NCT00000001", "COMPLETED", f"nonce{i}", 5)
        hashes.add(stamp_id)

    assert len(hashes) == 5


def test_match(contract):
    _fund(contract, "0xPoster", 1000)
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1", 1000)

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})

        contract.match(stamp_id)

        assert contract.credits.get("0xOwner", 0) == 25
        assert contract.credits.get("0xPoster", 0) == 975

        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "MATCH"


def test_miss(contract):
    _fund(contract, "0xPoster", 1000)
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1", 1000)

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "RECRUITING"})

        contract.match(stamp_id)

        assert contract.credits.get("0xOwner", 0) == 0
        assert contract.credits.get("0xPoster", 0) == 0
        assert contract.credits.get("0xStamper", 0) == 1000

        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "MISS"
        assert stamp["stamper"] == "0xStamper"


def test_thin(contract):
    _fund(contract, "0xPoster", 1000)
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1", 1000)

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        strict_eq_mock.return_value = json.dumps({"kind": "THIN", "reason": "404"})

        contract.match(stamp_id)

        assert contract.credits.get("0xOwner", 0) == 0
        assert contract.credits.get("0xStamper", 0) == 0
        assert contract.credits.get("0xPoster", 0) == 1000

        stamp = json.loads(contract.get_stamp(stamp_id))
        assert stamp["status"] == "THIN"


def test_post_stamp_invalid_nct(contract):
    _fund(contract, "0xPoster", 1000)
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0

    with pytest.raises(Exception, match="Invalid NCT ID format"):
        contract.post_stamp("INVALID123", "COMPLETED", "nonce1", 1000)


def test_post_stamp_insufficient_credits(contract):
    """post_stamp should fail if the caller doesn't have enough credits."""
    gl_mock.message.sender_address = "0xBroke"
    gl_mock.message.value = 0

    with pytest.raises(Exception, match="Insufficient credits"):
        contract.post_stamp("NCT00000001", "COMPLETED", "nonce1", 100)


def test_fund_via_inline_value(contract):
    """post_stamp accepts inline message.value to top-up credits in same tx."""
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 5000  # inline funding

    stamp_id = contract.post_stamp("NCT00000001", "COMPLETED", "nonce1", 1000)

    # Credits should be 5000 (funded) - 1000 (bond) = 4000
    assert contract.credits.get("0xPoster", 0) == 4000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "PENDING"


def test_withdraw_success(contract):
    gl_mock.message.sender_address = "0xPoster"
    contract.credits["0xPoster"] = 5000

    from contracts.trialline import _Recipient
    original_emit = _Recipient.emit_transfer

    try:
        def mock_emit(self, value):
            self._transfer_called_with_value = value

        _Recipient.emit_transfer = mock_emit

        contract.withdraw()

        assert contract.credits.get("0xPoster", 0) == 0
    finally:
        _Recipient.emit_transfer = original_emit


def test_withdraw_failure_preserves_credit(contract):
    gl_mock.message.sender_address = "0xPoster"
    contract.credits["0xPoster"] = 5000

    from contracts.trialline import _Recipient
    original_emit = _Recipient.emit_transfer

    try:
        def mock_emit(self, value):
            raise Exception("Transfer failed")

        _Recipient.emit_transfer = mock_emit

        with pytest.raises(Exception, match="Transfer failed"):
            contract.withdraw()

        assert contract.credits.get("0xPoster", 0) == 5000
    finally:
        _Recipient.emit_transfer = original_emit


def test_withdraw_no_funds(contract):
    gl_mock.message.sender_address = "0xPoorPerson"

    with pytest.raises(Exception, match="No credits"):
        contract.withdraw()


def test_self_resolution_blocked(contract):
    """Poster cannot call match() on their own stamp."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0
    _fund(contract, "0xPoster", 1000)

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_self", 1000)

    with patch.object(gl_mock.eq_principle, 'strict_eq') as strict_eq_mock:
        strict_eq_mock.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})
        with pytest.raises(Exception, match="Poster cannot self-resolve"):
            contract.match(stamp_id)


def test_expire_after_window(contract):
    """Anyone can expire a stamp after EXPIRE_BLOCKS (200) with no challenger."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0
    _fund(contract, "0xPoster", 3000)

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_expire", 3000)

    # Move to block 305 — elapsed = 205 > EXPIRE_BLOCKS(200)
    gl_mock.message.block_number = 305
    gl_mock.message.sender_address = "0xAnyone"
    contract.expire(stamp_id)

    assert contract.credits.get("0xPoster", 0) == 3000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "EXPIRED"


def test_expire_before_window_fails(contract):
    """expire() must fail if stamp has not yet passed EXPIRE_BLOCKS."""
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    gl_mock.message.value = 0
    _fund(contract, "0xPoster", 1000)

    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_early", 1000)

    # Block 150 — elapsed = 50 < EXPIRE_BLOCKS(200)
    gl_mock.message.block_number = 150
    gl_mock.message.sender_address = "0xAnyone"
    with pytest.raises(Exception, match="Stamp has not expired yet"):
        contract.expire(stamp_id)
