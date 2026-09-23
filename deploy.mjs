import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";
import fs from "fs";

async function main() {
  const privateKey = process.env.GENLAYER_PRIVATE_KEY || "0x53c07886a117dc55ce54dc31a1fa99009a5ec1396b797ceea74be59c3a647d7d"; // standard local key
  const client = createClient({
    chain: studioDevnet,
    account: privateKey,
  });

  const contractSource = fs.readFileSync("../contracts/trialline.py", "utf8");

  try {
    const hash = await client.deployContract({
      code: contractSource,
      args: [],
      value: BigInt(50000000000000000), // 0.05 GEN
    });
    console.log("Deployed with hash:", hash);
    const receipt = await client.waitForTransactionReceipt({ hash });
    console.log("Contract Address:", receipt.contractAddress);
  } catch (error) {
    console.error("Deploy failed:", error);
  }
}

main();
