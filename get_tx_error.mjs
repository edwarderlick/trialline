import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

async function main() {
  const client = createClient({
    chain: studioDevnet,
  });

  const txHash = "0x07dbd424b910e54d60c23933c0de9859f5b66d48b715fb823bd8dd2a3b01cdf73"; // From screenshot: 0x07dbd424...1cdf73 -> wait, I cannot read the full hash from the image directly!
  
  // Let me just query the latest transactions for the contract address
  // Actually, I can query events/transactions for the contract! Or read it from the user?
}
