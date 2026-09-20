import { Wallet } from 'ethers';
import fs from 'fs';

async function main() {
  const json = fs.readFileSync('C:/Users/samir/.genlayer/keystores/coverlock-challenger.json', 'utf8');
  try {
    const wallet = await Wallet.fromEncryptedJson(json, "");
    console.log("Private Key (empty password):", wallet.privateKey);
  } catch (e) {
    console.error("Failed with empty password:", e.message);
    try {
      const wallet2 = await Wallet.fromEncryptedJson(json, "password");
      console.log("Private Key (password 'password'):", wallet2.privateKey);
    } catch (e2) {
      console.error("Failed with 'password':", e2.message);
    }
  }
}
main();
