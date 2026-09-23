# TrialLine 🔬

> **Decentralized clinical trial attestation powered by GenLayer's Intelligent Contract VM.**

TrialLine lets anyone stake GEN tokens on the real-world status of an NIH clinical trial. GenLayer's AI-driven validators autonomously fetch the live ClinicalTrials.gov API, reach decentralized consensus, and settle the bond — no oracles, no custodians, no trust required.

**Live dApp:** [trialline.vercel.app](https://trialline.vercel.app)

---

## Deployment

| Field | Value |
|---|---|
| **Contract Address** | [`0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661`](https://explorer-studio-dev.genlayer.com/address/0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661) |
| **Deploy Tx** | [`0x8993743ee1273717fb49518263f64f3e0c78adfd1087980e0ed4b2290e0b5814`](https://explorer-studio-dev.genlayer.com/tx/0x8993743ee1273717fb49518263f64f3e0c78adfd1087980e0ed4b2290e0b5814) |
| **Deploy result** | `FINALIZED`, leader execution `SUCCESS`. `get_rules()` returns `challenge_window_seconds: 600` and `protocol_fee_bps: 25` |
| **Network** | GenLayer Studio Devnet (Chain ID 61997) |
| **RPC Endpoint** | `https://studio-dev.genlayer.com/api` |
| **Explorer** | [explorer-studio-dev.genlayer.com](https://explorer-studio-dev.genlayer.com/) |

---

## Steward fixes

This deployment is the resubmission for the steward request: an enforceable bond, a resolution window whose cancellation rules cannot bypass a challenge, and tests of the payout and timing boundaries.

| Steward ask | What the deployed contract does | Proof |
|---|---|---|
| Stop posters reclaiming false claims by resolving them themselves | `match()` by the poster reverts with `Poster cannot self-resolve`. The bond is `message.value`, not a minted balance | Direct test `test_self_resolve_cancel_and_expire_cannot_release_bond_during_window` |
| A clear target and a window that cancellation cannot skip | Target is the claimed NIH status. Window is 600 seconds from `posted_at_unix`. `cancel()` always reverts. `expire()` reverts until the window closes | On-chain stamp `d7e7b9fe…df33` is `PENDING` with bond `1000` and `expires_at_unix - posted_at_unix = 600`. Cancel tx [`0xae06cbfc…0e17`](https://explorer-studio-dev.genlayer.com/tx/0xae06cbfcf70b3ba8bbf31fc31133002bdea5ae89b601f96800d89c41a0fa0e17) finished `ERROR` with payload `Cancel cannot bypass an open challenge`. The stamp stayed `PENDING` and the poster credit stayed `0` |
| Test payout and timing on the integrated path | GenLayer direct runner executes the real contract: MATCH 975/25, MISS 1000 to the challenger, THIN 1000 back, and the 600-second boundary | `pytest tests/direct/test_trialline.py -v` — 9 passed |

On-chain post used for that cancel proof: [`0xccd58fe2…711`](https://explorer-studio-dev.genlayer.com/tx/0xccd58fe2fb8f91149f03d986a05b93908adb82f0dbf7bfe5f77d255fef324711).

---

## How It Works

1. **Post a Stamp** — A user locks GEN tokens and claims a specific NCT trial has a specific status (e.g. `COMPLETED`).
2. **Challenge Window Opens** — Any third party can call `match()` to challenge the claim.
3. **GenVM Resolves** — The GenLayer validator network autonomously queries `clinicaltrials.gov/api/v2/studies/{NCT_ID}`, reaches strict consensus on the result, and settles the bond instantly.
4. **Funds Settle** — If the claim was correct → poster earns back their stake minus a 2.5% protocol fee. If wrong → challenger wins the full bond.

---

## Resolution Lifecycle

GenVM does not expose a block number to the contract. The window is the transaction timestamp in `message.datetime`, stored as `posted_at_unix`. It lasts **600 seconds**.

```
0–599s    │ CHALLENGE WINDOW │ Anyone but the poster may match().
          │                  │ cancel() and expire() revert.
          │                  │ A poster cannot take the bond back.
600s+     │ EXPIRED          │ match() reverts.
          │                  │ expire() returns the original bond to the poster.
```

`cancel()` never releases a bond. While the window is open it reverts with `Cancel cannot bypass an open challenge`. After the window it reverts and tells the caller to use `expire()`.

---

## Economics & Payout Matrix

| Resolution | Trigger | Payout |
|---|---|---|
| **MATCH** | NIH returns the claimed status | 97.5% → Poster · 2.5% → Treasury |
| **MISS** | NIH returns a different status | 100% → Challenger (Stamper) |
| **THIN** | 404 / 5xx / malformed JSON / missing key | 100% → Poster (full refund) |
| **CANCELED** | Not a settlement. `cancel()` always reverts | Bond stays locked |
| **EXPIRED** | `expire()` after the 600s window, only if still `PENDING` | 100% → Poster |

---

## Architectural Defenses

TrialLine is hardened against every known GenVM rejection class:

| Defence | What it prevents |
|---|---|
| **No Global Counters** | Stamp IDs are `sha256(caller ‖ value ‖ nonce ‖ nct ‖ status ‖ posted_at)` |
| **No Unauthenticated URLs** | The API endpoint is constructed deterministically inside the contract. Users cannot inject arbitrary evidence URLs |
| **Posted value is the bond** | `post_stamp` is payable. The bond is `message.value` and is rejected when it is zero. Resolution moves that same amount; it does not mint a balance |
| **Fail-Closed** | Missing `overallStatus`, 404, 5xx, malformed JSON → instant `THIN` (full refund). No silent failures |
| **CEI-Compliant Withdrawals** | `withdraw()` zeroes the credit before `chain.Account.emit_transfer()`. If that transfer raises, the credit is restored |
| **No Self-Resolution** | Poster is **blocked from calling `match()`** on their own stamp — cannot manipulate their own outcome |
| **Enforceable Bond Window** | For all 600 seconds, `cancel()` and `expire()` revert. The poster cannot exit ahead of `match()` |

---

## Contract Methods

| Method | Access | Description |
|---|---|---|
| `post_stamp(nct, status, nonce)` | `public.write.payable` | Lock `message.value` and post a claim. The dApp sends 5 GEN |
| `match(stamp_id)` | `public.write` | Challenge inside the window. Poster calls revert |
| `cancel(stamp_id)` | `public.write` | Always reverts. Cannot release a bond |
| `expire(stamp_id)` | `public.write` | After 600s, refund the original bond to the poster |
| `withdraw()` | `public.write` | Send credited bond claims to the caller |
| `get_stamp(stamp_id)` | `public.view` | Read full stamp record |
| `list_ids()` | `public.view` | List all stamp IDs |
| `get_credit(account)` | `public.view` | Check fallback credit balance |
| `get_economics()` | `public.view` | Protocol-level economic stats |

---

## Test Suite

**9 tests — 9 passing** on the GenLayer direct runner (real contract, not a mock of the module). NIH responses are mocked. Run locally with:

```bash
pytest tests/direct/test_trialline.py -v
```

### Coverage

| Category | What is proved |
|---|---|
| Bond | Posting with value locks that amount. Zero value reverts. Nothing is credited until settlement |
| Payout | MATCH pays the poster 97.5% and the treasury 2.5%. MISS pays the challenger 100%. THIN refunds the poster 100% |
| Self-resolution | Poster `match()` reverts and does not move the bond |
| Cancellation | `cancel()` reverts inside the window and after it. Credits stay at 0 |
| Timing | At 599s, `expire()` reverts. At 600s, `match()` reverts and `expire()` returns the original bond |
| Withdraw | `withdraw()` clears a credited bond. An empty balance reverts |

The live contract is `0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661`. On-chain checks from this resubmission are in `deploy_proof.json` and `steward_proof.json`.

---

## Local Development

```bash
# 1. Install dependencies
cd web && npm install

# 2. Copy env and set contract address
cp .env.example .env.local
# Edit NEXT_PUBLIC_CONTRACT_ADDRESS if needed

# 3. Run the dev server
npm run dev
```

---

## Tech Stack

- **Smart Contract:** Python on GenLayer GenVM (`py-genlayer:test`)
- **Consensus:** `eq_principle.strict_eq` — deterministic validator agreement on NIH data
- **Data Source:** `clinicaltrials.gov/api/v2` — official NIH REST API (no custom hosts)
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Wallet:** `genlayer-js` v2.0.0-rc.1 SDK
- **Hosting:** Vercel (production)

---

## v0.6 Compliance

- Frontend requires `ACCEPTED` status **and** `FINISHED_WITH_RETURN` execution result before treating a transaction as confirmed.
- Unmodified SDK-estimated `FeesDistribution` used out of the box.
- Zero custom host overrides — deterministic URL construction only.
