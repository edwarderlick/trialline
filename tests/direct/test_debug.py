def test_print_gl(direct_deploy, capsys):
    from contracts.trialline import TrialLine
    import json
    # Deploy contract
    contract = direct_deploy(TrialLine)
    
    # Call dump_api
    result = contract.dump_api()
    print("DUMP API RESULT:\n", json.dumps(json.loads(result), indent=2))
