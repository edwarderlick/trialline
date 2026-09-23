# TrialLine Test Evidence

Ran against the GenLayer direct runner, which loads `contracts/trialline.py` and executes the contract methods. This is not a mock of the contract module. NIH HTTP responses are mocked. A live Studio consensus run was not executed in this pass.

Command:

```bash
pytest tests/direct/test_trialline.py -v
```

Result: **9 passed in 3.22s**.

```text
tests/direct/test_trialline.py::test_post_locks_attached_bond_and_does_not_mint PASSED
tests/direct/test_trialline.py::test_post_rejects_zero_bond PASSED
tests/direct/test_trialline.py::test_post_rejects_bad_nct_and_status PASSED
tests/direct/test_trialline.py::test_self_resolve_cancel_and_expire_cannot_release_bond_during_window PASSED
tests/direct/test_trialline.py::test_match_pays_poster_minus_fee_from_locked_bond PASSED
tests/direct/test_trialline.py::test_miss_pays_challenger_the_full_locked_bond PASSED
tests/direct/test_trialline.py::test_thin_refunds_poster_the_original_bond PASSED
tests/direct/test_trialline.py::test_window_boundary_blocks_match_and_expire_refunds_exact_bond PASSED
tests/direct/test_trialline.py::test_withdraw_pays_the_credited_bond PASSED
```

What those tests lock in:

- `post_stamp` with `message.value = 1000` locks 1000. The poster and challenger credits stay 0 while the stamp is `PENDING`.
- `message.value = 0` reverts with `Bond required`.
- Inside the 600 second window, poster `match()` reverts with `Poster cannot self-resolve`.
- Inside the window, poster `cancel()` reverts with `Cancel cannot bypass an open challenge`.
- Inside the window, `expire()` reverts with `Challenge window still open`.
- A third party cannot `cancel()`.
- None of those reverts move the bond.
- At 599 seconds the window is still open. At 600 seconds `match()` and `cancel()` revert, and `expire()` credits the poster exactly 1000.
- MATCH credits the poster 975 and the treasury 25. MISS credits the challenger 1000. THIN credits the poster 1000.
- `withdraw()` after expire sends the credited 1000 and leaves the balance at 0.

## On-chain proof (Studio Devnet, chain 61997)

| Check | Result |
|---|---|
| Deploy | [`0x8993743e…5814`](https://explorer-studio-dev.genlayer.com/tx/0x8993743ee1273717fb49518263f64f3e0c78adfd1087980e0ed4b2290e0b5814) `FINALIZED`, leader `SUCCESS` |
| Contract | [`0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661`](https://explorer-studio-dev.genlayer.com/address/0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661) |
| `get_rules()` | `{"challenge_window_seconds": 600, "protocol_fee_bps": 25}` |
| Post | [`0xccd58fe2…4711`](https://explorer-studio-dev.genlayer.com/tx/0xccd58fe2fb8f91149f03d986a05b93908adb82f0dbf7bfe5f77d255fef324711) locked bond `1000` on `NCT04470427` / `COMPLETED` |
| Window stored | `expires_at_unix - posted_at_unix = 600`. State stayed `PENDING` |
| Poster cancel | [`0xae06cbfc…0e17`](https://explorer-studio-dev.genlayer.com/tx/0xae06cbfcf70b3ba8bbf31fc31133002bdea5ae89b601f96800d89c41a0fa0e17) execution `ERROR`, payload `Cancel cannot bypass an open challenge` |
| After that cancel | Stamp still `PENDING`. Poster `get_credit` still `0` |
