import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

async function main() {
  try {
    const feesJson = JSON.stringify({
      distribution: {
        leaderTimeunitsAllocation: "1000",
        validatorTimeunitsAllocation: "1000",
        rotations: ["0"]
      }
    });
    
    const feesJsonStr = JSON.stringify(feesJson).replace(/"/g, '\\"');
    console.log("Running deploy...");
    const cmd = `genlayer deploy --contract contracts/trialline.py --fees "${feesJsonStr}" --fee-value 10000000000000000`;
    console.log("Command:", cmd);
    const { stdout, stderr } = await execAsync(cmd);
    console.log("Output:");
    console.log(stdout);
    console.log("Errors:");
    console.log(stderr);
  } catch (err) {
    console.error("Exec failed:", err);
  }
}
main();
