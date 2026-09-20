import re

with open("src/app/stamp/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make it a client component
header = """"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGenLayer } from "../../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";

export default function Page() {
  const { id } = useParams();
  const [isStamping, setIsStamping] = useState(false);
  const { kit, address } = useGenLayer();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
"""
content = content.replace("export default function Page() {", header)

# Inject the transaction panel
panel_html = """
<div className="flex items-center gap-2.5 shrink-0" id="deck-buttons">
{!isStamping ? (
  <button onClick={() => setIsStamping(true)} className="px-5 py-2.5 rounded-DEFAULT bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg tracking-wider uppercase transition-all shadow-sm flex items-center gap-2" >
  <span className="material-symbols-outlined text-[18px]">verified</span>
  <span>Stamp Now</span>
  </button>
) : kit ? (
  <GenLayerTransactionPanel
      kit={kit}
      network="GenLayer Studio Next"
      theme="light"
      onDone={(result) => setIsStamping(false)}
      tx={{
        kind: 'write',
        address: contractAddress as `0x${string}`,
        method: 'match',
        args: [id as string]
      }}
  />
) : (
  <div className="p-2 bg-error-container text-on-error-container">Not Connected</div>
)}
<button onClick={() => setIsStamping(false)} className="px-4 py-2.5 rounded-DEFAULT bg-surface-container-low hover:bg-surface-container hover:text-error text-on-surface-variant font-label-md text-label-md tracking-wider uppercase transition-all border border-outline-variant flex items-center gap-1.5" >
<span className="material-symbols-outlined text-[16px]">cancel</span>
<span>Cancel</span>
</button>
</div>
"""
content = re.sub(
    r'<div className="flex items-center gap-2\.5 shrink-0" id="deck-buttons">[\s\S]*?</div>',
    panel_html.strip(),
    content
)

with open("src/app/stamp/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
