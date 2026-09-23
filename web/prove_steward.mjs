import fs from "fs";
import { createAccount, createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

function loadKey() {
  const src = fs.readFileSync(new URL("./deploy.mjs", import.meta.url), "utf8");
  return src.match(/0x[a-fA-F0-9]{64}/)[0];
}

function pick(tx) {
  return {
    statusName: tx?.statusName ?? null,
    status: tx?.status ?? null,
    executionResultName: tx?.executionResultName ?? tx?.execution_result ?? null,
    result: tx?.result ?? null,
    leader: tx?.consensus_data?.leader_receipt?.[0]?.execution_result ?? null,
    error: tx?.consensus_data?.leader_receipt?.[0]?.error ?? tx?.data?.error ?? null,
  };
}

const proof = JSON.parse(fs.readFileSync(new URL("../deploy_proof.json", import.meta.url), "utf8"));
const address = proof.contract;
const account = createAccount(loadKey());
const client = createClient({
  chain: studioDevnet,
  endpoint: "https://studio-dev.genlayer.com/api",
  account,
});

const deployTx = await client.getTransaction({ hash: proof.tx });
console.log("DEPLOY", JSON.stringify(pick(deployTx)));

const estimate = await client.estimateTransactionFeesForWrite({
  address,
  functionName: "post_stamp",
  args: ["NCT04470427", "COMPLETED", "steward-proof-1"],
  value: 1000n,
});

const postHash = await client.writeContract({
  address,
  functionName: "post_stamp",
  args: ["NCT04470427", "COMPLETED", "steward-proof-1"],
  value: 1000n,
  fees: { distribution: estimate.distribution, feeValue: estimate.feeValue },
});
console.log("POST", postHash);
const postTx = await client.waitForTransactionReceipt({
  hash: postHash,
  waitUntil: "decided",
  interval: 3000,
  retries: 80,
});
console.log("POST RESULT", JSON.stringify(pick(postTx)));

const ids = await client.readContract({ address, functionName: "list_ids", args: [] });
const stampId = Array.isArray(ids) ? ids[ids.length - 1] : null;
console.log("STAMP", stampId);
const stamp = await client.readContract({ address, functionName: "get_stamp", args: [stampId] });
console.log("STAMP BODY", stamp);

const cancelEstimate = await client.estimateTransactionFeesForWrite({
  address,
  functionName: "cancel",
  args: [stampId],
});
let cancelSummary;
try {
  const cancelHash = await client.writeContract({
    address,
    functionName: "cancel",
    args: [stampId],
    fees: { distribution: cancelEstimate.distribution, feeValue: cancelEstimate.feeValue },
  });
  console.log("CANCEL", cancelHash);
  const cancelTx = await client.waitForTransactionReceipt({
    hash: cancelHash,
    waitUntil: "decided",
    interval: 3000,
    retries: 80,
  });
  cancelSummary = { hash: cancelHash, ...pick(cancelTx) };
} catch (err) {
  cancelSummary = { threw: String(err?.message || err).slice(0, 500) };
}
console.log("CANCEL RESULT", JSON.stringify(cancelSummary));

const after = await client.readContract({ address, functionName: "get_stamp", args: [stampId] });
const credit = await client.readContract({
  address,
  functionName: "get_credit",
  args: [account.address],
});
const out = {
  deploy: pick(deployTx),
  post: { hash: postHash, ...pick(postTx) },
  stampId,
  stamp: JSON.parse(stamp),
  cancel: cancelSummary,
  stampAfterCancel: JSON.parse(after),
  posterCredit: credit,
};
fs.writeFileSync(new URL("../steward_proof.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("Wrote steward_proof.json");
