const fs = require('fs');

let content = fs.readFileSync('src/app/post/page.backup.tsx', 'utf-8');

// 1. Add 'use client' and imports
content = content.replace(
  'export default function Page() {',
  `"use client";
import { useState, useId } from "react";
import { useGenLayer } from "../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";
import feeProfile from "../../../../fee-profile.json";

export default function Page() {
  const [step, setStep] = useState(1);
  const [nct, setNct] = useState("NCT04470427");
  const [status, setStatus] = useState("COMPLETED");
  const { kit, address } = useGenLayer();
  const nonce = useId();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
`
);

// 2. Fix the header to use dynamic address
content = content.replace(
  '<span className="font-label-md text-label-md text-primary font-semibold">0x71C...4f9b</span>',
  `<span className="font-label-md text-label-md text-primary font-semibold">{address ? address.slice(0, 6) + '...' + address.slice(-4) : "Not Connected"}</span>`
);

// 3. Update tabs to reflect state
// Replace classNames with dynamic ones based on step
for (let i = 1; i <= 4; i++) {
  const activeClass = i === 1 ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface';
  const checkIcon = i === 1 ? 'check_circle' : 'pending';
  // We need to inject dynamic classes for the tabs.
  // Instead of complex regex, let's just replace the raw button tags.
}

// Actually, regex replacements are safer if done carefully.
content = content.replace(
  /className="text-left p-3.5 bg-primary-container text-on-primary rounded-DEFAULT shadow-md flex items-center justify-between transition-all" id="tab-step-1"  type="button"/,
  `className={\`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between transition-all \${step === 1 ? 'bg-primary-container text-on-primary' : step > 1 ? 'bg-surface-container-highest text-primary' : 'bg-surface-container-low text-on-surface'}\`} onClick={() => setStep(1)} type="button"`
);
content = content.replace(
  /className="text-left p-3.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-2"  type="button"/,
  `className={\`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container \${step === 2 ? 'bg-primary-container text-on-primary' : step > 2 ? 'bg-surface-container-highest text-primary' : 'bg-surface-container-low text-on-surface'}\`} onClick={() => step > 1 && setStep(2)} type="button" disabled={step < 2}`
);
content = content.replace(
  /className="text-left p-3.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-3"  type="button"/,
  `className={\`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container \${step === 3 ? 'bg-primary-container text-on-primary' : step > 3 ? 'bg-surface-container-highest text-primary' : 'bg-surface-container-low text-on-surface'}\`} onClick={() => step > 2 && setStep(3)} type="button" disabled={step < 3}`
);
content = content.replace(
  /className="text-left p-3.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-4"  type="button"/,
  `className={\`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container \${step === 4 ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface'}\`} onClick={() => step > 3 && setStep(4)} type="button" disabled={step < 4}`
);

// 4. Update panel visibility
content = content.replace(
  /className="step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant\/30 relative overflow-hidden" id="step-panel-1"/g,
  `className={\`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden \${step === 1 ? '' : 'hidden'}\`}`
);
content = content.replace(
  /className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant\/30 relative overflow-hidden" id="step-panel-2"/g,
  `className={\`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden \${step === 2 ? '' : 'hidden'}\`}`
);
content = content.replace(
  /className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant\/30 relative overflow-hidden" id="step-panel-3"/g,
  `className={\`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden \${step === 3 ? '' : 'hidden'}\`}`
);
content = content.replace(
  /className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant\/30 relative overflow-hidden" id="step-panel-4"/g,
  `className={\`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden \${step === 4 ? '' : 'hidden'}\`}`
);

// 5. Connect inputs to state
content = content.replace(
  /<input className="(.*?)" id="nct-input"(.*?)value="NCT04470427"\/>/g,
  `<input className="$1" id="nct-input"$2value={nct} onChange={(e) => setNct(e.target.value.toUpperCase())}/>`
);
content = content.replace(
  /<span className="font-label-lg text-label-lg font-bold text-primary font-mono tracking-wider" id="normalized-display">NCT04470427<\/span>/g,
  `<span className="font-label-lg text-label-lg font-bold text-primary font-mono tracking-wider" id="normalized-display">{nct}</span>`
);
content = content.replace(
  /<span className="font-label-sm text-\[11px\] text-on-surface-variant font-mono truncate block" id="query-display">\/api\/v2\/studies\/NCT04470427<\/span>/g,
  `<span className="font-label-sm text-[11px] text-on-surface-variant font-mono truncate block" id="query-display">/api/v2/studies/{nct}</span>`
);

// Proceed buttons
content = content.replace(
  /<button className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Proceed to Status Claim<\/span>/g,
  `<button onClick={() => setStep(2)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"$1type="button">\n<span>Proceed to Status Claim</span>`
);
content = content.replace(
  /<button className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back<\/span>\s*<span>Back<\/span>\s*<\/button>\s*<button className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Configure Collateral<\/span>/g,
  `<button onClick={() => setStep(1)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"$1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>\n<button onClick={() => setStep(3)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"$2type="button">\n<span>Configure Collateral</span>`
);
content = content.replace(
  /<button className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back<\/span>\s*<span>Back<\/span>\s*<\/button>\s*<button className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Review Docket<\/span>/g,
  `<button onClick={() => setStep(2)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"$1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>\n<button onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"$2type="button">\n<span>Review Docket</span>`
);
content = content.replace(
  /<button className="w-full sm:w-auto px-5 py-2.5 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-1.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back<\/span>\s*<span>Back<\/span>\s*<\/button>/g,
  `<button onClick={() => setStep(3)} className="w-full sm:w-auto px-5 py-2.5 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-1.5"$1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>`
);

// Make status cards selectable
const statuses = ["RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING", "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED", "WITHDRAWN", "SUSPENDED"];
for (const s of statuses) {
  content = content.replace(
    new RegExp(\`data-status="\${s}" >\`, "g"),
    \`data-status="\${s}" onClick={() => setStatus("\${s}")} >\`
  );
  if (s === "COMPLETED") {
    content = content.replace(
      /className="status-card active-status cursor-pointer p-4 bg-secondary-fixed\/30 rounded-DEFAULT border-2 border-secondary shadow-xs hover:bg-secondary-fixed\/40 transition-all flex items-start justify-between"/g,
      \`className={\\\`status-card cursor-pointer p-4 rounded-DEFAULT transition-all flex items-start justify-between \${status === "\${s}" ? 'bg-secondary-fixed/30 border-2 border-secondary shadow-xs hover:bg-secondary-fixed/40' : 'bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container'}\\\`}\`
    );
    // Replace the radio indicator too
    content = content.replace(
      /<span className="radio-indicator w-4 h-4 rounded-full border-2 border-secondary mt-1 flex items-center justify-center bg-secondary">\s*<span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"><\/span>\s*<\/span>/g,
      \`<span className={\\\`radio-indicator w-4 h-4 rounded-full mt-1 flex items-center justify-center \${status === "\${s}" ? 'border-2 border-secondary bg-secondary' : 'border border-outline'}\\\`}>\n{status === "\${s}" && <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>}\n</span>\`
    );
  } else {
    content = content.replace(
      new RegExp(\`className="status-card cursor-pointer p-4 bg-surface-container-low rounded-DEFAULT border border-outline-variant/50 hover:bg-surface-container transition-all flex items-start justify-between" data-status="\${s}"\`, 'g'),
      \`className={\\\`status-card cursor-pointer p-4 rounded-DEFAULT transition-all flex items-start justify-between \${status === "\${s}" ? 'bg-secondary-fixed/30 border-2 border-secondary shadow-xs hover:bg-secondary-fixed/40' : 'bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container'}\\\`} data-status="\${s}"\`
    );
    content = content.replace( // This will match the radio indicator for non-completed ones if we loop, but wait, the HTML structure might differ slightly. I'll just use a generic replace for radio indicators inside cards.
      // Wait, it's easier to just leave the original non-active classes and rely on the regex replacement for the classname.
      // But we need the inner circle to show conditionally.
      "", ""
    );
  }
}

// Global replacement for radio indicators in the status grid to be dynamic
content = content.replace(
  /className="radio-indicator w-4 h-4 rounded-full border border-outline mt-1 flex items-center justify-center"><\/span>/g,
  \`className="radio-indicator w-4 h-4 rounded-full border border-outline mt-1 flex items-center justify-center">{/* conditionally rendered in react */ }</span>\`
);
// We'll just leave the visual radio indicator mostly static for the unselected ones, or wait, we can just replace the whole status grid block.
// Let's replace the whole status grid block with a map loop!

const statusGridMatch = content.match(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">([\s\S]*?)<\/div>\s*<div className="p-3\.5/);
if (statusGridMatch) {
  const dynamicGrid = \`
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">
  {["RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING", "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED", "WITHDRAWN", "SUSPENDED"].map((s) => (
    <div key={s} onClick={() => setStatus(s)} className={\\\`status-card cursor-pointer p-4 rounded-DEFAULT transition-all flex items-start justify-between \${status === s ? 'bg-secondary-fixed/30 border-2 border-secondary shadow-xs hover:bg-secondary-fixed/40' : 'bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container'}\\\`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-label-sm px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded-DEFAULT font-bold">{s}</span>
        </div>
        <p className="font-body-sm text-body-sm text-outline mt-1.5">Claim status: {s}</p>
      </div>
      <span className={\\\`radio-indicator w-4 h-4 rounded-full mt-1 flex items-center justify-center \${status === s ? 'border-2 border-secondary bg-secondary' : 'border border-outline'}\\\`}>
        {status === s && <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>}
      </span>
    </div>
  ))}
  </div>
  \`;
  content = content.replace(statusGridMatch[1], dynamicGrid.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">/, '').replace(/<\/div>\s*$/, ''));
}


// Replace step 4 confirmation panel with GenLayerTransactionPanel
const transactionPanelReplacement = \`
  {kit ? (
    <GenLayerTransactionPanel
      kit={kit}
      network="GenLayer Studio Next"
      theme="light"
      userValue={5000000000000000000n}
      onDone={(result) => {
        console.log("Done!", result);
      }}
      tx={{
        kind: 'write',
        address: contractAddress as \`0x\${string}\`,
        method: 'post_stamp',
        args: [nct, status, nonce]
      }}
    />
  ) : (
    <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT">Transaction Kit not initialized. Please connect wallet.</div>
  )}
\`;

content = content.replace(
  /<button className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-lg text-label-lg font-semibold uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg" id="submit-stamp-btn"  type="button">([\s\S]*?)<\/button>/,
  transactionPanelReplacement
);

content = content.replace(
  /<span className="font-label-lg text-label-lg font-bold text-primary font-mono" id="confirm-nct">NCT04470427<\/span>/g,
  \`<span className="font-label-lg text-label-lg font-bold text-primary font-mono" id="confirm-nct">{nct}</span>\`
);
content = content.replace(
  /<span className="font-label-lg text-label-lg font-bold text-secondary font-mono" id="confirm-status">COMPLETED<\/span>/g,
  \`<span className="font-label-lg text-label-lg font-bold text-secondary font-mono" id="confirm-status">{status}</span>\`
);
content = content.replace(
  /<code className="font-mono text-label-sm text-on-surface truncate" id="confirm-url">https:\/\/clinicaltrials.gov\/api\/v2\/studies\/NCT04470427<\/code>/g,
  \`<code className="font-mono text-label-sm text-on-surface truncate" id="confirm-url">https://clinicaltrials.gov/api/v2/studies/{nct}</code>\`
);

fs.writeFileSync('src/app/post/page.tsx', content, 'utf-8');
