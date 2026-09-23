"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGenLayer } from "../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";

export default function Page() {
  const [step, setStep] = useState(1);
  const [nct, setNct] = useState("NCT04470427");
  const [status, setStatus] = useState("COMPLETED");
  const bond = "5.00";
  const [txSuccess, setTxSuccess] = useState(false);
  const { kit, address } = useGenLayer();
  const [nonce, setNonce] = useState("");
  useEffect(() => { setNonce(Math.random().toString(36).substring(2, 15)); }, []);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661";
  const isValidNct = /^NCT\d{8}$/i.test(nct);

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md"><div className="flex flex-col w-full">
<div className="w-full pb-space-xl">

<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-space-lg mb-space-lg border-b border-outline-variant/30">
<div className="space-y-2">
<div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container-high rounded-DEFAULT text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="tracking-widest uppercase">REGISTRATION REQUISITION // RECORD #09</span>
<span className="text-outline">·</span>
<span className="font-mono text-outline">REF # 8294-REV2</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-normal">
          Post an Attestation Stamp
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Construct an immutable state claim anchored to the NIH clinical trials repository. GenLayer validators deterministically fetch, hash, and notarize the official study lifecycle stage.
        </p>
</div>

<div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-DEFAULT shadow-sm border border-outline-variant/30 self-start lg:self-auto">
<div className="w-10 h-10 rounded-DEFAULT bg-primary-container flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Connected Signer</span>
<span className="font-label-md text-label-md text-primary font-semibold">{address ? address.slice(0, 6) + "..." + address.slice(-4) : "Not Connected"}</span>
<span className="font-label-sm text-label-sm text-secondary font-medium mt-0.5">Available: 24.50 test GEN</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-space-xl">

<button suppressHydrationWarning className={`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between border border-outline-variant/30 transition-all ${step === 1 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => setStep(1)} type="button">
<div className="flex items-center gap-3">
<span className="w-6 h-6 rounded-DEFAULT bg-surface-container-highest text-primary font-label-sm text-label-sm flex items-center justify-center font-bold">01</span>
<div>
<div className="font-label-sm text-[10px] uppercase tracking-widest text-inverse-primary">Identifier</div>
<div className="font-body-md text-body-md font-semibold text-surface-container-lowest">Study ID (NCT)</div>
</div>
</div>
<span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check_circle</span>
</button>

<button suppressHydrationWarning className={`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between border border-outline-variant/30 transition-all ${step === 2 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 1 && setStep(2)} type="button" disabled={step < 2}>
<div className="flex items-center gap-3">
<span className="w-6 h-6 rounded-DEFAULT bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">02</span>
<div>
<div className="font-label-sm text-[10px] uppercase tracking-widest text-outline">Target State</div>
<div className="font-body-md text-body-md font-semibold text-primary">Official Status</div>
</div>
</div>
<span className="material-symbols-outlined text-[16px] text-outline">pending</span>
</button>

<button suppressHydrationWarning className={`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between border border-outline-variant/30 transition-all ${step === 3 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 2 && setStep(3)} type="button" disabled={step < 3}>
<div className="flex items-center gap-3">
<span className="w-6 h-6 rounded-DEFAULT bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">03</span>
<div>
<div className="font-label-sm text-[10px] uppercase tracking-widest text-outline">Collateral</div>
<div className="font-body-md text-body-md font-semibold text-primary">Lock Bond</div>
</div>
</div>
<span className="material-symbols-outlined text-[16px] text-outline">lock</span>
</button>

<button suppressHydrationWarning className={`text-left p-3.5 rounded-DEFAULT shadow-md flex items-center justify-between border border-outline-variant/30 transition-all ${step === 4 ? "bg-surface-container-highest text-primary" : "bg-surface-container-low text-on-surface"}`} onClick={() => step > 3 && setStep(4)} type="button" disabled={step < 4}>
<div className="flex items-center gap-3">
<span className="w-6 h-6 rounded-DEFAULT bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">04</span>
<div>
<div className="font-label-sm text-[10px] uppercase tracking-widest text-outline">Attestation</div>
<div className="font-body-md text-body-md font-semibold text-primary">Review &amp; Confirm</div>
</div>
</div>
<span className="material-symbols-outlined text-[16px] text-outline">assignment_turned_in</span>
</button>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

<div className="lg:col-span-8 flex flex-col gap-6">

<div className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 1 ? "" : "hidden"}`}>

<div className="absolute top-0 right-8 px-4 py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-widest border-b border-l border-r border-outline-variant/30 rounded-b-DEFAULT">
            Record Entry // Protocol Identifier
          </div>
<div className="mb-6 space-y-1">
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Step 01 of 04</span>
<h2 className="font-headline-md text-headline-md text-primary">Clinical Study Identifier (NCT)</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Provide the exact identifier issued by the U.S. National Library of Medicine. Strict syntax normalization is enforced on-chain.
            </p>
</div>
<div className="space-y-6">
<div className="flex flex-col gap-2">
<label className="font-label-lg text-label-lg text-primary flex items-center gap-1.5 uppercase" htmlFor="nct-input">
<span>NCT Identifier</span>
<span className="text-error font-bold">*</span>
</label>
<div className="relative">
<input suppressHydrationWarning className="w-full px-4 py-3 bg-surface-container-low font-label-lg text-[18px] tracking-[0.2em] font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20 rounded-DEFAULT border-b-2 border-primary uppercase placeholder:text-outline-variant transition-all shadow-inner" id="nct-input" maxLength={11} placeholder="e.g. NCT04470427" type="text" value={nct} onChange={(e) => setNct(e.target.value.toUpperCase())}/>
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
  {isValidNct ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EEF3E6] text-[#536233] border border-[#C8D8B0] font-label-sm text-[10px] rounded-DEFAULT" id="nct-valid-badge">
      <span className="material-symbols-outlined text-[12px]">check</span> VALID SYNTAX
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-container text-on-error-container border border-error/30 font-label-sm text-[10px] rounded-DEFAULT" id="nct-invalid-badge">
      <span className="material-symbols-outlined text-[12px]">error</span> INVALID
    </span>
  )}
</div>
</div>
{isValidNct ? (
  <p className="font-body-sm text-body-sm text-outline mt-1 flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px]">info</span>
    Official ClinicalTrials.gov identifier only. No brand names, trial nicknames, or hospital URLs.
  </p>
) : (
  <p className="font-body-sm text-body-sm text-error mt-1 flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px]">error</span>
    ID must be NCT followed by exactly 8 digits (e.g., NCT04470427)
  </p>
)}
</div>

<div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline-variant/40 space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Normalization Logic Preview</span>
<span className="font-label-sm text-label-sm text-secondary font-mono">RegEx: ^NCT[0-9]{"{"}8{"}"}$</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div className="bg-surface-container-lowest p-3 rounded-DEFAULT shadow-xs border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block mb-1">Normalized Identifier</span>
<span className="font-label-lg text-label-lg font-bold text-primary font-mono tracking-wider" id="normalized-display">{nct}</span>
</div>
<div className="bg-surface-container-lowest p-3 rounded-DEFAULT shadow-xs border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block mb-1">Query Endpoint</span>
<span className="font-label-sm text-[11px] text-on-surface-variant font-mono truncate block" id="query-display">/api/v2/studies/{nct}</span>
</div>
</div>
<div className="flex items-start gap-2 pt-2 border-t border-outline-variant/20">
<span className="material-symbols-outlined text-[16px] text-[#536233] mt-0.5">verified</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                  Syntax accepted. The contract strips leading/trailing whitespaces, uppercases characters, and asserts an 8-numeric index.
                </p>
</div>
</div>
<div className="pt-4 flex items-center justify-end">
<button suppressHydrationWarning onClick={() => setStep(2)} disabled={!isValidNct} className={`px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT transition-all flex items-center gap-2 shadow-sm ${isValidNct ? "bg-primary text-on-primary hover:bg-primary-container" : "bg-surface-container-high text-outline cursor-not-allowed"}`} type="button">
<span>Proceed to Status Claim</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>

<div className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 2 ? "" : "hidden"}`}>
<div className="absolute top-0 right-8 px-4 py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-widest border-b border-l border-r border-outline-variant/30 rounded-b-DEFAULT">
            Record Entry // Official Status
          </div>
<div className="mb-6 space-y-1">
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Step 02 of 04</span>
<h2 className="font-headline-md text-headline-md text-primary">Claimed Protocol Lifecycle State</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Select the exact NIH status you are claiming this study currently holds. This is the condition the validators will test.
            </p>
</div>
<div className="space-y-6">

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

<div className="p-3.5 bg-surface-container-high rounded-DEFAULT border border-outline-variant/30 flex items-center gap-3">
<span className="material-symbols-outlined text-[18px] text-secondary">gavel</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
<strong className="font-semibold text-primary">Invariance Mandate:</strong> Status chip does not modify fee or payout weights. It is the exact enum expected from the feed.
              </p>
</div>
<div className="pt-4 flex items-center justify-between border-t border-outline-variant/20">
<button suppressHydrationWarning onClick={() => setStep(1)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"  type="button">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span>Back</span>
</button>
<button suppressHydrationWarning onClick={() => setStep(3)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"  type="button">
<span>Configure Collateral</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>

<div className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 3 ? "" : "hidden"}`}>
<div className="absolute top-0 right-8 px-4 py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-widest border-b border-l border-r border-outline-variant/30 rounded-b-DEFAULT">
            Record Entry // Bond Escrow
          </div>
<div className="mb-6 space-y-1">
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Step 03 of 04</span>
<h2 className="font-headline-md text-headline-md text-primary">Escrow Collateral &amp; Economic Guarantee</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Locking test GEN acts as skin-in-the-game collateral. If your status assertion accurately matches NIH records, 97.5% is refunded.
            </p>
</div>
<div className="space-y-6">

<div className="p-5 bg-surface-container-low rounded-DEFAULT border border-outline-variant/40 space-y-4">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
<label className="font-label-lg text-label-lg text-primary uppercase" htmlFor="bond-input">
                  Bond Amount (test GEN)
                </label>
<div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span>Wallet Balance:</span>
<span className="font-mono font-semibold text-secondary">24.50 test GEN</span>
</div>
</div>
<div className="flex items-center gap-3">
<div className="relative flex-grow">
<input suppressHydrationWarning className="w-full pl-4 pr-24 py-3 bg-surface-container font-label-md text-[16px] text-on-surface outline-none rounded-DEFAULT border border-outline-variant/30" type="text" readOnly value="5.00" />
<span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-md text-label-md text-outline uppercase">test GEN</span>
</div>
<div className="px-3 py-3 bg-surface-container-high rounded-DEFAULT text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
                  Standard Tier
                </div>
</div>
<p className="font-body-sm text-body-sm text-outline">
                Fixed at 5.00 test GEN during Studio Next devnet phase to maintain uniform consensus weight across validating nodes.
              </p>
</div>

<div className="space-y-3">
<div className="flex items-center justify-between">
<h3 className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Deterministic Resolution Matrix</h3>
<span className="font-label-sm text-[10px] text-on-surface-variant">Standard Protocol Surcharge: 2.50%</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm border-collapse">
<thead>
<tr className="border-b border-outline-variant/40 bg-surface-container-high text-on-surface font-label-sm text-[11px] uppercase tracking-wider">
<th className="py-2.5 px-3">Resolution</th>
<th className="py-2.5 px-3">Condition Description</th>
<th className="py-2.5 px-3 text-right">Net Flow To You</th>
<th className="py-2.5 px-3 text-right">Fee Surcharge</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20 font-mono text-[12px]">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<span className="font-label-sm px-2 py-0.5 bg-[#EEF3E6] text-[#536233] border border-[#C8D8B0] rounded-DEFAULT font-bold">MATCH</span>
</td>
<td className="py-3 px-3 font-sans text-on-surface">NIH feed confirms claimed status: <span className="font-mono font-semibold">COMPLETED</span></td>
<td className="py-3 px-3 text-right font-bold text-[#2F5C3E]">+4.875 GEN (97.5%)</td>
<td className="py-3 px-3 text-right text-outline">0.125 GEN (2.5%)</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<span className="font-label-sm px-2 py-0.5 bg-[#F9EAE1] text-[#A0381C] border border-[#E6B5A1] rounded-DEFAULT font-bold">MISS</span>
</td>
<td className="py-3 px-3 font-sans text-on-surface">Feed returned different NIH status than claimed</td>
<td className="py-3 px-3 text-right font-bold text-error">0.000 GEN (Bond Forfeited)</td>
<td className="py-3 px-3 text-right text-outline">Stamper Bounty</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<span className="font-label-sm px-2 py-0.5 bg-[#FDF5E2] text-[#966517] border border-[#E6CE91] rounded-DEFAULT font-bold">THIN</span>
</td>
<td className="py-3 px-3 font-sans text-on-surface">HTTP 404, 5xx, or unreadable JSON schema</td>
<td className="py-3 px-3 text-right font-bold text-primary">+5.000 GEN (100% Refund)</td>
<td className="py-3 px-3 text-right text-outline">0.000 GEN</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<span className="font-label-sm px-2 py-0.5 bg-[#ECEAE5] text-[#5E564F] border border-[#CBC6BD] rounded-DEFAULT font-bold">CANCELED</span>
</td>
<td className="py-3 px-3 font-sans text-on-surface">Canceled prior to first validator attest execution</td>
<td className="py-3 px-3 text-right font-bold text-primary">+5.000 GEN (100% Refund)</td>
<td className="py-3 px-3 text-right text-outline">0.000 GEN</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="pt-4 flex items-center justify-between border-t border-outline-variant/20">
<button suppressHydrationWarning onClick={() => setStep(2)} className="px-5 py-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center gap-1.5"  type="button">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span>Back</span>
</button>
<button suppressHydrationWarning onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"  type="button">
<span>Review Protocol</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>

<div className={`step-panel flex flex-col bg-surface-container-lowest p-6 lg:p-8 rounded-DEFAULT shadow-md border border-outline-variant/30 relative overflow-hidden ${step === 4 ? "" : "hidden"}`}>
<div className="absolute top-0 right-8 px-4 py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-widest border-b border-l border-r border-outline-variant/30 rounded-b-DEFAULT">
            Record Entry // Final Attestation
          </div>
<div className="mb-6 space-y-1">
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Step 04 of 04</span>
<h2 className="font-headline-md text-headline-md text-primary">Cryptographic Review &amp; Sign-off</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Confirm requisition details prior to dispatching state transition to GenLayer Studio Next consensus.
            </p>
</div>

<div className="relative bg-[#FBF8F2] p-6 rounded-DEFAULT border-2 border-primary/20 shadow-md space-y-6">

<div className="absolute right-4 top-4 pointer-events-none select-none opacity-85 transform rotate-[-6deg]">
<div className="w-28 h-28 rounded-full border-2 border-dashed border-secondary flex flex-col items-center justify-center p-2 text-center text-secondary">
<span className="font-label-sm text-[7px] uppercase tracking-widest">GENLAYER VERIFIER</span>
<span className="material-symbols-outlined text-[20px] my-0.5">lock_clock</span>
<span className="font-label-sm text-[8px] font-bold tracking-tight">READY TO ATTEST</span>
<span className="font-mono text-[7px] mt-0.5">DEVNET-61997</span>
</div>
</div>

<div className="border-b border-outline-variant/40 pb-4">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm italic text-primary">TrialLine Protocol Requisition Slip</span>
<span className="font-label-sm text-label-sm text-outline font-mono">DOC ID: TL-2025-0841</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Autonomous Oracle Contract: 0x93FA...E412 (Studio Devnet v0.9.4)</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block">Clinical Identifier (NCT ID)</span>
<span className="font-label-lg text-label-lg font-bold text-primary font-mono" id="confirm-nct">{nct}</span>
</div>
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block">Claimed Protocol Status</span>
<span className="font-label-lg text-label-lg font-bold text-secondary font-mono" id="confirm-status">{status}</span>
</div>
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block">Locked Escrow Bond</span>
<span className="font-label-lg text-label-lg font-bold text-primary font-mono">{bond} test GEN</span>
</div>
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block">Target Consensus Network</span>
<span className="font-label-lg text-label-lg font-bold text-primary font-mono">GenLayer Studio Next (61997)</span>
</div>
</div>

<div className="p-3 bg-surface-container-low rounded-DEFAULT border border-outline-variant/30">
<span className="font-label-sm text-[10px] text-outline uppercase block mb-1">Constructed API Target (Immutable)</span>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-outline">link</span>
<code className="font-mono text-label-sm text-on-surface truncate" id="confirm-url">https://clinicaltrials.gov/api/v2/studies/{nct}</code>
</div>
</div>

<div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
<span className="font-label-sm text-[10px] uppercase tracking-widest text-outline block mb-2">Deterministic Compliance Guarantees</span>
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px] text-[#536233]">check_circle</span>
<span>Zero custom host overrides permitted — bound exclusively to clinicaltrials.gov</span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px] text-[#536233]">check_circle</span>
<span>No arbitrary free-text or biased sentiment parameters permitted in call payload</span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px] text-[#536233]">check_circle</span>
<span>Bond stays locked for 10 minutes. Cancel and expire are rejected until that window closes.</span>
</div>
</div>

<div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
<button suppressHydrationWarning onClick={() => setStep(3)} className="w-full sm:w-auto px-5 py-2.5 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-1.5"  type="button">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span>Back</span>
</button>

  {txSuccess ? (
    <div className="flex flex-col items-center justify-center p-8 bg-[#EEF3E6] border border-[#C8D8B0] rounded-DEFAULT space-y-4 w-full">
      <span className="material-symbols-outlined text-[48px] text-[#536233]">check_circle</span>
      <h3 className="font-headline-md text-headline-md text-[#2F5C3E]">Stamp Posted Successfully!</h3>
      <p className="font-body-md text-body-md text-on-surface text-center max-w-md">
        Your attestation has been secured on the GenLayer Devnet. Validators are actively notarizing the study endpoint.
      </p>
      <Link href="/browse">
        <button className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm">
          <span>View in Browse</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </Link>
    </div>
  ) : (
    !isValidNct ? (
      <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        ID must be NCT followed by exactly 8 digits. Please go back to Step 1.
      </div>
    ) : kit ? (
      <GenLayerTransactionPanel
        kit={kit}
        network="GenLayer Studio Next"
        theme="light"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDone={(result: any) => {
          console.log("Done!", result);
          const txStatus = result?.statusName || result?.status;
          const execution = result?.executionResultName || result?.executionResult || result?.execution?.result || result?.lifecycle?.outcome;
          
          if ((txStatus === 'ACCEPTED' || txStatus === 'FINALIZED') && 
              (execution === 'FINISHED_WITH_RETURN' || execution === 'accepted' || !execution)) {
            setTimeout(() => {
              setTxSuccess(true);
              setNonce(Math.random().toString(36).substring(2, 15));
            }, 0);
          } else {
            console.error("Transaction failed execution:", result, result instanceof Error ? result.message : JSON.stringify(result, Object.getOwnPropertyNames(result)));
          }
        }}
        userValue={BigInt("5000000000000000000")}
        tx={{
          kind: 'write',
          address: contractAddress as `0x${string}`,
          method: 'post_stamp',
          args: [nct, status, nonce]
        }}
      />
    ) : (
      <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT">Transaction Kit not initialized. Please connect wallet.</div>
    )
  )}

</div>

<div className="hidden mt-4 p-4 bg-[#EEF3E6] border border-[#C8D8B0] rounded-DEFAULT" id="confirmation-banner">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-[24px] text-[#536233]">task_alt</span>
<div className="space-y-1">
<h4 className="font-headline-sm text-headline-sm text-[#2F5C3E]">Attestation Stamp Requisition Broadcast!</h4>
<p className="font-body-sm text-body-sm text-on-surface">
                    Transaction hash: <span className="font-mono font-semibold">0x4ae8...339b</span> on Chain 61997. 5.00 test GEN deposited into escrow. Validators are scheduled for immediate verification against NIH endpoints.
                  </p>
<div className="pt-2 flex items-center gap-3">
<a className="font-label-sm text-label-sm uppercase font-semibold text-secondary hover:underline flex items-center gap-1" href="#">
<span>View in Explorer</span>
<span className="material-symbols-outlined text-[12px]">open_in_new</span>
</a>
<span className="text-outline">·</span>
<a className="font-label-sm text-label-sm uppercase font-semibold text-primary hover:underline" href="#" >
                      Post Another Stamp
                    </a>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-6">

<div className="bg-surface-container-low p-6 rounded-DEFAULT shadow-sm border border-outline-variant/40 space-y-4">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
<span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">Clinical Reference Guide</span>
<span className="font-mono text-label-sm text-secondary">ARCH-771</span>
</div>

<div className="p-3 bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30 flex items-center justify-center">
<svg className="w-full h-24 text-outline-variant" fill="none" viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
<path className="text-secondary/60" d="M10 40H60L75 15L90 65L105 30L115 50L125 40H270" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
<circle className="text-secondary" cx="75" cy="15" fill="currentColor" r="3"></circle>
<circle className="text-secondary" cx="90" cy="65" fill="currentColor" r="3"></circle>
<circle className="text-secondary" cx="105" cy="30" fill="currentColor" r="3"></circle>
<line className="text-outline/40" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.5" x1="10" x2="270" y1="75" y2="75"></line>
<text className="text-outline" fill="currentColor" fontFamily="JetBrains Mono" fontSize="8" x="12" y="72">NIH API RESPONSE TIME-SERIES DETERMINISM</text>
</svg>
</div>
<div className="space-y-3">
<h4 className="font-headline-sm text-headline-sm text-primary">How stamps resolve</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              TrialLine utilizes multi-node execution consensus. Once an attestation is opened, GenLayer nodes query the study record directly over deterministic TLS feeds.
            </p>
<div className="p-3 bg-surface-container rounded-DEFAULT space-y-2">
<div className="flex items-center justify-between font-label-sm text-[11px]">
<span className="text-on-surface-variant">Required Quorum</span>
<span className="font-mono font-bold text-primary">3 of 5 Nodes</span>
</div>
<div className="flex items-center justify-between font-label-sm text-[11px]">
<span className="text-on-surface-variant">Max Attestation Delay</span>
<span className="font-mono font-bold text-primary">&lt; 12 Seconds</span>
</div>
<div className="flex items-center justify-between font-label-sm text-[11px]">
<span className="text-on-surface-variant">Hash Normalization</span>
<span className="font-mono font-bold text-primary">SHA-256 Digest</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-5 rounded-DEFAULT shadow-sm border border-outline-variant/40 space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-[10px] uppercase tracking-wider text-outline">Target NIH Metadata</span>
<span className="font-label-sm text-[10px] bg-surface-container px-1.5 py-0.5 rounded-DEFAULT text-on-surface font-mono">JSON v2</span>
</div>
<div className="space-y-1">
<span className="font-headline-sm text-headline-sm text-primary block leading-tight">mRNA-1273 SARS-CoV-2 Trial</span>
<span className="font-body-sm text-body-sm text-outline">ModernaTX, Inc. &amp; NIAID</span>
</div>
<div className="text-[12px] font-mono p-3 bg-surface-container-high rounded-DEFAULT text-on-surface-variant space-y-1 overflow-x-auto">
<div className="text-outline">{/* Parsed JSON payload excerpt */}</div>
<div>&quot;protocolSection&quot;: {"{"}</div>
<div className="pl-3">&quot;statusModule&quot;: {"{"}</div>
<div className="pl-6 text-secondary font-semibold">&quot;overallStatus&quot;: &quot;COMPLETED&quot;,</div>
<div className="pl-6">&quot;startDateStruct&quot;: {"{"} &quot;date&quot;: &quot;2020-07&quot; {"}"},</div>
<div className="pl-6">&quot;completionDateStruct&quot;: {"{"} &quot;date&quot;: &quot;2022-12&quot; {"}"}</div>
<div className="pl-3">{"}"}</div>
<div>{"}"}</div>
</div>
<p className="font-body-sm text-[11px] text-outline">
            The intelligent consensus engine extracts strictly the <code className="font-mono text-primary font-semibold">overallStatus</code> property for comparison against your selection.
          </p>
</div>

<div className="p-4 bg-surface-container-low rounded-DEFAULT border-l-2 border-secondary space-y-1.5">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Archival Integrity</span>
<p className="font-body-sm text-body-sm text-on-surface">
            Once submitted, your stamp transaction becomes part of the permanent TrialLine archival ledger on Chain 61997.
          </p>
</div>
</div>
</div>
</div>
</div>
</div>
    </>
  );
}
