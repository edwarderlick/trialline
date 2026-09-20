import re

with open("src/app/post/page.backup.tsx", "r", encoding="utf-8") as f:
    content = f.read()

header = """"use client";
import { useState, useId } from "react";
import { useGenLayer } from "../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";

export default function Page() {
  const [step, setStep] = useState(1);
  const [nct, setNct] = useState("NCT04470427");
  const [status, setStatus] = useState("COMPLETED");
  const { kit, address } = useGenLayer();
  const nonce = useId();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
"""

content = content.replace("export default function Page() {", header)
content = content.replace(
    '<span className="font-label-md text-label-md text-primary font-semibold">0x71C...4f9b</span>',
    '<span className="font-label-md text-label-md text-primary font-semibold">{address ? address.slice(0, 6) + "..." + address.slice(-4) : "Not Connected"}</span>'
)

# Tabs
content = re.sub(
    r'className="text-left p-3\.5 bg-primary-container text-on-primary rounded-DEFAULT shadow-md flex items-center justify-between transition-all" id="tab-step-1"  type="button"',
    r'className={`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between transition-all ${step === 1 ? "bg-primary-container text-on-primary" : step > 1 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => setStep(1)} type="button"',
    content
)
content = re.sub(
    r'className="text-left p-3\.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-2"  type="button"',
    r'className={`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container ${step === 2 ? "bg-primary-container text-on-primary" : step > 2 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 1 && setStep(2)} type="button" disabled={step < 2}',
    content
)
content = re.sub(
    r'className="text-left p-3\.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-3"  type="button"',
    r'className={`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container ${step === 3 ? "bg-primary-container text-on-primary" : step > 3 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 2 && setStep(3)} type="button" disabled={step < 3}',
    content
)
content = re.sub(
    r'className="text-left p-3\.5 bg-surface-container-low text-on-surface rounded-DEFAULT shadow-sm flex items-center justify-between hover:bg-surface-container transition-all" id="tab-step-4"  type="button"',
    r'className={`text-left p-3.5 rounded-DEFAULT shadow-sm flex items-center justify-between transition-all hover:bg-surface-container ${step === 4 ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 3 && setStep(4)} type="button" disabled={step < 4}',
    content
)

# Panels
content = re.sub(
    r'className="step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden" id="step-panel-1"',
    r'className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 1 ? "" : "hidden"}`}',
    content
)
content = re.sub(
    r'className="step-panel hidden flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden" id="step-panel-2"',
    r'className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 2 ? "" : "hidden"}`}',
    content
)
content = re.sub(
    r'className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden" id="step-panel-2"',
    r'className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 2 ? "" : "hidden"}`}',
    content
)
content = re.sub(
    r'className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden" id="step-panel-3"',
    r'className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 3 ? "" : "hidden"}`}',
    content
)
content = re.sub(
    r'className="step-panel hidden flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden" id="step-panel-4"',
    r'className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 4 ? "" : "hidden"}`}',
    content
)

# Inputs
content = re.sub(
    r'<input className="(.*?)" id="nct-input"(.*?)value="NCT04470427"/>',
    r'<input className="\1" id="nct-input"\2value={nct} onChange={(e) => setNct(e.target.value.toUpperCase())}/>',
    content
)
content = re.sub(
    r'<span className="font-label-lg text-label-lg font-bold text-primary font-mono tracking-wider" id="normalized-display">NCT04470427</span>',
    r'<span className="font-label-lg text-label-lg font-bold text-primary font-mono tracking-wider" id="normalized-display">{nct}</span>',
    content
)
content = re.sub(
    r'<span className="font-label-sm text-\[11px\] text-on-surface-variant font-mono truncate block" id="query-display">/api/v2/studies/NCT04470427</span>',
    r'<span className="font-label-sm text-[11px] text-on-surface-variant font-mono truncate block" id="query-display">/api/v2/studies/{nct}</span>',
    content
)

# Buttons
content = re.sub(
    r'<button className="px-6 py-2\.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Proceed to Status Claim</span>',
    r'<button onClick={() => setStep(2)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"\1type="button">\n<span>Proceed to Status Claim</span>',
    content
)
content = re.sub(
    r'<button className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1\.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back</span>\s*<span>Back</span>\s*</button>\s*<button className="px-6 py-2\.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Configure Collateral</span>',
    r'<button onClick={() => setStep(1)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"\1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>\n<button onClick={() => setStep(3)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"\2type="button">\n<span>Configure Collateral</span>',
    content
)
content = re.sub(
    r'<button className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1\.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back</span>\s*<span>Back</span>\s*</button>\s*<button className="px-6 py-2\.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"(.*?)type="button">\s*<span>Review Docket</span>',
    r'<button onClick={() => setStep(2)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"\1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>\n<button onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"\2type="button">\n<span>Review Docket</span>',
    content
)
content = re.sub(
    r'<button className="w-full sm:w-auto px-5 py-2\.5 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-1\.5"(.*?)type="button">\s*<span className="material-symbols-outlined text-\[16px\]">arrow_back</span>\s*<span>Back</span>\s*</button>',
    r'<button onClick={() => setStep(3)} className="w-full sm:w-auto px-5 py-2.5 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-1.5"\1type="button">\n<span className="material-symbols-outlined text-[16px]">arrow_back</span>\n<span>Back</span>\n</button>',
    content
)


match = re.search(r'<div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">([\s\S]*?)</div>\s*<div className="p-3\.5', content)
if match:
    dynamic_grid = """
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">
  {["RECRUITING", "NOT_YET_RECRUITING", "ACTIVE_NOT_RECRUITING", "ENROLLING_BY_INVITATION", "COMPLETED", "TERMINATED", "WITHDRAWN", "SUSPENDED"].map((s) => (
    <div key={s} onClick={() => setStatus(s)} className={`status-card cursor-pointer p-4 rounded-DEFAULT transition-all flex items-start justify-between ${status === s ? 'bg-secondary-fixed/30 border-2 border-secondary shadow-xs hover:bg-secondary-fixed/40' : 'bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container'}`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-label-sm px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded-DEFAULT font-bold">{s}</span>
        </div>
        <p className="font-body-sm text-body-sm text-outline mt-1.5">Claim status: {s}</p>
      </div>
      <span className={`radio-indicator w-4 h-4 rounded-full mt-1 flex items-center justify-center ${status === s ? 'border-2 border-secondary bg-secondary' : 'border border-outline'}`}>
        {status === s && <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>}
      </span>
    </div>
  ))}
  </div>
"""
    content = content.replace(match.group(1), dynamic_grid.replace('<div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="status-grid">', '').replace('</div>\n', ''))

transaction_panel = """
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
        address: contractAddress as `0x${string}`,
        method: 'post_stamp',
        args: [nct, status, nonce]
      }}
    />
  ) : (
    <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT">Transaction Kit not initialized. Please connect wallet.</div>
  )}
"""
content = re.sub(
    r'<button className="w-full sm:w-auto px-8 py-3\.5 bg-primary text-on-primary font-label-lg text-label-lg font-semibold uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg" id="submit-stamp-btn"  type="button">([\s\S]*?)</button>',
    transaction_panel,
    content
)

content = content.replace(
    '<span className="font-label-lg text-label-lg font-bold text-primary font-mono" id="confirm-nct">NCT04470427</span>',
    '<span className="font-label-lg text-label-lg font-bold text-primary font-mono" id="confirm-nct">{nct}</span>'
)
content = content.replace(
    '<span className="font-label-lg text-label-lg font-bold text-secondary font-mono" id="confirm-status">COMPLETED</span>',
    '<span className="font-label-lg text-label-lg font-bold text-secondary font-mono" id="confirm-status">{status}</span>'
)
content = content.replace(
    '<code className="font-mono text-label-sm text-on-surface truncate" id="confirm-url">https://clinicaltrials.gov/api/v2/studies/NCT04470427</code>',
    '<code className="font-mono text-label-sm text-on-surface truncate" id="confirm-url">https://clinicaltrials.gov/api/v2/studies/{nct}</code>'
)

with open("src/app/post/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
