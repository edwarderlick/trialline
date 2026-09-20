import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';

async function main() {
  const hash = process.argv[2];
  if (!hash) {
    console.error("Usage: node debug_tx.mjs <transaction_hash>");
    process.exit(1);
  }

  const client = createClient({
    chain: studioDevnet,
    endpoint: 'https://studio-dev.genlayer.com/api',
  });

  console.log(`Fetching transaction receipt for hash: ${hash}...`);
  try {
    const tx = await client.getTransaction({ hash });
    console.log("Transaction Data:", JSON.stringify(tx, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2));
    
    if (tx.status === 2 || tx.executionResultName === "FINISHED_WITH_ERROR" || tx.statusName === "FINISHED_WITH_ERROR") {
      console.error("\n❌ Exact Revert Reason (Execution Failed):");
      console.error(tx.error || tx.data || "Unknown Execution Error");
    } else {
      console.log("\n✅ Execution Result:", tx.executionResultName || tx.statusName);
    }
  } catch (err) {
    console.error("Error fetching tx:", err.message || err);
  }
}

main();
