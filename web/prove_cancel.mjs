import fs from "fs";
import { createAccount, createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

function loadKey() {
  const privateKey = process.env.GENLAYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("GENLAYER_PRIVATE_KEY is required");
  }
  return privateKey;
}

const proof = JSON.parse(fs.readFileSync(new URL("../deploy_proof.json", import.meta.url), "utf8"));
const address = proof.contract;
const stampId = "d7e7b9fedc997a54845c47450116b1bd25fe77b3ce1fc727cb5e4c77358bdf33";
const account = createAccount(loadKey());
const client = createClient({
  chain: studioDevnet,
  endpoint: "https://studio-dev.genlayer.com/api",
  account,
});

const fees = await client.estimateTransactionFees();
const hash = await client.writeContract({
  address,
  functionName: "cancel",
  args: [stampId],
  fees: { distribution: fees.distribution, feeValue: fees.feeValue },
});
console.log("CANCEL TX", hash);
const tx = await client.waitForTransactionReceipt({
  hash,
  waitUntil: "decided",
  interval: 3000,
  retries: 80,
});
const leader = tx?.consensus_data?.leader_receipt?.[0] || {};
let decoded = null;
if (typeof leader.result === "string") {
  try {
    decoded = Buffer.from(leader.result, "base64").toString("utf8");
  } catch {
    decoded = null;
  }
}
const stamp = await client.readContract({ address, functionName: "get_stamp", args: [stampId] });
const credit = await client.readContract({
  address,
  functionName: "get_credit",
  args: [account.address],
});
const out = {
  cancelTx: hash,
  explorer: `https://explorer-studio-dev.genlayer.com/tx/${hash}`,
  status: tx?.statusName || tx?.status || null,
  execution: leader.execution_result || null,
  decodedResult: decoded,
  stampAfter: JSON.parse(stamp),
  posterCredit: credit,
};
fs.writeFileSync(new URL("../steward_proof.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
