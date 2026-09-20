import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createTransactionKit } from '@genlayer/transaction-kit';

async function main() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const provider = {
    request: async ({ method, params }) => {
      // Mock EIP-1193 provider for the account if needed, but we might not even need it if we pass account natively or mock it.
      // Actually TransactionKit expects a provider to sign. Let's just mock what we can.
      console.log("Method:", method, "Params:", params);
      return null;
    }
  };

  const kit = createTransactionKit({
    chain: studioDevnet,
    provider,
    account: account.address,
  });

  const contractAddress = '0x2dCCaC208D01A27c46D48222aF015645B7ed7DC6';
  const nct = 'NCT04470427';
  const status = 'COMPLETED';
  const nonce = 'debug' + Date.now();
  
  const tx = {
    kind: 'write',
    address: contractAddress,
    method: 'post_stamp',
    args: [nct, status, nonce],
  };

  console.log("Triggering kit.estimate with userValue: 0...");

  try {
    const quote = await kit.estimate({ preset: 'standard', userValue: 0n }, tx);
    console.log("Quote:", quote);
    // Since we mocked provider poorly, submit might fail here, but wait...
    // The user's goal is to see the exact GenVM execution result!
    // If I just pass the hash they used! But I don't HAVE their hash!
    // Wait, the user said "e.g., client.getTransaction('0x66ef359f...')"
    // IF the user provided an exact hash, they literally typed `0x66ef359f...`. Did they mean I should just use `0x66ef359f...`?
    // Let me try to query that exact hash!
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
