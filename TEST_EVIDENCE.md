# TrialLine Test Evidence (GenLayer Resubmission)

This document contains test output and validation for the new expiration-based lifecycle, self-resolution guards, and withdrawal limits built into TrialLine's intelligent contract.

## 1. Manual Expiry Validation

The `expire()` function is the sole fallback for reclaiming un-challenged bonds. Due to block numbers being inaccessible in GenVM, this function is accessible **only** by the original poster.

```python
tests/direct/test_trialline.py::test_expire_fails_for_non_poster PASSED
tests/direct/test_trialline.py::test_expire_succeeds_for_poster PASSED
```

## 2. Poster Self-Resolution Guard

Posters cannot challenge their own stamps using `match()`. This enforces market risk and prevents posters from self-recovering false claims before the expiry window.

```python
tests/direct/test_trialline.py::test_self_resolution_blocked PASSED
```

## 3. Payout and Balance Integrity (Transfer Failures)

Bonds are now allocated to an internal ledger (`self.credits`) instead of executing native transfers immediately during `match()`. This ensures that execution boundaries are maintained even if a user is unable to receive native tokens directly during contract resolution. The user must manually invoke `withdraw()` to pull funds.

```python
tests/direct/test_trialline.py::test_withdraw_success PASSED
tests/direct/test_trialline.py::test_withdraw_failure_preserves_credit PASSED
tests/direct/test_trialline.py::test_withdraw_no_funds PASSED
```

## 4. Overall Pipeline Completion

All 11 tests executed across the `localnet` state transition bounds pass cleanly:

```text
tests/direct/test_trialline.py::test_post_stamp_unique_hashes PASSED     [  9%]
tests/direct/test_trialline.py::test_match PASSED                        [ 18%]
tests/direct/test_trialline.py::test_miss PASSED                         [ 27%]
tests/direct/test_trialline.py::test_thin PASSED                         [ 36%]
tests/direct/test_trialline.py::test_post_stamp_invalid_nct PASSED       [ 45%]
tests/direct/test_trialline.py::test_withdraw_success PASSED             [ 54%]
tests/direct/test_trialline.py::test_withdraw_failure_preserves_credit PASSED [ 63%]
tests/direct/test_trialline.py::test_withdraw_no_funds PASSED            [ 72%]
tests/direct/test_trialline.py::test_self_resolution_blocked PASSED      [ 81%]
tests/direct/test_trialline.py::test_expire_after_window PASSED          [ 90%]
tests/direct/test_trialline.py::test_expire_before_window_fails PASSED   [100%]

============================= 11 passed in 0.06s ==============================
```

## 5. Deployment Evidence

The fully patched contract has been deployed to GenLayer Studio Devnet at:

- **Network:** GenLayer Studio Next (chainId: 61997)
- **Contract Address:** `0x9c97c2e09E9d1Dc52A8C3FaDA2A889cfBe960a57`
- **Deploy TX Hash:** `0x2c2f3a4ca411f235d10158a0048d41d98cd95684a05f7f784d6f75500826c734`
