# TrialLine 🔬

> **Decentralized clinical trial attestation powered by GenLayer's Intelligent Contract VM.**

TrialLine lets anyone stake GEN tokens on the real-world status of an NIH clinical trial. GenLayer's AI-driven validators autonomously fetch the live ClinicalTrials.gov API, reach decentralized consensus, and settle the bond — no oracles, no custodians, no trust required.

**Live dApp:** [trialline.vercel.app](https://trialline.vercel.app)

---

## Deployment

| Field | Value |
|---|---|
| **Contract Address** | [`0x497e27198698496F3e1Ad2a8FB145fDc6F9ADFa6`](https://explorer-studio-dev.genlayer.com/address/0x497e27198698496F3e1Ad2a8FB145fDc6F9ADFa6) |
| **Network** | GenLayer Studio Devnet (Chain ID 61997) |
| **RPC Endpoint** | `https://studio-dev.genlayer.com/api` |
| **Explorer** | [explorer-studio-dev.genlayer.com](https://explorer-studio-dev.genlayer.com/) |
| **Deploy Tx** | [`0xc928506...572`](https://explorer-studio-dev.genlayer.com/tx/0xc928506101fcb12923a317193fe7fedfb80615a02b400b6268499013d7757572) |

---

## How It Works

1. **Post a Stamp** — A user locks GEN tokens and claims a specific NCT trial has a specific status (e.g. `COMPLETED`).
2. **Challenge Window Opens** — For the next ~200 blocks, any third party can call `match()` to challenge the claim.
3. **GenVM Resolves** — The GenLayer validator network autonomously queries `clinicaltrials.gov/api/v2/studies/{NCT_ID}`, reaches strict consensus on the result, and settles the bond instantly.
4. **Funds Settle** — If the claim was correct → poster earns back their stake minus a 2.5% protocol fee. If wrong → challenger wins the full bond.

---

## Resolution Lifecycle

Every stamp has an **immutable block-based lifecycle** stored in `posted_at_block`:

```
Block 0–9    │ LOCK WINDOW    │ Cancel forbidden — bond fully at risk
Block 10–199 │ CHALLENGE WIN. │ Third party can match(); poster can cancel (full refund)
Block 200+   │ EXPIRED        │ Anyone calls expire() → 100% refund to poster
```

This makes the bond genuinely enforceable and prevents posters from escaping a challenge.

---

## Economics & Payout Matrix

| Resolution | Trigger | Payout |
|---|---|---|
| **MATCH** | NIH returns the claimed status | 97.5% → Poster · 2.5% → Treasury |
| **MISS** | NIH returns a different status | 100% → Challenger (Stamper) |
| **THIN** | 404 / 5xx / malformed JSON / missing key | 100% → Poster (full refund) |
| **CANCELED** | Poster cancels during challenge window | 100% → Poster (full refund) |
| **EXPIRED** | No challenger within 200 blocks | 100% → Poster (full refund) |

---

## Architectural Defenses

TrialLine is hardened against every known GenVM rejection class:

| Defence | What it prevents |
|---|---|
| **No Global Counters** | Stamp IDs are `sha256(caller ‖ value ‖ nonce ‖ nct ‖ status)` — collision-proof and replay-proof |
| **No Unauthenticated URLs** | The API endpoint is constructed deterministically inside the contract. Users cannot inject arbitrary evidence URLs |
| **No Custody Traps** | Funds settle immediately via `_Recipient.emit_transfer()`. On transfer failure, balance falls back to the `credits` ledger — never locked forever |
| **Fail-Closed** | Missing `overallStatus`, 404, 5xx, malformed JSON → instant `THIN` (full refund). No silent failures |
| **CEI-Compliant Withdrawals** | `withdraw()` zeroes the balance *before* calling `emit_transfer()` — reentrancy safe |
| **No Self-Resolution** | Poster is **blocked from calling `match()`** on their own stamp — cannot manipulate their own outcome |
| **Enforceable Bond Window** | 10-block lock prevents cancel-to-escape; 200-block expire prevents permanent lock |

---

## Contract Methods

| Method | Access | Description |
|---|---|---|
| `post_stamp(nct, status, nonce)` | `public.write.payable` | Lock GEN and post a claim |
| `match(stamp_id)` | `public.write` | Challenge a pending stamp (triggers GenVM consensus) |
| `cancel(stamp_id)` | `public.write` | Poster cancels during challenge window (blocks 10–199) |
| `expire(stamp_id)` | `public.write` | Anyone expires an unchallenged stamp after block 200 |
| `withdraw()` | `public.write` | Withdraw fallback credits to wallet |
| `get_stamp(stamp_id)` | `public.view` | Read full stamp record |
| `list_ids()` | `public.view` | List all stamp IDs |
| `get_credit(account)` | `public.view` | Check fallback credit balance |
| `get_economics()` | `public.view` | Protocol-level economic stats |

---

## Test Suite

**14 tests — 14 passing.** Run locally with:

```bash
pytest tests/direct/test_trialline.py -v
```

### Coverage

| Category | Tests |
|---|---|
| Happy paths | `MATCH`, `MISS`, `THIN`, unique hash generation |
| Input validation | Invalid NCT ID format rejection |
| Authorization | Unauthorized cancel, self-resolution blocked |
| Fund security | Withdrawal success, no-funds error, credits fallback |
| Resolution window | Cancel during lockup fails, cancel after lockup succeeds |
| Expiry | `expire()` succeeds after block 200, fails before |

### Live Test Fixtures

| NCT ID | Expected | Result |
|---|---|---|
| `NCT04470427` | `COMPLETED` | **MATCH** — guaranteed live fixture |
| `NCT00000000` | any | **THIN** — triggers 404, 100% refund |

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
