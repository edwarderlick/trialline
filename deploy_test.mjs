import { createClient } from "genlayer-js";
import fs from "fs";

async function main() {
  const privateKey = process.env.GENLAYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("GENLAYER_PRIVATE_KEY is required");
  }
  const client = createClient({ chain: { id: 61997, rpcUrl: "https://studio-dev.genlayer.com/api" } });
  const account = {
    address: "0x1234567890123456789012345678901234567890",
    privateKey,
  };
  console.log("Client ready", Boolean(client), Boolean(account));
}
main();
