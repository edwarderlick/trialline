import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";
import fs from "fs";

// Read contract address from .env.local
const envContent = fs.readFileSync("web/.env.local", "utf8");
const match = envContent.match(/NEXT_PUBLIC_CONTRACT_ADDRESS=(.*)/);
if (!match) {
    console.error("Could not find NEXT_PUBLIC_CONTRACT_ADDRESS in web/.env.local");
    process.exit(1);
}
const contractAddress = match[1].replace(/["']/g, "").trim();

console.log(`\n=========================================`);
console.log(`🔍 TRIALINE ON-CHAIN VERIFICATION`);
console.log(`=========================================\n`);
console.log(`📡 Connecting to Studio Devnet (Chain 61997)...`);
console.log(`📄 Target Contract: ${contractAddress}\n`);

const client = createClient({
    chain: studioDevnet,
    endpoint: "https://studio-dev.genlayer.com/api"
});

async function run() {
    try {
        console.log(`⏳ Fetching Active IDs via list_ids()...`);
        const ids = await client.readContract({
            address: contractAddress,
            functionName: "list_ids",
            args: []
        });

        console.log(`\n📋 FOUND IDs:`, ids);

        if (ids && ids.length > 0) {
            const latestId = ids[ids.length - 1]; // Assume the last one is the newly created one
            console.log(`\n⏳ Fetching details for ID: ${latestId}...`);
            const stampRaw = await client.readContract({
                address: contractAddress,
                functionName: "get_stamp",
                args: [latestId]
            });

            const stamp = JSON.parse(stampRaw);
            console.log(`\n✨ STAMP RECORD [${latestId}]:`);
            console.log(`   Poster:          ${stamp.poster}`);
            console.log(`   NCT ID:          ${stamp.nct}`);
            console.log(`   Expected Status: ${stamp.expected_status}`);
            console.log(`   Bond Value:      ${Number(stamp.value) / 1e18} GEN`);
            console.log(`   Current State:   ${stamp.status}`);
            
            if (stamp.status === "OPEN" || stamp.status === "PENDING") {
                console.log(`   ✅ VALIDATION: Stamp state is correctly initialized!`);
            } else {
                console.log(`   ❌ VALIDATION: Stamp is in unexpected state.`);
            }
        } else {
            console.log(`\n❌ No stamps found. The post_stamp transaction may not have gone through.`);
        }

        console.log(`\n⏳ Fetching Economics via get_economics()...`);
        const econRaw = await client.readContract({
            address: contractAddress,
            functionName: "get_economics",
            args: []
        });
        const econ = JSON.parse(econRaw);
        
        console.log(`\n📊 ECONOMICS:`);
        console.log(`   Total Stamps: ${econ.total_stamps}\n`);

    } catch (err) {
        console.error(`❌ ERROR:`, err.message);
    }
}

run();
