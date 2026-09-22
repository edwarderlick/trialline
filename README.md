# TrialLine
TrialLine: A same-session, zero-window official NIH clinical trial status stamp on GenLayer Studio Devnet.

## Deployment Details
- **Contract Address:** [`0x1576b4AC2b257b4632B18c63424498526f12EA18`](https://explorer-studio-dev.genlayer.com/address/0x1576b4AC2b257b4632B18c63424498526f12EA18)
- **Network:** Studio Devnet (Chain ID 61997)
- **RPC:** [https://studio-dev.genlayer.com/api](https://studio-dev.genlayer.com/api)
- **Explorer:** [https://explorer-studio-dev.genlayer.com/](https://explorer-studio-dev.genlayer.com/)

## Architectural Defenses (The "Graveyard" Checklist)
TrialLine is built strictly adhering to GenVM v0.6 RC guidelines. It avoids past protocol rejections through the following architectural defenses:

- *No Global Counters (Provider Court fix):* IDs are strict `hashlib.sha256` transaction-correlated hashes.
- *No Unauthenticated URLs (Sybil Court fix):* The contract natively constructs the `clinicaltrials.gov` URL. Users cannot pass arbitrary evidence endpoints.
- *No Custody Traps (Alpha Court / Remediate fix):* Funds are settled immediately via `_pay`. If a native EOA transfer fails, funds fall back safely to a `credits` ledger. The contract never holds funds it cannot return.
- *Fail-Closed Architecture (LicenseLock fix):* Missing `overallStatus` keys, 404s, malformed JSON, or payloads exceeding 32KiB instantly trigger a `THIN` resolution (100% refund).
- *Safe Withdrawals (Rainline fix):* `withdraw()` implements a native GenVM `emit_transfer()` to release funds and strictly adheres to the Checks-Effects-Interactions (CEI) pattern by zeroing credit balances *prior* to executing the transfer, avoiding reentrancy.

## Economics & Payout Matrix

| Resolution | Condition | Payout Split |
|---|---|---|
| **MATCH** | NIH endpoint returns claimed status | 2.5% to Protocol Treasury, 97.5% to Poster |
| **MISS** | NIH endpoint returns a mismatch | 100% to Executing Stamper (Poster forfeits bond) |
| **THIN** | 404, 5xx, or malformed JSON payload | 100% Refund to Poster |
| **CANCELED** | Canceled before attestation | 100% Refund to Poster |

## Test Cases & Fixtures
Reviewers can use the following live fixtures to test the dApp locally or on-chain:

- **NCT04470427**: Assert `COMPLETED` for a guaranteed `MATCH`.
- **NCT00000000**: Submit to trigger a 404 on the API, resolving as `THIN` (100% refund).

### Local Test Suite
To run the deterministic pytest suite testing all edge cases locally:
```bash
pytest tests/direct/test_trialline.py -v
```

## v0.6 Compliance
- The `web/` Next.js frontend explicitly requires `ACCEPTED` status + `FINISHED_WITH_RETURN` execution result for confirmation logic.
- Utilizes the unmodified SDK-estimated `FeesDistribution` out of the box via `genlayer-js` `v2.0.0-rc.1`.
