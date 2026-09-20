import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md"><div className="flex flex-col w-full">

<div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-lg mb-space-md">
<div className="flex items-center gap-4">
<div className="bg-surface-container-low p-2 rounded-DEFAULT shadow-sm flex items-center">
<img alt="TrialLine Archival Clinical Protocol Mark" className="h-9 w-auto object-contain" src="/logo.svg"/>
</div>
<div className="h-6 w-px bg-outline-variant hidden sm:block"></div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-highest rounded-DEFAULT font-label-sm text-label-sm text-on-surface">
<span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"></span>
<span>GenLayer Studio Next</span>
<span className="text-outline">(Chain 61997)</span>
</span>
<span className="hidden lg:inline-flex px-2 py-0.5 bg-surface-container font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">NIH Feed JSON v2.0</span>
</div>
</div>
<div className="flex items-center gap-3">
<Link className="px-3.5 py-2 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" href="/how">
<span>How TrialLine Works</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</Link>
<Link className="px-4 py-2 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold rounded-DEFAULT hover:bg-primary shadow-sm transition-all flex items-center gap-2" href="/post">
<span className="material-symbols-outlined text-[16px]">verified</span>
<span>Enter App &amp; Post a Stamp</span>
</Link>
</div>
</div>

<div className="w-full bg-surface-container-low rounded-DEFAULT p-3 mb-space-xl shadow-sm">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
<div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold shrink-0">
<span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
<span>Example Fixtures</span>
<span className="text-outline font-normal text-[10px]">· Not Live Data</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-grow lg:max-w-4xl">

<div className="bg-surface-container-lowest p-2.5 rounded-DEFAULT flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(43,30,22,0.03)]">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-semibold text-primary">NCT04470427</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">mRNA-1273 Phase III</span>
</div>
<div className="flex items-center gap-1.5 text-right">
<span className="font-label-sm text-[10px] text-outline">COMPLETED</span>
<span className="px-2 py-0.5 rounded-DEFAULT font-label-sm text-[10px] font-bold bg-[#eef3e6] text-[#536233] border-0">MATCH</span>
</div>
</div>

<div className="bg-surface-container-lowest p-2.5 rounded-DEFAULT flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(43,30,22,0.03)]">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-semibold text-primary">NCT04000308</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Lecanemab AD Extension</span>
</div>
<div className="flex items-center gap-1.5 text-right">
<span className="font-label-sm text-[10px] text-outline">RECRUITING</span>
<span className="px-2 py-0.5 rounded-DEFAULT font-label-sm text-[10px] font-bold bg-[#e8f0e4] text-[#2f5c3e] border-0">OPEN</span>
</div>
</div>

<div className="bg-surface-container-lowest p-2.5 rounded-DEFAULT flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(43,30,22,0.03)]">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-semibold text-primary">NCT04829396</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">CAR-T Solid Tumors</span>
</div>
<div className="flex items-center gap-1.5 text-right">
<span className="font-label-sm text-[10px] text-outline">TERMINATED</span>
<span className="px-2 py-0.5 rounded-DEFAULT font-label-sm text-[10px] font-bold bg-[#f9eae1] text-[#a0381c] border-0">MISS</span>
</div>
</div>
</div>
</div>
</div>

<section className="w-full relative mb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

<div className="lg:col-span-7 flex flex-col space-y-6 pt-2">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-widest text-secondary w-fit">
<span className="material-symbols-outlined text-[14px]">local_pharmacy</span>
<span>Zero-Dispute Clinical Attestation</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-normal leading-[1.08]">
          Put money on what the NIH <span className="italic text-secondary">currently says</span> about any clinical trial.
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
          TrialLine is an immutable, same-session official-record stamp on GenLayer Studio Next. A poster locks test GEN on an NCT Identifier paired with an official regulatory status chip.
        </p>

<div className="bg-surface-container-low p-5 rounded-DEFAULT space-y-3.5 shadow-sm">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">check_circle</span>
<div className="font-body-md text-body-md text-on-surface">
<strong className="font-semibold text-primary">Deterministic API Ingestion:</strong> Anyone calls <code className="font-label-sm text-secondary bg-surface-container px-1 py-0.5 rounded-DEFAULT">Stamp()</code>. Validators fetch clinicaltrials.gov JSON directly using the NCT number.
            </div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">bolt</span>
<div className="font-body-md text-body-md text-on-surface">
<strong className="font-semibold text-primary">Instant Single-Session Settlement:</strong> Resolves to <span className="font-label-sm font-semibold text-[#536233] bg-[#eef3e6] px-1 py-0.5 rounded-DEFAULT">MATCH</span>, <span className="font-label-sm font-semibold text-[#a0381c] bg-[#f9eae1] px-1 py-0.5 rounded-DEFAULT">MISS</span>, or <span className="font-label-sm font-semibold text-[#966517] bg-[#fdf5e2] px-1 py-0.5 rounded-DEFAULT">THIN</span> in the exact same transaction block.
            </div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">cancel_presentation</span>
<div className="font-body-md text-body-md text-on-surface">
<strong className="font-semibold text-primary">Zero Editorial Discretion:</strong> No subjective intermediary, no 7-day multi-sig delay, no party-supplied URLs, and no delayed UTC maturity dates.
            </div>
</div>
</div>

<div className="flex flex-wrap items-center gap-4 pt-2">
<Link className="px-6 py-3.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold rounded-DEFAULT hover:bg-primary-container shadow-md transition-all flex items-center gap-2.5" href="/how">
<span className="material-symbols-outlined text-[18px]">verified_user</span>
<span>Post a Protocol Stamp</span>
</Link>
<Link className="px-5 py-3.5 bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold rounded-DEFAULT hover:bg-surface-container-highest transition-colors flex items-center gap-2" href="/how">
<span className="material-symbols-outlined text-[16px]">find_in_page</span>
<span>Browse Active Records</span>
</Link>
</div>
</div>

<div className="lg:col-span-5 relative mt-4 lg:mt-0">

<div className="flex items-end justify-between px-4">
<div className="bg-secondary px-4 py-1.5 rounded-t-DEFAULT shadow-sm flex items-center gap-2">
<span className="material-symbols-outlined text-on-secondary text-[14px]">folder_open</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-secondary font-semibold">Record File // #8294</span>
</div>
<span className="font-label-sm text-[10px] uppercase tracking-widest text-outline">EXAMPLE FIXTURE</span>
</div>

<div className="bg-surface-container-lowest p-6 rounded-DEFAULT rounded-tl-none shadow-xl relative overflow-hidden">

<div className="absolute right-4 top-4 transform rotate-12 pointer-events-none opacity-85">
<div className="w-28 h-28 rounded-full bg-surface-container-low p-1 flex items-center justify-center shadow-sm">
<div className="w-full h-full rounded-full bg-surface-container-lowest flex flex-col items-center justify-center text-center p-1">
<span className="material-symbols-outlined text-[26px] text-secondary">verified</span>
<span className="font-label-sm text-[7px] uppercase tracking-tighter text-primary font-bold mt-0.5">GENLAYER NEXT</span>
<span className="font-label-sm text-[6px] uppercase tracking-widest text-secondary font-semibold">ATTESTED</span>
</div>
</div>
</div>

<div className="flex items-baseline justify-between pb-3 mb-4 bg-surface-container-low p-3 rounded-DEFAULT">
<div>
<span className="font-label-sm text-[10px] uppercase text-outline tracking-wider">Clinical Registry ID</span>
<div className="font-headline-md text-headline-md text-primary italic font-normal">NCT 04470427</div>
</div>
<div className="text-right">
<span className="font-label-sm text-[10px] uppercase text-outline tracking-wider">State Outcome</span>
<div className="font-label-lg text-label-lg font-bold text-[#536233] bg-[#eef3e6] px-2 py-0.5 rounded-DEFAULT inline-block mt-0.5">[MATCH]</div>
</div>
</div>

<div className="space-y-3 font-body-sm text-body-sm">
<div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex items-center justify-between">
<span className="text-on-surface-variant font-label-sm text-[11px] uppercase">Official NIH Target:</span>
<span className="font-label-sm text-label-sm text-primary font-semibold">COMPLETED</span>
</div>
<div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex items-center justify-between">
<span className="text-on-surface-variant font-label-sm text-[11px] uppercase">Poster Bond:</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold">50.00 test GEN</span>
</div>
<div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex items-center justify-between">
<span className="text-on-surface-variant font-label-sm text-[11px] uppercase">Stamper Match Bounty:</span>
<span className="font-label-sm text-label-sm text-primary font-semibold">5.00 test GEN</span>
</div>
<div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex items-center justify-between">
<span className="text-on-surface-variant font-label-sm text-[11px] uppercase">JSON Feed Source:</span>
<span className="font-label-sm text-[10px] text-outline font-mono truncate max-w-[190px]">clinicaltrials.gov/api/v2/studies/...</span>
</div>
<div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex items-center justify-between">
<span className="text-on-surface-variant font-label-sm text-[11px] uppercase">Block Transaction:</span>
<span className="font-label-sm text-[10px] text-primary font-mono">0x49f8...c81a</span>
</div>
</div>

<div className="mt-5 p-3.5 bg-secondary-fixed text-on-secondary-fixed rounded-DEFAULT shadow-sm flex items-start gap-2.5 transform -rotate-1">
<span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">sticky_note_2</span>
<div className="text-[12px] font-body-sm leading-snug">
<strong className="font-semibold">Execution rule:</strong> When clinicaltrials.gov status string exactly mirrors the poster's commitment, bond unlocks instantly to the counterparty or claimer.
            </div>
</div>
</div>

<div className="absolute -bottom-3 -right-3 w-11/12 h-20 bg-surface-container -z-10 rounded-DEFAULT"></div>
</div>
</div>
</section>

<section className="w-full mb-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-2">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Structural Guarantees</span>
<h2 className="font-headline-lg text-headline-lg text-primary font-normal mt-1">Built to eliminate the friction of subjective oracles.</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
        Traditional prediction models depend on human jurors and delayed windows. TrialLine converts the authoritative government registry into an instantaneous, deterministic state machine.
      </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

<div className="bg-surface-container-low p-6 rounded-DEFAULT shadow-sm flex flex-col justify-between space-y-6">
<div className="space-y-3">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container-highest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[22px]">hub</span>
</div>
<div className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Source Purity</div>
<h3 className="font-headline-sm text-headline-sm text-primary font-medium">Deterministic NIH Feed</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            The smart contract dynamically constructs the query URL directly to <code className="text-primary font-label-sm">clinicaltrials.gov/api/v2</code> using only the verifiable NCT ID. Users cannot supply arbitrated or compromised web endpoints.
          </p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-DEFAULT font-label-sm text-[11px] text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[16px]">check</span>
<span>Zero custom URL manipulation</span>
</div>
</div>

<div className="bg-surface-container-low p-6 rounded-DEFAULT shadow-sm flex flex-col justify-between space-y-6">
<div className="space-y-3">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container-highest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[22px]">flash_on</span>
</div>
<div className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Execution Speed</div>
<h3 className="font-headline-sm text-headline-sm text-primary font-medium">Single-Session Settlement</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Evaluates completely in the exact transaction block where <code className="text-primary font-label-sm">stamp()</code> is triggered. No 24-hour waiting windows, no challenge countdown timers, and zero post-session litigation.
          </p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-DEFAULT font-label-sm text-[11px] text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[16px]">timer_off</span>
<span>Resolves within 1 confirmation block</span>
</div>
</div>

<div className="bg-surface-container-low p-6 rounded-DEFAULT shadow-sm flex flex-col justify-between space-y-6">
<div className="space-y-3">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container-highest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[22px]">rule</span>
</div>
<div className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Integrity Shield</div>
<h3 className="font-headline-sm text-headline-sm text-primary font-medium">Finite Five-State Machine</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Only five definitive outcomes can exist: <code className="font-label-sm text-primary">OPEN</code>, <code className="font-label-sm text-[#536233]">MATCH</code>, <code className="font-label-sm text-[#a0381c]">MISS</code>, <code className="font-label-sm text-[#966517]">THIN</code>, or <code className="font-label-sm text-outline">CANCELED</code>. If an API payload is malformed or unindexed, THIN guarantees 100% refund protection.
          </p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-DEFAULT font-label-sm text-[11px] text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
<span>Zero loss to invalid registry feeds</span>
</div>
</div>
</div>
</section>

<section className="w-full bg-surface-container-low p-space-lg rounded-DEFAULT shadow-sm mb-space-xl">
<div className="max-w-2xl mb-space-lg">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Deterministic Workflow</span>
<h2 className="font-headline-lg text-headline-lg text-primary font-normal mt-1">From Clinical Identifier to On-Chain Finality</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">
        See how simple and programmatic protocol attestations run from creation to instant capital disbursement.
      </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">

<div className="bg-surface-container-lowest p-4 rounded-DEFAULT shadow-sm space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-bold">STEP 01</span>
<span className="font-label-sm text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded-DEFAULT text-on-surface-variant">INIT</span>
</div>
<h4 className="font-headline-sm text-[18px] leading-snug text-primary font-medium">Poster Locks Escrow Bond</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Creator inputs an NCT ID (e.g. NCT04470427) and locks test GEN with an attested target status (e.g., RECRUITING).
        </p>
</div>

<div className="bg-surface-container-lowest p-4 rounded-DEFAULT shadow-sm space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-bold">STEP 02</span>
<span className="font-label-sm text-[10px] bg-[#e8f0e4] text-[#2f5c3e] px-1.5 py-0.5 rounded-DEFAULT font-semibold">OPEN</span>
</div>
<h4 className="font-headline-sm text-[18px] leading-snug text-primary font-medium">Position Sits Open</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          The stamp sits openly in the public mempool. Any analyst, monitor, or counterparty can inspect the parameters.
        </p>
</div>

<div className="bg-surface-container-lowest p-4 rounded-DEFAULT shadow-sm space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-bold">STEP 03</span>
<span className="font-label-sm text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded-DEFAULT text-on-surface-variant">FETCH</span>
</div>
<h4 className="font-headline-sm text-[18px] leading-snug text-primary font-medium">Stamper Calls Verification</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Stamper triggers the transaction. GenLayer validators deterministically query the official NIH ClinicalTrials JSON API.
        </p>
</div>

<div className="bg-surface-container-lowest p-4 rounded-DEFAULT shadow-sm space-y-3">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-bold">STEP 04</span>
<span className="font-label-sm text-[10px] bg-[#eef3e6] text-[#536233] px-1.5 py-0.5 rounded-DEFAULT font-semibold">FINAL</span>
</div>
<h4 className="font-headline-sm text-[18px] leading-snug text-primary font-medium">Instant Block Settlement</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          JSON string match yields MATCH payout. Mismatch triggers MISS forfeit. Corrupted responses result in a 100% THIN refund.
        </p>
</div>
</div>

<div className="mt-6 bg-surface-container-highest p-4 rounded-DEFAULT overflow-x-auto shadow-inner">
<div className="flex items-center justify-between pb-2 mb-2 bg-surface-container-high px-3 py-1.5 rounded-DEFAULT font-label-sm text-[11px] text-on-surface-variant">
<span>Deterministic Validator Execution Trace</span>
<span className="text-secondary font-mono">protocol.genlayer.attest()</span>
</div>
<pre className="font-label-sm text-label-sm text-primary leading-relaxed whitespace-pre-wrap"><code><span className="text-secondary">GET</span> https://clinicaltrials.gov/api/v2/studies/NCT04470427
<span className="text-outline">RESPONSE_STATUS:</span> 200 OK
<span className="text-outline">PAYLOAD:</span> {"{"} "protocolSection": {"{"} "statusModule": {"{"} "overallStatus": <span className="text-secondary font-bold">"COMPLETED"</span> {"}"} {"}"} {"}"}
<span className="text-outline">ASSERTION:</span> committed_status == "COMPLETED" -&gt; <span className="text-[#536233] font-bold">TRUE [MATCH DISBURSED]</span></code></pre>
</div>
</section>

<section className="w-full mb-space-xl">
<div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-4">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Network Vital Signs</span>
<h2 className="font-headline-md text-headline-md text-primary font-normal mt-0.5">Protocol Liquidity &amp; Consensus Volume</h2>
</div>
<Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-1 mt-2 sm:mt-0 font-semibold uppercase" href="/how">
<span>Detailed Economics</span>
<span className="material-symbols-outlined text-[14px]">open_in_new</span>
</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<div className="bg-surface-container-low p-5 rounded-DEFAULT shadow-sm">
<span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">Total Protocol Escrow</span>
<div className="font-headline-lg text-headline-lg text-primary font-normal mt-1">142,850 <span className="font-label-md text-label-md text-secondary">test GEN</span></div>
<div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-secondary text-[14px]">trending_up</span>
<span>+18.4% this session</span>
</div>
</div>

<div className="bg-surface-container-low p-5 rounded-DEFAULT shadow-sm">
<span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">Completed Attestations</span>
<div className="font-headline-lg text-headline-lg text-primary font-normal mt-1">1,489 <span className="font-label-md text-label-md text-outline">STAMPS</span></div>
<div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[#536233] text-[14px]">verified</span>
<span>100% same-session settled</span>
</div>
</div>

<div className="bg-surface-container-low p-5 rounded-DEFAULT shadow-sm">
<span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">Deterministic Match Rate</span>
<div className="font-headline-lg text-headline-lg text-primary font-normal mt-1">87.4% <span className="font-label-md text-label-md text-[#536233]">ACCURACY</span></div>
<div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
<span>0 disputed or contested flags</span>
</div>
</div>

<div className="bg-surface-container-low p-5 rounded-DEFAULT shadow-sm">
<span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">Average Settlement Latency</span>
<div className="font-headline-lg text-headline-lg text-primary font-normal mt-1">1.8 <span className="font-label-md text-label-md text-secondary">SECONDS</span></div>
<div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-secondary text-[14px]">bolt</span>
<span>Single write block finality</span>
</div>
</div>
</div>
</section>

<section className="w-full bg-surface-container-low p-space-lg rounded-DEFAULT shadow-sm mb-space-xl">
<div className="max-w-2xl mb-space-md">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Contrast Analysis</span>
<h2 className="font-headline-lg text-headline-lg text-primary font-normal mt-1">TrialLine vs Traditional Prediction Oracles</h2>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="bg-surface-container-high font-label-sm text-[11px] uppercase tracking-wider text-on-surface">
<th className="py-3 px-4 rounded-l-DEFAULT">Attestation Dimension</th>
<th className="py-3 px-4 text-secondary font-bold">TrialLine Protocol (GenLayer)</th>
<th className="py-3 px-4 text-on-surface-variant rounded-r-DEFAULT">Legacy Prediction Markets</th>
</tr>
</thead>
<tbody className="space-y-1">
<tr className="bg-surface-container-lowest">
<td className="py-3 px-4 font-semibold text-primary">Data Ingestion</td>
<td className="py-3 px-4 text-secondary font-medium">Direct NIH JSON API (Zero user links)</td>
<td className="py-3 px-4 text-on-surface-variant">User-submitted links &amp; web articles</td>
</tr>
<tr className="bg-surface-container-low">
<td className="py-3 px-4 font-semibold text-primary">Settlement Window</td>
<td className="py-3 px-4 text-secondary font-medium">Immediate: exact block evaluation</td>
<td className="py-3 px-4 text-on-surface-variant">3 to 14 business days</td>
</tr>
<tr className="bg-surface-container-lowest">
<td className="py-3 px-4 font-semibold text-primary">Resolution Engine</td>
<td className="py-3 px-4 text-secondary font-medium">Deterministic string comparison</td>
<td className="py-3 px-4 text-on-surface-variant">Subjective tokenholder voting / jury</td>
</tr>
<tr className="bg-surface-container-low">
<td className="py-3 px-4 font-semibold text-primary">Invalid API Handling</td>
<td className="py-3 px-4 text-secondary font-medium">Strict THIN refund (100% capital returned)</td>
<td className="py-3 px-4 text-on-surface-variant">Unresolved escrow lock or gas forfeit</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="w-full bg-primary-container text-on-primary p-space-xl rounded-DEFAULT shadow-xl relative overflow-hidden">

<div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[240px]">history_edu</span>
</div>
<div className="relative z-10 max-w-3xl space-y-4">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest/10 rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Studio Next Environment Active</span>
</div>
<h2 className="font-headline-xl text-headline-xl text-surface-bright font-normal leading-tight">
        Ready to attest official clinical records without subjective debate?
      </h2>
<p className="font-body-lg text-body-lg text-primary-fixed-dim leading-relaxed">
        Connect your wallet on Chain 61997, inspect current registered trial listings, or lock a new escrow bond on any active National Institutes of Health record.
      </p>
<div className="flex flex-wrap items-center gap-4 pt-4">
<Link className="px-6 py-3.5 bg-secondary text-on-secondary font-label-md text-label-md uppercase tracking-wider font-semibold rounded-DEFAULT hover:bg-secondary-container hover:text-on-secondary-container shadow-md transition-all flex items-center gap-2" href="/how">
<span className="material-symbols-outlined text-[18px]">launch</span>
<span>Launch Verification App</span>
</Link>
<Link className="px-6 py-3.5 bg-surface-container-lowest/10 text-surface-bright font-label-md text-label-md uppercase tracking-wider font-semibold rounded-DEFAULT hover:bg-surface-container-lowest/20 transition-all flex items-center gap-2" href="/how">
<span className="material-symbols-outlined text-[18px]">menu_book</span>
<span>Protocol Architecture Docs</span>
</Link>
</div>
</div>
</section>
</div></div>
    </>
  );
}
