import fs from "fs";
import path from "path";
import { createAccount, createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

function loadKey() {
  if (process.env.GENLAYER_PRIVATE_KEY) return process.env.GENLAYER_PRIVATE_KEY;
  const src = fs.readFileSync(new URL("./deploy.mjs", import.meta.url), "utf8");
  const match = src.match(/0x[a-fA-F0-9]{64}/);
  if (!match) throw new Error("No deployer key in env or web/deploy.mjs");
  return match[0];
}

function summarize(tx) {
  const execution =
    tx?.executionResultName ||
    tx?.consensus_data?.leader_receipt?.[0]?.execution_result ||
    tx?.data?.execution_result ||
    null;
  const address =
    tx?.contractAddress ||
    tx?.data?.contract_address ||
    tx?.consensus_data?.leader_receipt?.[0]?.contract_address ||
    null;
  return {
    status: tx?.statusName || tx?.status || null,
    execution,
    address,
    hash: tx?.hash || tx?.txId || null,
  };
}

const account = createAccount(loadKey());
const client = createClient({
  chain: studioDevnet,
  endpoint: "https://studio-dev.genlayer.com/api",
  account,
});

const code = fs.readFileSync(path.resolve("..", "contracts", "trialline.py"), "utf8");
console.log("Deployer", account.address);
console.log("Code bytes", Buffer.byteLength(code));

const estimate = await client.estimateTransactionFees();
console.log("Fee value", estimate.feeValue.toString());
const hash = await client.deployContract({
  code,
  args: [],
  fees: {
    distribution: estimate.distribution,
    feeValue: estimate.feeValue,
  },
});
console.log("Deploy tx", hash);

const tx = await client.waitForTransactionReceipt({
  hash,
  waitUntil: "decided",
  interval: 3000,
  retries: 80,
});

const summary = summarize(tx);
console.log("Summary", JSON.stringify(summary));
if (!summary.address) {
  const raw = JSON.stringify(tx, (_, v) => (typeof v === "bigint" ? v.toString() : v));
  fs.writeFileSync(path.resolve("..", "deploy_receipt.json"), raw);
  throw new Error("No contract address on receipt. Saved deploy_receipt.json");
}

const rules = await client.readContract({
  address: summary.address,
  functionName: "get_rules",
  args: [],
});
console.log("get_rules", rules);

const out = {
  deployer: account.address,
  tx: hash,
  contract: summary.address,
  status: summary.status,
  execution: summary.execution,
  rules,
  explorerTx: `https://explorer-studio-dev.genlayer.com/tx/${hash}`,
  explorerAddress: `https://explorer-studio-dev.genlayer.com/address/${summary.address}`,
};
fs.writeFileSync(path.resolve("..", "deploy_proof.json"), JSON.stringify(out, null, 2));
console.log("Wrote deploy_proof.json");
