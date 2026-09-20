import fs from 'fs';
import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

async function main() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  const client = createClient({
    chain: studioDevnet,
    endpoint: 'https://studio-dev.genlayer.com/api',
    account
  });

  const code = fs.readFileSync('contracts/trialline.py', 'utf8');
  
  // Read fee-profile-proper.json
  const feeProfileStr = fs.readFileSync('fee-profile.json', 'utf8');
  const feeProfile = JSON.parse(feeProfileStr);

  // The genlayer-js writeContract requires `fees` which matches the deploy fees schema.
  // fee-profile-proper.json has {"deploy": {"distribution": {...}, "feeValue": "...", "policy": {...}}}
  // So we pass feeProfile.deploy
  const feesObj = feeProfile.deploy;

  // However, feeValue needs to be a BigInt for genlayer-js!
  feesObj.feeValue = BigInt(feesObj.feeValue);

  console.log("Deploying contract to GenLayer Studio Devnet with generated account", account.address, "...");

  try {
    const hash = await client.deployContract({
      code,
      args: [],
      fees: feesObj
    });
    console.log("Deployed! Hash:", hash);
  } catch (err) {
    console.error("Deploy failed:", err.message);
  }
}

main();
