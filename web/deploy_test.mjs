import fs from 'fs';
import path from 'path';
import { createClient, createAccount, chains, createFeesDistribution } from 'genlayer-js';

async function main() {
  const pk = "0xd5266757246cb8da9c8efeaea345ca46dc5996bf33e58b8921a513b53bba9bbe";
  const account = createAccount(pk);
  
  const client = createClient({
    chain: chains.studioDevnet,
    endpoint: "https://studio-dev.genlayer.com/api",
    account: account
  });

  const contractPath = path.resolve(process.cwd(), "../contracts/trialline.py");
  const contractCode = new Uint8Array(fs.readFileSync(contractPath));

  const distribution = createFeesDistribution({
    leaderTimeunitsAllocation: 100n,
    validatorTimeunitsAllocation: 200n,
    appealRounds: 1n,
    executionBudgetPerRound: 25000000000000000n,
    executionConsumed: 0n,
    totalMessageFees: 0n,
    rotations: [3n, 3n],
    maxPriceGenPerTimeUnit: 2n,
    storageFeeMaxGasPrice: 300000000n,
    receiptFeeMaxGasPrice: 300000000n
  });

  try {
    const deployTransaction = await client.deployContract({
      code: contractCode,
      args: [],
      fees: {
        distribution: distribution,
        feeValue: 225000000000063129n
      }
    });

    console.log("Deploy transaction submitted. Hash:", deployTransaction);

    const receipt = await client.waitForTransactionReceipt({
      hash: deployTransaction,
      status: "ACCEPTED",
      retries: 200,
    });

    const leaderReceipt = receipt.consensus_data?.leader_receipt?.[0];
    console.log("\nLeader Receipt:", JSON.stringify(leaderReceipt, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));

    if (leaderReceipt?.execution_result !== "SUCCESS") {
      throw new Error(`Deployment failed. Execution Result: ${leaderReceipt?.execution_result}`);
    }

    console.log("\nContract deployed successfully!", {
      "Transaction Hash": deployTransaction,
      "Contract Address": receipt.data?.contract_address,
    });
  } catch (err) {
    console.error("Error during deployment:", err);
  }
}

main().catch(console.error);
