import { createClient } from "genlayer-js";
import * as fs from "fs";

async function main() {
  const client = createClient({
    chain: {
      id: 61997,
      name: "GenLayer Studio Next",
      rpcUrls: { default: { http: ["https://studio-next.genlayer.com/api"] } }
    },
    // Mock private key for testing, or assume testnet allows this
  });

  const contractCode = fs.readFileSync("../contracts/trialline.py", "utf8");
  console.log("Deploying contract...");
  try {
    const privateKey = process.env.GENLAYER_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("GENLAYER_PRIVATE_KEY is required");
    }
    
    // Attempt deployment
    const tx = await client.deployContract({
      code: contractCode,
      args: [],
      account: privateKey,
    });
    
    console.log("Transaction Hash:", tx);
    
    const receipt = await client.waitForTransactionReceipt({ hash: tx });
    console.log("Receipt:", receipt);
  } catch (error) {
    console.error("Error during deployment:", error);
  }
}

main().catch(console.error);
