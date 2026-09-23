import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  const privateKey = process.env.GENLAYER_PRIVATE_KEY || "0x53c07886a117dc55ce54dc31a1fa99009a5ec1396b797ceea74be59c3a647d7d"; // standard local key
  const account = privateKeyToAccount(privateKey);
  const client = createClient({
    chain: studioDevnet,
    account: account,
  });

  const contractAddress = "0x9c97c2e09E9d1Dc52A8C3FaDA2A889cfBe960a57";

  try {
    const txHash = await client.writeContract({
      address: contractAddress,
      functionName: "post_stamp",
      args: ["NCT04000000", "RECRUITING", "test-nonce-123"],
      value: BigInt(10000000000000000), // 0.01 GEN bond
      fees: { feeValue: BigInt(10000000000000000) } // 0.01 GEN fee
    });
    console.log("Tx sent:", txHash);
    
    const receipt = await client.waitForTransactionReceipt({ hash: txHash, status: "finalized" });
    console.log("Receipt:", JSON.stringify(receipt, null, 2));
  } catch (err) {
    console.error("Execution failed locally:", err);
  }
}

main();
