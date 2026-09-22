import fs from 'fs';
import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

const client = createClient({
  chain: studioDevnet,
  endpoint: 'https://studio-dev.genlayer.com/api',
  account
});

const code = fs.readFileSync('contracts/trialline.py', 'utf8');
const feeProfile = JSON.parse(fs.readFileSync('fee-profile.json', 'utf8'));
const feesObj = feeProfile.deploy;
feesObj.feeValue = BigInt(feesObj.feeValue);

console.log(`\n🚀 Deploying TrialLine to GenLayer Studio Devnet...`);
console.log(`👤 Deployer: ${account.address}\n`);

async function main() {
  let txHash;
  try {
    txHash = await client.deployContract({ code, args: [], fees: feesObj });
    console.log(`✅ Deploy tx: ${txHash}`);
  } catch (err) {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
  }

  console.log('\n⏳ Waiting for contract address (polling up to 90s)...');
  let contractAddress = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const receipt = await client.getTransactionReceipt({ hash: txHash });
      if (receipt?.contractAddress) { contractAddress = receipt.contractAddress; break; }
      if (receipt?.data?.contract_address) { contractAddress = receipt.data.contract_address; break; }
    } catch (_) {}
    process.stdout.write(`  Attempt ${i + 1}/30...\r`);
  }

  if (!contractAddress) {
    console.log(`\n⚠️  Could not auto-extract address. Check explorer:`);
    console.log(`   https://explorer-studio-dev.genlayer.com/tx/${txHash}`);
    process.exit(0);
  }

  console.log(`\n🎉 Contract deployed at: ${contractAddress}\n`);

  // Update web/.env.local
  const envPath = 'web/.env.local';
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Updated web/.env.local`);

  // Update web/.env.example
  try {
    let ex = fs.readFileSync('web/.env.example', 'utf8');
    ex = ex.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    fs.writeFileSync('web/.env.example', ex);
    console.log(`✅ Updated web/.env.example`);
  } catch (_) {}

  // Update README.md
  try {
    let readme = fs.readFileSync('README.md', 'utf8');
    readme = readme.replace(
      /\*\*Contract Address:\*\* \[`[^`]+`\]\([^)]+\)/,
      `**Contract Address:** [\`${contractAddress}\`](https://explorer-studio-dev.genlayer.com/address/${contractAddress})`
    );
    fs.writeFileSync('README.md', readme);
    console.log(`✅ Updated README.md`);
  } catch (_) {}

  // Write address to file so CI can pick it up
  fs.writeFileSync('deployed_address.txt', contractAddress);
  console.log(`✅ Wrote deployed_address.txt`);
  console.log(`\n📋 Address: ${contractAddress}`);
}

main();
