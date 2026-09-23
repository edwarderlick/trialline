import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md"><div className="flex flex-col w-full">
<div className="w-full space-y-12 pb-16">

<section className="relative pt-6 pb-8">
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
<div className="max-w-3xl space-y-4">
<div className="flex items-center gap-2">
<span className="px-2.5 py-0.5 bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider rounded-DEFAULT">
              Section 01 // Protocol Architecture
            </span>
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">10-Minute Challenge Window</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-normal leading-[1.1]">
            Put money on what the NIH <span className="italic font-normal">currently says</span> about any clinical trial.
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            TrialLine stamps an official NIH record on GenLayer Studio Next. No intermediary, no multi-day consensus wait, and no party-supplied source URL. The bond stays locked for a 10-minute challenge window. A challenger settles it in one transaction; if nobody does, anyone can expire it and refund the poster.
          </p>
</div>

<div className="hidden lg:flex flex-col items-end">
<div className="relative p-5 bg-surface-container-lowest rounded-DEFAULT shadow-md rotate-2 transition-transform hover:rotate-0">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[24px]">verified</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase">Official Feed Ingest</span>
<span className="font-headline-sm text-headline-sm text-primary">NIH v2 JSON Live</span>
</div>
</div>
<div className="mt-3 pt-3 flex items-center justify-between gap-6 font-label-sm text-label-sm text-outline">
<span>LATENCY: ~1.2s</span>
<span className="text-secondary font-semibold">CHAIN #61997</span>
</div>
</div>
</div>
</div>

<div className="mt-10 flex items-center justify-between bg-surface-container-high px-4 py-2.5 rounded-DEFAULT">
<div className="flex items-center gap-4 font-label-sm text-label-sm">
<span className="text-primary font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-secondary">menu_book</span>
            PROTOCOL MANUAL REF: 2025-TLN-09
          </span>
<span className="hidden sm:inline text-outline">·</span>
<span className="hidden sm:inline text-on-surface-variant">Deterministic NIH Ingestion Pipeline</span>
</div>
<div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span className="w-2 h-2 rounded-full bg-[#3d7a42]"></span>
<span>Zero Oracle Trust Dependency</span>
</div>
</div>
</section>

<section className="space-y-6">
<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
<div className="space-y-1">
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Step-by-Step Flow</span>
<h2 className="font-headline-lg text-headline-lg text-primary">The 4-Step Mechanism Walkthrough</h2>
</div>
<span className="font-label-sm text-label-sm text-outline">ATTESTATION WORKFLOW 01 THROUGH 04</span>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

<div className="flex flex-col justify-between p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm hover:shadow-md transition-all group">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-sm text-label-sm rounded-DEFAULT uppercase tracking-wider font-semibold">
                Phase 01
              </span>
<span className="font-headline-sm text-headline-sm text-outline font-normal italic">01/04</span>
</div>
<div className="space-y-2">
<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                Poster Locks Bond
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                Poster locks test GEN on exactly one NCT ID along with one official NIH status claim chip.
              </p>
</div>

<div className="p-3 bg-surface-container-low rounded-DEFAULT space-y-1.5 shadow-[inset_0_1px_2px_rgba(43,30,22,0.04)]">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-outline">TARGET:</span>
<span className="font-semibold text-primary">NCT04470427</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-outline">STAKE:</span>
<span className="text-secondary font-semibold">10.00 test GEN</span>
</div>
<div className="flex justify-between items-center font-label-sm text-label-sm pt-1">
<span className="text-outline">STATUS:</span>
<span className="px-1.5 py-0.2 bg-[#E8F0E4] text-[#2F5C3E] rounded-DEFAULT font-semibold text-[10px]">
                  RECRUITING
                </span>
</div>
</div>
</div>
<div className="mt-6 pt-4 flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
<span>Immutable locked escrow</span>
</div>
</div>

<div className="flex flex-col justify-between p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm hover:shadow-md transition-all group">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-sm text-label-sm rounded-DEFAULT uppercase tracking-wider font-semibold">
                Phase 02
              </span>
<span className="font-headline-sm text-headline-sm text-outline font-normal italic">02/04</span>
</div>
<div className="space-y-2">
<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                Public Escrow Sits Open
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                The row stays PENDING for 10 minutes. Anyone except the poster can call match() during that window. After it closes, match() reverts and anyone can call expire().
              </p>
</div>

<div className="p-3 bg-surface-container-low rounded-DEFAULT space-y-2 shadow-[inset_0_1px_2px_rgba(43,30,22,0.04)]">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-outline">STAMP WINDOW:</span>
<span className="font-label-sm text-label-sm text-[#3d7a42] font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-[#3d7a42] animate-ping"></span>
                  READY
                </span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full w-2/3"></div>
</div>
<span className="font-label-sm text-[9px] text-outline block text-right">Open for 10 minutes, then expire</span>
</div>
</div>
<div className="mt-6 pt-4 flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span className="material-symbols-outlined text-[16px] text-secondary">public</span>
<span>Open permissionless execution</span>
</div>
</div>

<div className="flex flex-col justify-between p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm hover:shadow-md transition-all group">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-sm text-label-sm rounded-DEFAULT uppercase tracking-wider font-semibold">
                Phase 03
              </span>
<span className="font-headline-sm text-headline-sm text-outline font-normal italic">03/04</span>
</div>
<div className="space-y-2">
<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                Deterministic NIH Fetch
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                GenLayer validators fetch official ClinicalTrials.gov JSON constructed deterministically by the smart contract.
              </p>
</div>

<div className="p-3 bg-surface-container-high rounded-DEFAULT font-label-sm text-[10px] space-y-1 text-on-surface">
<div className="text-outline">GET /api/v2/studies/</div>
<div className="text-secondary font-semibold">NCT04470427?fields=protocolSection</div>
<div className="text-outline-variant pt-1 text-[9px]">Header: User-Agent GenLayer-Node/1</div>
</div>
</div>
<div className="mt-6 pt-4 flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span className="material-symbols-outlined text-[16px] text-secondary">dns</span>
<span>Deterministic HTTP Consensus</span>
</div>
</div>

<div className="flex flex-col justify-between p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm hover:shadow-md transition-all group">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-sm text-label-sm rounded-DEFAULT uppercase tracking-wider font-semibold">
                Phase 04
              </span>
<span className="font-headline-sm text-headline-sm text-outline font-normal italic">04/04</span>
</div>
<div className="space-y-2">
<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                Atomic Settlement
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                A match() call during the 10-minute window evaluates MATCH, MISS, or THIN and moves the bond in that same transaction. After the window, match() reverts and expire() refunds the poster.
              </p>
</div>

<div className="p-3 bg-surface-container-low rounded-DEFAULT flex items-center justify-between shadow-[inset_0_1px_2px_rgba(43,30,22,0.04)]">
<div className="space-y-0.5">
<span className="font-label-sm text-[10px] text-outline uppercase">RESULT RECORDED</span>
<span className="font-label-sm text-label-sm text-primary font-semibold block">EXEC_ATOMIC</span>
</div>
<span className="material-symbols-outlined text-secondary text-[24px]">electric_bolt</span>
</div>
</div>
<div className="mt-6 pt-4 flex items-center gap-2 font-label-sm text-label-sm text-outline">
<span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
<span>Zero post-settlement recourse</span>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest p-6 sm:p-8 rounded-DEFAULT shadow-sm space-y-6">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Consensus Pipeline</span>
<h3 className="font-headline-md text-headline-md text-primary">In-Flight Verification Mechanics</h3>
</div>
<div className="font-label-sm text-label-sm text-outline">
          SINGLE-BLOCK ATTESTATION PIPELINE
        </div>
</div>

<div className="w-full bg-surface-container-low p-6 rounded-DEFAULT overflow-x-auto">
<svg className="w-full min-w-[700px] text-primary" fill="none" viewBox="0 0 960 220" xmlns="http://www.w3.org/2000/svg">

<line className="text-outline-variant" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" x1="140" x2="820" y1="110" y2="110"></line>

<g transform="translate(60, 60)">
<rect fill="#F1EEE5" height="100" rx="4" width="160"></rect>
<circle cx="80" cy="30" fill="#974818" r="14"></circle>
<path d="M76 30L79 33L84 27" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
<text fill="#110703" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" textAnchor="middle" x="80" y="60">Poster Genesis</text>
<text fill="#80756f" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="80" y="76">Escrows Bond + Claim</text>
</g>

<path d="M230 110 L250 110" markerEnd="url(#arrow)" stroke="#974818" strokeWidth="2"></path>

<g transform="translate(260, 60)">
<rect fill="#F1EEE5" height="100" rx="4" width="160"></rect>
<circle cx="80" cy="30" fill="#110703" r="14"></circle>
<circle cx="80" cy="30" fill="#fdf9f0" r="6"></circle>
<text fill="#110703" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" textAnchor="middle" x="80" y="60">Stamper Ping</text>
<text fill="#80756f" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="80" y="76">stamp() invoked</text>
</g>

<g transform="translate(460, 45)">
<rect fill="#ECE8DF" height="130" rx="4" width="190"></rect>
<rect fill="#2B1E16" height="26" rx="2" width="160" x="15" y="15"></rect>
<text fill="#FDF9F0" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="95" y="32">VALIDATORS CONSENSUS</text>
<text fill="#110703" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" textAnchor="middle" x="95" y="62">HTTP GET NIH API</text>
<text fill="#974818" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="95" y="78">clinicaltrials.gov</text>
<rect fill="#E6E2D9" height="20" rx="2" width="140" x="25" y="94"></rect>
<text fill="#4E4540" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="95" y="107">STATUS ENUM MATCH?</text>
</g>

<g transform="translate(680, 60)">
<rect fill="#F1EEE5" height="100" rx="4" width="180"></rect>
<circle cx="90" cy="30" fill="#3d7a42" r="14"></circle>
<path d="M86 30L89 33L94 27" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
<text fill="#110703" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" textAnchor="middle" x="90" y="60">Atomic Payout</text>
<text fill="#80756f" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="90" y="76">MATCH / MISS / THIN</text>
</g>
</svg>
</div>
</section>

<section className="space-y-6">
<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
<div className="space-y-1">
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Ledger Settlement Rules</span>
<h2 className="font-headline-lg text-headline-lg text-primary">Outcome Settlement Table</h2>
</div>
<span className="font-label-sm text-label-sm text-outline">STRICT FINITE STATE TRANSITIONS</span>
</div>

<div className="overflow-hidden bg-surface-container-lowest rounded-DEFAULT shadow-sm">
<div className="overflow-x-auto">
<table className="w-full text-left font-body-md text-body-md border-collapse">
<thead>
<tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase">
<th className="py-3 px-5">Outcome</th>
<th className="py-3 px-5">Evaluated Condition</th>
<th className="py-3 px-5">Financial Settlement &amp; Flow</th>
<th className="py-3 px-5 text-right">Poster Payout</th>
</tr>
</thead>
<tbody className="divide-none">

<tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td className="py-4 px-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF3E6] text-[#536233] font-label-sm text-label-sm rounded-DEFAULT font-semibold">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                    MATCH
                  </span>
</td>
<td className="py-4 px-5 text-on-surface">
                  Official NIH record status <span className="font-medium">strictly equals</span> the posted status claim chip upon API verification.
                </td>
<td className="py-4 px-5 text-on-surface-variant font-body-sm text-body-sm">
<span className="text-primary font-medium">97.5%</span> returns to poster. A fixed <span className="text-secondary font-medium">2.5%</span> protocol maintenance fee is routed to the verification treasury.
                </td>
<td className="py-4 px-5 text-right font-label-md text-label-md font-semibold text-primary">
                  97.5% Return
                </td>
</tr>

<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-4 px-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F9EAE1] text-[#A0381C] font-label-sm text-label-sm rounded-DEFAULT font-semibold">
<span className="material-symbols-outlined text-[14px]">cancel</span>
                    MISS
                  </span>
</td>
<td className="py-4 px-5 text-on-surface">
                  Official feed is valid and record exists, but the recorded NIH status is a <span className="font-medium">different NIH enum</span> than claimed.
                </td>
<td className="py-4 px-5 text-on-surface-variant font-body-sm text-body-sm">
                  Stamper proves the discrepancy and <span className="text-secondary font-medium font-semibold">receives the entire posted bond</span> in the atomic execution.
                </td>
<td className="py-4 px-5 text-right font-label-md text-label-md font-semibold text-error">
                  0.0% (Forfeited)
                </td>
</tr>

<tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td className="py-4 px-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDF5E2] text-[#966517] font-label-sm text-label-sm rounded-DEFAULT font-semibold">
<span className="material-symbols-outlined text-[14px]">help</span>
                    THIN
                  </span>
</td>
<td className="py-4 px-5 text-on-surface">
                  HTTP 404, server 5xx, oversized response, missing status key, or structurally malformed identifier.
                </td>
<td className="py-4 px-5 text-on-surface-variant font-body-sm text-body-sm">
<span className="text-primary font-medium">100% full refund</span> to poster. Protocol safety mechanism ensures test GEN is never irretrievably trapped.
                </td>
<td className="py-4 px-5 text-right font-label-md text-label-md font-semibold text-on-surface">
                  100% Refund
                </td>
</tr>

<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-4 px-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ECEAE5] text-[#5E564F] font-label-sm text-label-sm rounded-DEFAULT font-semibold">
<span className="material-symbols-outlined text-[14px]">block</span>
                    CANCELED
                  </span>
</td>
<td className="py-4 px-5 text-on-surface">
                  <span className="font-medium">cancel()</span> during the 10-minute challenge window, or after it.
                </td>
<td className="py-4 px-5 text-on-surface-variant font-body-sm text-body-sm">
                  Rejected. The call reverts and the bond stays locked. A poster cannot use cancellation to get ahead of a challenge. After 10 minutes, <span className="font-medium">expire()</span> refunds an unchallenged bond.
                </td>
<td className="py-4 px-5 text-right font-label-md text-label-md font-semibold text-on-surface">
                  No refund
                </td>
</tr>
</tbody>
</table>
</div>
</div>
</section>

<section className="space-y-6">
<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
<div className="space-y-1">
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Regulatory Invariants</span>
<h2 className="font-headline-lg text-headline-lg text-primary">Protocol Identity &amp; Constraints</h2>
</div>
<span className="font-label-sm text-label-sm text-outline">ARCHIVAL INTEGRITY CONSTRAINTS</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm flex gap-4">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[22px]">fingerprint</span>
</div>
<div className="space-y-2">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-primary">NCT Identifier Strictness</h3>
<span className="font-label-sm text-[10px] text-outline uppercase font-semibold">RegEx Match</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Every target identifier must be exactly the string <span className="font-label-sm font-semibold text-primary">NCT</span> followed by exactly <span className="font-label-sm font-semibold text-primary">8 digits</span> (e.g. <span className="text-secondary font-label-sm font-semibold">NCT04470427</span>). Arbitrary strings or malformed patterns are instantly rejected at invocation.
            </p>
</div>
</div>

<div className="p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm flex gap-4">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[22px]">label_important</span>
</div>
<div className="space-y-2">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-primary">Official NIH Enum Taxonomy</h3>
<span className="font-label-sm text-[10px] text-outline uppercase font-semibold">Strict Enum</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Status claims can only assume valid canonical NIH dictionary values: <span className="font-label-sm text-[10px] bg-surface-container px-1 py-0.5 rounded-DEFAULT text-primary">RECRUITING</span>, <span className="font-label-sm text-[10px] bg-surface-container px-1 py-0.5 rounded-DEFAULT text-primary">COMPLETED</span>, <span className="font-label-sm text-[10px] bg-surface-container px-1 py-0.5 rounded-DEFAULT text-primary">TERMINATED</span>, etc. Free text or editorial approximations cannot be submitted.
            </p>
</div>
</div>

<div className="p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm flex gap-4">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[22px]">link_off</span>
</div>
<div className="space-y-2">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-primary">Contract-Built Source Queries</h3>
<span className="font-label-sm text-[10px] text-outline uppercase font-semibold">Zero User URLs</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Evidence is collected exclusively by contract-generated deterministic API requests directly querying <span className="font-label-sm text-primary font-medium">clinicaltrials.gov</span>. Users and signers cannot submit custom endpoints, eliminating spoofing and mirror phishing vectors.
            </p>
</div>
</div>

<div className="p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm flex gap-4">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[22px]">balance</span>
</div>
<div className="space-y-2">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-primary">Bilateral Bilateralism</h3>
<span className="font-label-sm text-[10px] text-outline uppercase font-semibold">1:1 Escrow Model</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              One bond, one poster, one counterparty stamp. TrialLine operates completely free of liquidity pools, token weights, subjective voting juries, or multi-day challenge escalation bonds.
            </p>
</div>
</div>
</div>
</section>

<section className="p-8 bg-surface-container-high rounded-DEFAULT shadow-md relative overflow-hidden">

<div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-primary">
<span className="material-symbols-outlined text-[240px]">shield</span>
</div>
<div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
<div className="space-y-4 max-w-2xl">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#3d7a42]"></span>
<span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Network Genesis Configuration</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-primary">GenLayer Studio Next (Chain 61997)</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT space-y-1">
<span className="font-label-sm text-[10px] text-outline uppercase">RPC Interface</span>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-primary font-medium truncate pr-2">https://studio-next.genlayer.com/api</span>
<a className="text-secondary hover:text-primary" href="https://studio-next.genlayer.com/api" rel="noreferrer" target="_blank">
<span className="material-symbols-outlined text-[16px]">open_in_new</span>
</a>
</div>
</div>
<div className="p-3 bg-surface-container-lowest rounded-DEFAULT space-y-1">
<span className="font-label-sm text-[10px] text-outline uppercase">Block Explorer</span>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-primary font-medium truncate pr-2">explorer-studio-dev.genlayer.com</span>
<a className="text-secondary hover:text-primary" href="https://explorer-studio-dev.genlayer.com/" rel="noreferrer" target="_blank">
<span className="material-symbols-outlined text-[16px]">open_in_new</span>
</a>
</div>
</div>
</div>
</div>

<div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
<Link href="/post" className="w-full sm:w-auto">
<button className="w-full px-6 py-3.5 bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2" >
<span className="material-symbols-outlined text-[16px]">post_add</span>
<span>Enter App &amp; Post a Stamp</span>
</button>
</Link>
<Link href="/browse" className="w-full sm:w-auto">
<button className="w-full px-6 py-3.5 bg-surface-container-lowest text-secondary font-label-md text-label-md uppercase tracking-wider rounded-DEFAULT shadow-sm hover:bg-surface hover:text-primary transition-all flex items-center justify-center gap-2" >
<span className="material-symbols-outlined text-[16px]">travel_explore</span>
<span>Browse Active Stamps</span>
</button>
</Link>
</div>
</div>
</section>
</div>
</div></div>
    </>
  );
}
