"use client";
import { useState, useEffect } from "react";
import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

export default function Page() {
  const [econ, setEcon] = useState({
    treasury: "0",
    locked_in_open: "0",
    credits_outstanding: "0"
  });
  const [loading, setLoading] = useState(true);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661";

  useEffect(() => {
    async function fetchEconomics() {
      try {
        const client = createClient({
          chain: studioDevnet,
          endpoint: "https://studio-dev.genlayer.com/api"
        });
        
        const data = await client.readContract({
          address: contractAddress as `0x${string}`,
          functionName: "get_economics",
          args: []
        });
        
        if (data) {
          setEcon(JSON.parse(data as string));
        }
      } catch (err) {
        console.error("Failed to fetch economics:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEconomics();
  }, [contractAddress]);

  const formatGen = (weiString: string) => {
    return Number(weiString).toFixed(2);
  };

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md">
        <div className="flex flex-col w-full">
          <div className="relative w-full pb-space-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-md">
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface-container-highest text-secondary uppercase font-semibold">Contract Reader // State Inspector</span>
                  <span className="font-label-sm text-label-sm text-outline font-normal">Method: get_economics()</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">System Economics &amp; Escrow Ledger</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Live inspection of invariant token mechanics, deterministic settlement distributions, and protocol fee balances executed on GenLayer Studio Next (Chain 61997).
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-1.5 bg-surface-container-low p-space-md shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3d7a42] animate-ping"></span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold uppercase">Synchronized with Chain 61997</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="font-label-sm text-label-sm uppercase text-outline">Address:</span>
                  <span className="font-label-sm text-label-sm text-primary bg-surface-container-high px-1.5 py-0.5 truncate max-w-[200px]">{contractAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-outline">Loading protocol economics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
              <div className="relative bg-surface-container-low p-space-lg shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high/40 rounded-full translate-x-8 -translate-y-8 pointer-events-none"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">Protocol Treasury</span>
                    <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.2">OWNER BAL</span>
                  </div>
                  <div className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
                    {formatGen(econ.treasury)} <span className="font-label-md text-label-md text-secondary font-medium uppercase">test GEN</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm">Accrual Origin</span>
                    <span className="font-label-sm text-label-sm text-primary font-medium">2.5% MATCH fee</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-surface-container-low p-space-lg shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">Locked Escrow</span>
                    <span className="font-label-sm text-label-sm bg-surface-container text-on-surface px-1.5 py-0.2">ACTIVE</span>
                  </div>
                  <div className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
                    {formatGen(econ.locked_in_open)} <span className="font-label-md text-label-md text-secondary font-medium uppercase">test GEN</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm">Active Stakes</span>
                    <span className="font-label-sm text-label-sm text-primary font-medium">PENDING Stamps</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-surface-container-low p-space-lg shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">Credits Outstanding</span>
                    <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.2">WITHDRAWABLE</span>
                  </div>
                  <div className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
                    {formatGen(econ.credits_outstanding)} <span className="font-label-md text-label-md text-secondary font-medium uppercase">test GEN</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm">Withdrawal Lock</span>
                    <span className="font-label-sm text-label-sm text-outline">0 Block Delay</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-space-lg mb-space-xl">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest font-semibold">Mechanics // § 04</span>
                <h2 className="font-headline-md text-headline-md text-primary">Deterministic Settlement Allocations</h2>
              </div>
              <div className="font-label-sm text-label-sm text-outline">
                Zero Arbitrary Minting · Zero Rehypothecation · Pure Escrow Invariants
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md px-2 py-0.5 bg-[#EEF3E6] text-[#536233] font-semibold">[MATCH]</span>
                    <span className="font-label-sm text-label-sm text-outline">Status Exact</span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary">Consensus Confirms Record</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    When clinical registry JSON mirrors local state exactly, bond principal is unlocked. The protocol preserves solvency through a modest non-extractive fee.
                  </p>
                </div>
                <div className="mt-space-lg bg-surface-container-low p-space-sm space-y-2">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Original Poster:</span>
                    <span className="font-semibold text-primary">97.5% Principal</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "97.5%" }}></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-secondary font-medium">Protocol Treasury:</span>
                    <span className="font-semibold text-secondary">2.5% Fee</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md px-2 py-0.5 bg-[#F9EAE1] text-[#A0381C] font-semibold">[MISS]</span>
                    <span className="font-label-sm text-label-sm text-outline">Divergence Detected</span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary">Discrepancy Challenge Won</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    When verified NIH data contradicts submitted status parameters, 100% of the poster&apos;s bond is forfeited directly to the verification challenger.
                  </p>
                </div>
                <div className="mt-space-lg bg-surface-container-low p-space-sm space-y-2">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Executing Stamper:</span>
                    <span className="font-semibold text-secondary">100.0% Payout</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: "100%" }}></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-outline">Protocol Treasury:</span>
                    <span className="font-semibold text-outline">0.0% Fee</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md px-2 py-0.5 bg-[#FDF5E2] text-[#966517] font-semibold">[THIN]</span>
                    <span className="font-label-sm text-label-sm text-outline">Source Indeterminate</span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary">Unresolvable Feed Refund</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    If clinicaltrials.gov returns non-deterministic responses, rate limiting, or 404 payload errors, zero penalty is levied. Principal is refunded in full.
                  </p>
                </div>
                <div className="mt-space-lg bg-surface-container-low p-space-sm space-y-2">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Original Poster:</span>
                    <span className="font-semibold text-primary">100.0% Full Refund</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 overflow-hidden">
                    <div className="bg-outline h-full" style={{ width: "100%" }}></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-outline">Protocol Treasury:</span>
                    <span className="font-semibold text-outline">0.0% Fee</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md px-2 py-0.5 bg-[#ECEAE5] text-[#5E564F] font-semibold">[CANCELED]</span>
                    <span className="font-label-sm text-label-sm text-outline">Pre-execution Void</span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary">Voluntary Retraction</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    A coordinator may withdraw an attestation request before any validator or peer stamp commits. Full bond reclamation with zero gas drag beyond submission.
                  </p>
                </div>
                <div className="mt-space-lg bg-surface-container-low p-space-sm space-y-2">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Original Poster:</span>
                    <span className="font-semibold text-primary">100.0% Return</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 overflow-hidden">
                    <div className="bg-surface-tint h-full" style={{ width: "100%" }}></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-outline">Protocol Treasury:</span>
                    <span className="font-semibold text-outline">0.0% Fee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
