import pytest
from unittest.mock import patch, MagicMock
import sys
import json

# Mock genlayer environment
gl_mock = MagicMock()
gl_mock.u256 = int
gl_mock.Address = str
gl_mock.message = MagicMock()
gl_mock.message.block_number = 100
gl_mock.message.sender_address = "0xOwner"
gl_mock.message.value = 0

class HashMapMock(dict):
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
        raise Exception("Mock: fallback to credits")
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
    gl_mock.message.sender_address = "0xOwner"
    gl_mock.message.value = 0
    gl_mock.message.block_number = 100

    import importlib
    import contracts.trialline as tl_mod
    importlib.reload(tl_mod)
    TrialLine = tl_mod.TrialLine

    c = TrialLine.__new__(TrialLine)
    c.config = HashMapMock()
    c.stamps = HashMapMock()
    c.credits = HashMapMock()
    c.__init__()
    return c


def test_post_stamp_unique_hashes(contract):
    gl_mock.message.sender_address = "0xPoster"
    hashes = set()
    for i in range(5):
        stamp_id = contract.post_stamp("NCT00000001", "COMPLETED", f"nonce{i}")
        hashes.add(stamp_id)
    assert len(hashes) == 5


def test_match(contract):
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as mock_eq:
        mock_eq.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})
        contract.match(stamp_id)

    # FIXED_BOND=1000, fee=25, poster_share=975
    assert contract.credits.get("0xOwner", 0) == 25
    assert contract.credits.get("0xPoster", 0) == 975
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "MATCH"


def test_miss(contract):
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as mock_eq:
        mock_eq.return_value = json.dumps({"kind": "OK", "status": "RECRUITING"})
        contract.match(stamp_id)

    assert contract.credits.get("0xPoster", 0) == 0
    assert contract.credits.get("0xStamper", 0) == 1000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "MISS"


def test_thin(contract):
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce1")

    gl_mock.message.sender_address = "0xStamper"
    with patch.object(gl_mock.eq_principle, 'strict_eq') as mock_eq:
        mock_eq.return_value = json.dumps({"kind": "THIN", "reason": "404"})
        contract.match(stamp_id)

    assert contract.credits.get("0xPoster", 0) == 1000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "THIN"


def test_post_stamp_invalid_nct(contract):
    gl_mock.message.sender_address = "0xPoster"
    with pytest.raises(Exception, match="Invalid NCT ID format"):
        contract.post_stamp("INVALID123", "COMPLETED", "nonce1")


def test_post_stamp_invalid_status(contract):
    gl_mock.message.sender_address = "0xPoster"
    with pytest.raises(Exception, match="Invalid status"):
        contract.post_stamp("NCT00000001", "UNKNOWN_STATUS", "nonce1")


def test_post_stamp_empty_nonce(contract):
    gl_mock.message.sender_address = "0xPoster"
    with pytest.raises(Exception, match="Nonce required"):
        contract.post_stamp("NCT00000001", "COMPLETED", "")


def test_withdraw_success(contract):
    gl_mock.message.sender_address = "0xPoster"
    contract.credits["0xPoster"] = 5000

    from contracts.trialline import _Recipient
    original = _Recipient.emit_transfer
    try:
        _Recipient.emit_transfer = lambda self, value: None  # success
        contract.withdraw()
        assert contract.credits.get("0xPoster", 0) == 0
    finally:
        _Recipient.emit_transfer = original


def test_withdraw_failure_preserves_credit(contract):
    gl_mock.message.sender_address = "0xPoster"
    contract.credits["0xPoster"] = 5000

    from contracts.trialline import _Recipient
    original = _Recipient.emit_transfer
    try:
        def fail(self, value): raise Exception("Transfer failed")
        _Recipient.emit_transfer = fail
        with pytest.raises(Exception, match="Transfer failed"):
            contract.withdraw()
        assert contract.credits.get("0xPoster", 0) == 5000
    finally:
        _Recipient.emit_transfer = original


def test_withdraw_no_funds(contract):
    gl_mock.message.sender_address = "0xBroke"
    with pytest.raises(Exception, match="No credits"):
        contract.withdraw()


def test_self_resolution_blocked(contract):
    gl_mock.message.block_number = 100
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_self")

    with patch.object(gl_mock.eq_principle, 'strict_eq') as mock_eq:
        mock_eq.return_value = json.dumps({"kind": "OK", "status": "COMPLETED"})
        with pytest.raises(Exception, match="Poster cannot self-resolve"):
            contract.match(stamp_id)


def test_expire_succeeds_for_poster(contract):
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_expire")

    # Poster can expire
    contract.expire(stamp_id)

    assert contract.credits.get("0xPoster", 0) == 1000
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "EXPIRED"


def test_expire_fails_for_non_poster(contract):
    gl_mock.message.sender_address = "0xPoster"
    stamp_id = contract.post_stamp("NCT00000123", "COMPLETED", "nonce_early")

    # Non-poster cannot expire
    gl_mock.message.sender_address = "0xAnyone"
    with pytest.raises(Exception, match="Only poster can expire stamps manually"):
        contract.expire(stamp_id)
