import json
import sys

import pytest


def _drop_stub_genlayer():
    """The PyPI `genlayer` package is an empty stub and shadows the SDK."""
    for name in list(sys.modules):
        if name == "genlayer" or name.startswith("genlayer."):
            del sys.modules[name]

BOND = 1000
T0 = "2026-01-01T00:00:00Z"
T_OPEN = "2026-01-01T00:09:59Z"
T_CLOSED = "2026-01-01T00:10:00Z"
NIH = {
    "protocolSection": {
        "statusModule": {"overallStatus": "COMPLETED"},
        "identificationModule": {"briefTitle": "Example"},
    }
}


def set_tx_time(direct_vm, iso: str):
    direct_vm.warp(iso)
    import genlayer.message as msg

    msg.datetime = iso
    raw = getattr(msg, "raw", None)
    if isinstance(raw, dict):
        raw["datetime"] = iso


def account_key(account) -> str:
    if hasattr(account, "as_hex"):
        return account.as_hex
    if isinstance(account, (bytes, bytearray)):
        return "0x" + bytes(account).hex()
    return str(account)


def credit_of(contract, account) -> int:
    return int(contract.get_credit(account_key(account)))


def economics(contract) -> dict:
    return json.loads(contract.get_economics())


def post(contract, direct_vm, sender, nct="NCT00000123", status="COMPLETED", nonce="n1", value=BOND):
    direct_vm.sender = sender
    direct_vm.value = value
    return contract.post_stamp(nct, status, nonce)


@pytest.fixture
def env(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.value = 0
    direct_vm.warp(T0)
    _drop_stub_genlayer()
    contract = direct_deploy("contracts/trialline.py")
    set_tx_time(direct_vm, T0)
    return contract, direct_vm, direct_alice, direct_bob


def test_post_locks_attached_bond_and_does_not_mint(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice)

    assert credit_of(contract, alice) == 0
    assert credit_of(contract, bob) == 0
    econ = economics(contract)
    assert econ["locked_in_open"] == str(BOND)
    assert econ["credits_outstanding"] == "0"

    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "PENDING"
    assert stamp["value"] == str(BOND)
    assert stamp["expected_status"] == "COMPLETED"
    assert int(stamp["expires_at_unix"]) - int(stamp["posted_at_unix"]) == 600


def test_post_rejects_zero_bond(env):
    contract, vm, alice, _bob = env
    with vm.expect_revert("Bond required"):
        post(contract, vm, alice, value=0)


def test_post_rejects_bad_nct_and_status(env):
    contract, vm, alice, _bob = env
    with vm.expect_revert("Invalid NCT ID format"):
        post(contract, vm, alice, nct="NOT_AN_NCT")
    with vm.expect_revert("Invalid status"):
        post(contract, vm, alice, status="UNKNOWN_STATUS", nonce="n2")


def test_self_resolve_cancel_and_expire_cannot_release_bond_during_window(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice)
    set_tx_time(vm, T_OPEN)

    vm.sender = alice
    vm.mock_web(r"clinicaltrials\.gov", {"status": 200, "body": json.dumps(NIH)})
    with vm.expect_revert("Poster cannot self-resolve"):
        contract.match(stamp_id)
    with vm.expect_revert("Cancel cannot bypass an open challenge"):
        contract.cancel(stamp_id)
    with vm.expect_revert("Challenge window still open"):
        contract.expire(stamp_id)

    vm.sender = bob
    with vm.expect_revert("Only poster can cancel"):
        contract.cancel(stamp_id)

    assert credit_of(contract, alice) == 0
    assert json.loads(contract.get_stamp(stamp_id))["status"] == "PENDING"
    assert economics(contract)["locked_in_open"] == str(BOND)


def test_match_pays_poster_minus_fee_from_locked_bond(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice)
    set_tx_time(vm, T_OPEN)
    vm.sender = bob
    vm.mock_web(r"clinicaltrials\.gov", {"status": 200, "body": json.dumps(NIH)})

    contract.match(stamp_id)

    assert credit_of(contract, alice) == 975
    assert credit_of(contract, bob) == 0
    econ = economics(contract)
    assert econ["treasury"] == "25"
    assert econ["locked_in_open"] == "0"
    assert econ["credits_outstanding"] == "1000"
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "MATCH"
    assert stamp["result_overall_status"] == "COMPLETED"


def test_miss_pays_challenger_the_full_locked_bond(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice, status="RECRUITING", nonce="miss")
    set_tx_time(vm, T_OPEN)
    vm.sender = bob
    vm.mock_web(r"clinicaltrials\.gov", {"status": 200, "body": json.dumps(NIH)})

    contract.match(stamp_id)

    assert credit_of(contract, alice) == 0
    assert credit_of(contract, bob) == BOND
    assert economics(contract)["locked_in_open"] == "0"
    assert json.loads(contract.get_stamp(stamp_id))["status"] == "MISS"


def test_thin_refunds_poster_the_original_bond(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice, nonce="thin")
    set_tx_time(vm, T_OPEN)
    vm.sender = bob
    vm.mock_web(r"clinicaltrials\.gov", {"status": 200, "body": "{}"})

    contract.match(stamp_id)

    assert credit_of(contract, alice) == BOND
    assert credit_of(contract, bob) == 0
    assert json.loads(contract.get_stamp(stamp_id))["status"] == "THIN"


def test_window_boundary_blocks_match_and_expire_refunds_exact_bond(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice, nonce="late")
    set_tx_time(vm, T_CLOSED)

    vm.sender = bob
    vm.mock_web(r"clinicaltrials\.gov", {"status": 200, "body": json.dumps(NIH)})
    with vm.expect_revert("Challenge window closed — use expire()"):
        contract.match(stamp_id)

    vm.sender = alice
    with vm.expect_revert("Challenge window closed — use expire()"):
        contract.cancel(stamp_id)

    assert credit_of(contract, alice) == 0
    contract.expire(stamp_id)

    assert credit_of(contract, alice) == BOND
    assert economics(contract)["locked_in_open"] == "0"
    assert economics(contract)["credits_outstanding"] == str(BOND)
    stamp = json.loads(contract.get_stamp(stamp_id))
    assert stamp["status"] == "EXPIRED"

    with vm.expect_revert("Not pending"):
        contract.expire(stamp_id)


def test_withdraw_pays_the_credited_bond(env):
    contract, vm, alice, bob = env
    stamp_id = post(contract, vm, alice, nonce="wd")
    set_tx_time(vm, T_CLOSED)
    vm.sender = alice
    contract.expire(stamp_id)
    assert credit_of(contract, alice) == BOND

    contract.withdraw()
    assert credit_of(contract, alice) == 0

    vm.sender = bob
    with vm.expect_revert("No credits"):
        contract.withdraw()
