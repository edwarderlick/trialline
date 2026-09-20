import { spawn } from 'child_process';
import fs from 'fs';

// Read and remove all spaces so it's a single argument without spaces
const feesObj = JSON.parse(fs.readFileSync('fee-profile-proper.json', 'utf8'));
const feesStr = JSON.stringify(feesObj); 

const args = [
  'genlayer',
  'deploy',
  '--contract',
  'contracts/trialline.py',
  '--rpc',
  'https://studio-dev.genlayer.com/api',
  '--fees',
  feesStr
];

console.log("Spawning npx with args:", args);

const child = spawn('npx.cmd', args, { stdio: 'inherit', shell: true });

child.on('exit', (code) => {
  console.log('npx exited with code:', code);
});
