import re

with open("src/app/me/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make it a client component
header = """"use client";
import { useState } from "react";
import { useGenLayer } from "../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";

export default function Page() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { kit, address } = useGenLayer();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
"""
content = content.replace("export default function Page() {", header)

# Inject the transaction panel
panel_html = """
<div className="mt-4 flex items-center justify-end">
{!isWithdrawing ? (
  <button onClick={() => setIsWithdrawing(true)} className="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider rounded-DEFAULT transition-all flex items-center gap-1.5 shadow-sm" id="withdrawBtn">
  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
  <span>Withdraw 4.875 GEN</span>
  </button>
) : kit ? (
  <div className="flex flex-col gap-2">
    <GenLayerTransactionPanel
        kit={kit}
        network="GenLayer Studio Next"
        theme="light"
        onDone={(result) => setIsWithdrawing(false)}
        tx={{
          kind: 'write',
          address: contractAddress as `0x${string}`,
          method: 'withdraw',
          args: []
        }}
    />
    <button onClick={() => setIsWithdrawing(false)} className="px-4 py-2 text-on-surface hover:bg-surface-container rounded-DEFAULT">Cancel</button>
  </div>
) : (
  <div className="p-2 bg-error-container text-on-error-container">Not Connected</div>
)}
</div>
"""
content = re.sub(
    r'<div className="mt-4 flex items-center justify-end">[\s\S]*?</button>\s*</div>',
    panel_html.strip(),
    content
)

with open("src/app/me/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
