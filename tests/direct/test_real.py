import pytest

def test_deploy(direct_deploy, direct_owner):
    from contracts.trialline import TrialLine
    contract = direct_deploy(TrialLine, _from=direct_owner)
    assert contract is not None

def test_post_stamp_match(direct_deploy, direct_owner, direct_alice, direct_bob):
    from contracts.trialline import TrialLine
    contract = direct_deploy(TrialLine, _from=direct_owner)
    contract.post_stamp("NCT04470427", "COMPLETED", "nonce0", value=1000, _from=direct_alice)
    
    # We can also test match
    stamp_id = contract.list_ids()[0]
    contract.match(stamp_id, _from=direct_bob)
