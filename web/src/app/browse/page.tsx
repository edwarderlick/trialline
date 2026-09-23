"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661";

interface StampRecord {
  id: string;
  poster: string;
  nct: string;
  expected_status: string;
  value: string;
  status: string;
  stamper: string;
  result_overall_status: string;
  result_reason: string;
}

export default function Page() {

  const [stamps, setStamps] = useState<StampRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enumFilter, setEnumFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let initialLoad = true;
    async function loadData() {
      try {
        if (initialLoad) {
          setIsLoading(true);
        }
        const client = createClient({
          chain: studioDevnet,
          endpoint: process.env.NEXT_PUBLIC_STUDIO_RPC || "https://studio-dev.genlayer.com/api"
        });

        const ids = await client.readContract({
          address: contractAddress as `0x${string}`,
          functionName: "list_ids",
          args: []
        });

        if (!Array.isArray(ids)) return;

        const stampsData = await Promise.all(
          ids.map(async (id) => {
            const raw = await client.readContract({
              address: contractAddress as `0x${string}`,
              functionName: "get_stamp",
              args: [id]
            });
            return JSON.parse(raw as string) as StampRecord;
          })
        );
        
        setStamps(stampsData);
      } catch (err) {
        console.error("Failed to load stamps", err);
      } finally {
        setIsLoading(false);
        initialLoad = false;
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredStamps = stamps.filter(s => {
    if (enumFilter !== "ALL" && s.expected_status !== enumFilter) return false;
    if (search && !s.nct.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md"><div className="flex flex-col w-full">

<section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-space-lg mb-space-lg">
<div className="space-y-2 max-w-2xl">
<div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Cryptographic Archive · Studio Next (61997)</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-normal">Browse Stamps</h1>
<p className="font-body-md text-body-md text-on-surface-variant">
        Official ClinicalTrials.gov status attestations on GenLayer Studio Next. Settle any OPEN row instantly through deterministic oracle queries.
      </p>
</div>

<div className="flex flex-wrap items-stretch gap-3 bg-surface-container-low p-2 rounded-lg shadow-sm">
<div className="flex flex-col justify-between px-4 py-2.5 bg-surface-container-lowest rounded-DEFAULT min-w-[140px] shadow-sm">
<span className="font-label-sm text-label-sm uppercase text-outline">Active Stamps</span>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-headline-md text-headline-md text-primary font-medium leading-none">{stamps.length}</span>
<span className="font-label-sm text-[10px] text-tertiary-container font-semibold">ON-LEDGER</span>
</div>
</div>
<div className="flex flex-col justify-between px-4 py-2.5 bg-surface-container-lowest rounded-DEFAULT min-w-[170px] shadow-sm">
<span className="font-label-sm text-label-sm uppercase text-outline">Escrow Liquidity</span>
<div className="flex items-baseline gap-1.5 mt-1">
<span className="font-headline-md text-headline-md text-secondary font-medium leading-none">{stamps.reduce((acc, s) => acc + Number(s.value), 0).toFixed(2)}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">test GEN</span>
</div>
</div>
<div className="flex flex-col justify-between px-4 py-2.5 bg-surface-container-lowest rounded-DEFAULT min-w-[160px] shadow-sm">
<span className="font-label-sm text-label-sm uppercase text-outline">Settlement Window</span>
<div className="flex items-center gap-1.5 mt-1">
<span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span className="font-label-md text-label-md text-primary font-semibold">100% Same-Session</span>
</div>
</div>
</div>
</section>



<section className="space-y-4">
<div className="bg-surface-container-low p-4 rounded-lg space-y-3 shadow-sm">

<div className="flex flex-wrap items-center justify-between gap-3">
<div className="flex flex-wrap items-center gap-1.5" id="state-tabs">
<button className="state-tab-btn active px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-primary-container text-on-primary font-semibold transition-all" >
            All <span className="ml-1 opacity-80">(14)</span>
</button>
<button className="state-tab-btn px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1.5" >
            Open <span className="px-1.5 py-0.2 rounded-DEFAULT bg-[#e8f0e4] text-[#2f5c3e] font-label-sm text-label-sm">5</span>
</button>
<button className="state-tab-btn px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface transition-all" >
            Match <span className="ml-1 opacity-80">(5)</span>
</button>
<button className="state-tab-btn px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface transition-all" >
            Miss <span className="ml-1 opacity-80">(2)</span>
</button>
<button className="state-tab-btn px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface transition-all" >
            Thin <span className="ml-1 opacity-80">(1)</span>
</button>
<button className="state-tab-btn px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container text-on-surface-variant hover:text-on-surface transition-all" >
            Canceled <span className="ml-1 opacity-80">(1)</span>
</button>
</div>

<button className="px-3 py-1.5 rounded-DEFAULT bg-surface-container text-outline hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" id="empty-state-toggle-btn" >
<span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
<span>Toggle Empty Filter View</span>
</button>
</div>

<div className="flex flex-col md:flex-row items-stretch gap-3 pt-2">
<div className="relative flex-grow">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
<input className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-DEFAULT text-on-surface font-label-md text-label-md placeholder:text-outline focus:outline-none focus:bg-surface-bright transition-all shadow-inner" id="stamp-search-input" placeholder="Filter by NCT ID (e.g. NCT04470427) or Hash ID..." type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
</div>
<div className="flex items-center gap-2 shrink-0">
<label className="font-label-sm text-label-sm uppercase text-outline whitespace-nowrap" htmlFor="enum-filter">NIH Enum:</label>
<select className="bg-surface-container-lowest text-on-surface px-3 py-2.5 rounded-DEFAULT font-label-md text-label-md focus:outline-none cursor-pointer shadow-sm" id="enum-filter" value={enumFilter} onChange={(e) => setEnumFilter(e.target.value)}>
<option value="ALL">All NIH Enums</option>
<option value="RECRUITING">Recruiting</option>
<option value="COMPLETED">Completed</option>
<option value="ACTIVE_NOT_RECRUITING">Active, Not Recruiting</option>
<option value="TERMINATED">Terminated</option>
<option value="WITHDRAWN">Withdrawn</option>
<option value="ENROLLING_BY_INVITATION">Enrolling by Invitation</option>
</select>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm" id="stamps-table-container">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
<th className="py-3 px-4 font-semibold">NCT Identifier</th>
<th className="py-3 px-4 font-semibold">Hash ID</th>
<th className="py-3 px-4 font-semibold">Claimed Status</th>
<th className="py-3 px-4 font-semibold">Attestation State</th>
<th className="py-3 px-4 font-semibold text-right">Escrow Bond</th>
<th className="py-3 px-4 font-semibold text-right">Resolution / Action</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-sm text-body-sm" id="stamps-tbody">
{isLoading ? (
  <tr>
    <td colSpan={6} className="py-8 text-center text-on-surface-variant font-label-md">
      <span className="material-symbols-outlined animate-spin text-[24px] mb-2">progress_activity</span>
      <p>Syncing deterministic cache...</p>
    </td>
  </tr>
) : filteredStamps.length === 0 ? (
  <tr>
    <td colSpan={6} className="py-8 text-center text-on-surface-variant font-label-md">
      No attestations found.
    </td>
  </tr>
) : (
  filteredStamps.map(stamp => {
    let stateColorClass = "bg-[#e8f0e4] text-[#2f5c3e]";
    let stateLabel = "[OPEN]";
    if (stamp.status === "MATCH") {
      stateColorClass = "bg-[#eef3e6] text-[#536233]";
      stateLabel = "[MATCH]";
    } else if (stamp.status === "MISS") {
      stateColorClass = "bg-[#f9eae1] text-[#a0381c]";
      stateLabel = "[MISS]";
    } else if (stamp.status === "THIN") {
      stateColorClass = "bg-[#fdf5e2] text-[#966517]";
      stateLabel = "[THIN]";
    }

    return (
      <tr key={stamp.id} className="stamp-row bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
        <td className="py-3.5 px-4 font-label-md text-label-md text-primary font-semibold">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${stamp.status === "OPEN" || stamp.status === "PENDING" ? "bg-secondary" : "bg-outline"}`}></span>
            <span>{stamp.nct}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 font-label-sm text-label-sm text-outline font-medium">{stamp.id.substring(0,6)}...{stamp.id.substring(stamp.id.length-4)}</td>
        <td className="py-3.5 px-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT bg-surface-container font-label-sm text-label-sm text-primary font-medium">
            {stamp.expected_status}
          </span>
        </td>
        <td className="py-3.5 px-4">
          <span className={`px-2 py-0.5 rounded-DEFAULT ${stateColorClass} font-label-sm text-label-sm font-semibold tracking-wider`}>{stateLabel}</span>
        </td>
        <td className="py-3.5 px-4 text-right font-label-md text-label-md text-secondary font-semibold">
          {Number(stamp.value).toFixed(2)} <span className="text-on-surface-variant font-normal text-[10px]">GEN</span>
        </td>
        <td className="py-3.5 px-4 text-right">
          <Link href={`/stamp/${stamp.id}`}>
            <button className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-wider transition-all shadow-sm">
              {stamp.status === "PENDING" ? "Stamp Now" : "View"}
            </button>
          </Link>
        </td>
      </tr>
    );
  })
)}
</tbody>
</table>
</div>

<div className="hidden flex-col items-center justify-center py-16 px-6 text-center bg-surface-container-low/40" id="empty-state-view">
<div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-3 shadow-inner">
<span className="material-symbols-outlined text-[28px] text-outline">search_off</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-primary font-medium mb-1" id="empty-state-headline">No matching attestations found</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6" id="empty-state-desc">
          No stamps found with state: <span className="font-label-md font-semibold text-primary">THIN</span>. All NIH oracle feeds verified cleanly.
        </p>
<button className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container-high text-primary rounded-DEFAULT font-label-md text-label-md uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer" >
<span className="material-symbols-outlined text-[16px]">restart_alt</span>
<span>Reset All Filters</span>
</button>
</div>

<div className="bg-surface-container px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant font-label-sm text-label-sm">
<div className="flex items-center gap-2">
<span>Showing <span className="font-semibold text-primary" id="visible-rows-count">{filteredStamps.length}</span> of {stamps.length} Attestations</span>
<span>·</span>
<span>Sync interval: 3s</span>
</div>
<div className="flex items-center gap-4 text-outline">
<span className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-[#3d7a42]"></span> Direct Node Gateway
          </span>
<span>Block: 1,489,203</span>
</div>
</div>
</div>
</section>

<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm hidden" id="settle-dialog">
<div className="bg-surface-container-lowest rounded-lg max-w-lg w-full p-6 lg:p-8 shadow-2xl relative">
<div className="flex items-center justify-between pb-3 mb-4 bg-surface-container-low -mx-6 -mt-6 p-6 rounded-t-lg">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">gavel</span>
<span className="font-headline-sm text-headline-sm text-primary font-medium">Execute Stamp Settlement</span>
</div>
<button className="text-outline hover:text-primary transition-colors" >
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="space-y-4">
<div className="p-4 bg-surface-container-low rounded-DEFAULT space-y-2">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-outline">Target Protocol ID:</span>
<span className="font-semibold text-primary" id="modal-nct-id">NCT04470427</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-outline">Bond in Escrow:</span>
<span className="font-semibold text-secondary" id="modal-bond">5.00 test GEN</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-outline">Consensus Execution Gas:</span>
<span className="font-semibold text-primary">~0.0625 test GEN</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Triggering this attestation initiates an immediate GenLayer contract query to the NIH ClinicalTrials.gov API endpoint. If the current status differs from poster&apos;s claim, escrow bond transfers directly to your address.
        </p>
<div className="p-3 bg-surface-container rounded-DEFAULT hidden" id="simulation-status">
<div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
<span>Querying deterministic endpoint...</span>
</div>
</div>
<div className="flex items-center justify-end gap-3 pt-2">
<button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-DEFAULT font-label-md text-label-md uppercase tracking-wider" >
            Cancel
          </button>
<button className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-DEFAULT font-label-md text-label-md uppercase tracking-wider shadow-md" id="confirm-stamp-btn" >
            Confirm &amp; Attest
          </button>
</div>
</div>
</div>
</div>
</div>
</div>
    </>
  );
}
