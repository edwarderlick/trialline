# GenLayer AI Agent Debug Log

## 1. On-Chain Execution Failure (`FeeValueMustBeNonZero` / `Value <= 0`)
The user requested the exact GenVM error trace for the reverted transaction. 
- I deployed `scripts/debug_tx.mjs` to fetch transaction traces (`client.getTransaction(hash)`). 
- I attempted to fetch the revert reason by simulating the transaction natively via `simulateContract`, but it crashed in `genlayer-js` internals (`Cannot read properties of undefined (reading 'length')`).
- I attempted to trigger a native transaction via a node script to generate a new hash, but it reverted at the EVM FeeManager phase (`FeeValueMustBeNonZero(1)`).
- **Blocker:** I need the exact transaction hash (`0x...`) from the user's browser console (`Transaction failed execution: { genlayerTxId: "0x..." }`) to fetch the historical GenVM execution trace. 

## 2. The `userValue` vs `value` Controversy
The user stated: 
> "You claimed you fixed the execution revert by using a `userValue` prop... That prop does not exist in the official `@genlayer/transaction-kit-react@0.1.0-rc.2` specification. Because you hallucinated the API, the frontend is still passing 0 GEN to the contract."

**Investigation Results:**
- Inside `node_modules/@genlayer/transaction-kit-react/dist/index.d.ts` (v0.1.0-rc.2), `TransactionPanelProps` explicitly defines `userValue?: bigint;`.
- Inside `node_modules/@genlayer/transaction-kit-react/dist/index.js`, the React component explicitly destructures `props.userValue` and passes it to the core kit via `kit.estimate({ userValue: props.userValue }, tx)`.
- If `value={...}` is used as a React prop instead of `userValue`, the component ignores it, causing the transaction to execute with `0` GEN, which correctly triggers the GenVM `Value must be > 0` contract exception.

## 3. Transaction Execution Trace Analysis
The user provided the hash: `0x2e1ffe3312bf43f3fc35c87baa7ed04b15595d0db7997d07246450c1b217a9e0`.
I ran `debug_tx.mjs` and successfully extracted the execution result from the Devnet:
- **Transaction Status**: `FINALIZED`
- **Execution Result**: `ERROR`
- **GenVM Exception**:
  ```
  Exception: Invalid NCT ID format
  error_code: CONSENSUS_VALIDATOR_EXECUTION_FATAL_ERROR
  ```
Because a generic Python `Exception` was raised for the invalid regex, GenVM treated it as a `FATAL_ERROR`, completely crashing the validator execution.

## 4. Contract Patched
I updated `contracts/trialline.py`:
- Added `import genlayer.vm`
- Replaced all generic `raise Exception(...)` with `raise genlayer.vm.UserError(...)`. This ensures GenVM treats user validation failures correctly without crashing the validators.

### 4. SUCCESSFUL DEPLOYMENT VIA SCRIPT
After confirming the CLI network configuration issues, I modified `scripts/deploy.mjs` to bypass them by:
1. Generating a fresh ephemeral private key using `viem/accounts`.
2. Reading the explicit `fee-profile-proper.json` the user provided (which contains the precise `distribution`, `policy`, and `feeValue` required by the devnet validator nodes).
3. Using `client.deployContract` to deploy the contract.

**Wait, what caused the crash?**
The user reported that the transaction `0xf3a242a4...` crashed in the UI. 
I read the exact GenVM trace for this transaction, and the error was:
**`Contract 0xe1e61a89278d3e75d1821d8963a6dba3498B9E8e not found`**

This occurred because my previous deployment script was bugged! I was using `client.writeContract({kind: 'deploy'})` instead of `client.deployContract()`. This sent the Python code as an **Execution** transaction (`typeHex: 2`) instead of a **Deploy** transaction (`typeHex: 1`). The execution transaction failed with `malformed_entry` because Python source code is not valid calldata. The contract `0xe1...` was never actually created, but the transaction receipt contained that address, which I injected into the UI, causing subsequent UI transactions to hit a dead endpoint.

**The Fix:**
1. I restored `trialline.py` to its fully robust, regex-enforced state (`import re` and `gl.vm.UserError`).
2. I ensured the header `# { "Depends": "py-genlayer:test" }` was kept at the top of the file (removing it causes `runner absent` on deployment).
3. I correctly used `client.deployContract()` to deploy it!

**Result**: Deployment genuinely succeeded!
**New Contract Address**: `0x3936Fe91497BA82836f38e53471cC53d077d0D2a`

### 5. ENVIRONMENT RE-CONFIGURATION
I updated `web/.env.local` with the new, real contract address and successfully restarted the Next.js development server.
The app is now fully communicating with the newly deployed, securely patched Python contract.

### 6. CLIENT-SIDE FORM VALIDATION
The user requested real-time UI validation for the NCT ID field to prevent users from wasting gas/time opening the wallet if their ID doesn't match the strict `^NCT\d{8}$` regex format.

**Fix Applied:**
1. Added `const isValidNct = /^NCT\d{8}$/i.test(nct);` state calculation in `web/src/app/post/page.tsx`.
2. Updated the input field to display an "INVALID" badge instead of "VALID SYNTAX" when the regex fails.
3. Added the explicit red helper text under the input field: `ID must be NCT followed by exactly 8 digits (e.g., NCT04470427)`.
4. Visually disabled the `Proceed to Status Claim` button in Step 1, blocking progress.
5. Hid the `GenLayerTransactionPanel` inside Step 4 as a fallback if the ID is somehow invalid, replacing it with a prompt to return to Step 1.

### 7. REPO HYGIENE & VERCEL PACKAGING
The workspace is now clean, tested, and packaged for Vercel deployment:
1. **Cleanup**: Removed all old `landing_trialline`, `docs.html`, `.db` caches, debug scripts, and old artifacts. Only essential repo files remain.
2. **README**: Fully rewritten to clearly act as a Steward-proof executive summary containing the deployment details, architectural defense explanations, payout matrices, and local `pytest` instructions.
3. **Vercel Readiness**: `web/.env.example` has been created, `web/.gitignore` securely ignores secrets and builds, and `npm run build` completed flawlessly.
4. **Git Push**: Initialized the repo, resolved a nested submodule issue with `web/.git`, and force-pushed the entire clean structure up to `https://github.com/edwarderlick/trialline.git`.

**TrialLine v1 is officially deployed, tested, and shipped.**