const rpcUrl = "https://studio-dev.genlayer.com/api";

async function main() {
  const latestRes = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }) });
  const latestData = await latestRes.json();
  let latestBlock = parseInt(latestData.result, 16);
  
  for (let i = latestBlock; i > latestBlock - 100; i--) {
    const payload = {
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: ["0x" + i.toString(16), true],
      id: 1
    };
    const res = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.result) continue;
    const txs = data.result.transactions;
    for (const tx of txs) {
      if (tx.to && tx.to.toLowerCase() === "0x9c97c2e09e9d1dc52a8c3fada2a889cfbe960a57".toLowerCase()) {
        console.log("Found tx:", tx.hash);
        const rcptPayload = { jsonrpc: "2.0", method: "eth_getTransactionReceipt", params: [tx.hash], id: 2 };
        const rcptRes = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rcptPayload) });
        const rcptData = await rcptRes.json();
        console.log("Receipt error:", rcptData.result?.genvm_result);
      }
    }
  }
}
main();
