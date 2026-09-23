"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGenLayer } from "../../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";
import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

export default function Page() {
  const { id } = useParams();
  const [isStamping, setIsStamping] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const { kit, address } = useGenLayer();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xD84133C446fa5872e3Fb9Ded0B3c1061D302B661";

  interface Stamp {
    id: string;
    nct: string;
    expected_status: string;
    poster: string;
    stamper: string;
    bond: string;
    value: string;
    status: string;
    result_overall_status: string;
    result_reason: string;
    posted_at_unix: string;
    expires_at_unix: string;
  }

  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStamp() {
      try {
        const client = createClient({
          chain: studioDevnet,
          endpoint: "https://studio-dev.genlayer.com/api"
        });
        
        const data = await client.readContract({
          address: contractAddress as `0x${string}`,
          functionName: "get_stamp",
          args: [id as string]
        });
        
        if (data && data !== "{}") {
          setStamp(JSON.parse(data as string));
        }
      } catch (err) {
        console.error("Failed to fetch stamp:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchStamp();
    }
  }, [id, contractAddress]);

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-outline">Loading registry record...</div>;
  }

  if (!stamp) {
    return (
      <div className="max-w-[1320px] mx-auto px-margin py-space-md text-center">
        <h1 className="font-headline-lg text-primary">Record Not Found</h1>
        <p className="text-on-surface-variant mt-2">The requested stamp ID does not exist on the ledger.</p>
        <Link href="/browse" className="mt-4 inline-block text-secondary hover:underline">Return to Browse</Link>
      </div>
    );
  }

  const bondWei = BigInt(stamp.value || "0");
  const oneGen = BigInt("1000000000000000000");
  const bondWhole = bondWei / oneGen;
  const bondFrac = (bondWei % oneGen) / (oneGen / BigInt(100));
  const bondValue = `${bondWhole}.${bondFrac.toString().padStart(2, "0")}`;
  const expiresMs = Number(stamp.expires_at_unix || "0") * 1000;
  const windowOpen = nowMs === null || !expiresMs || nowMs < expiresMs;
  const isPoster = address?.toLowerCase() === stamp.poster.toLowerCase();
  const expiresLabel = expiresMs
    ? new Date(expiresMs).toISOString().replace(".000Z", "Z")
    : "Unknown";

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md">
        <div className="flex flex-col w-full">
          
          {/* Header Row */}
          <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-space-md mb-space-md border-b border-surface-variant">
            <div className="flex items-center gap-2">
              <Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-1" href="/browse">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>REGISTRY LEDGER</span>
              </Link>
              <span className="text-outline text-label-sm">/</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">RECORD: {stamp.nct}</span>
              <span className="bg-surface-container px-2 py-0.5 rounded-DEFAULT font-label-sm text-[10px] text-outline uppercase">Chain 61997</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-DEFAULT">
              <span className="font-label-sm text-[10px] uppercase text-outline px-2 tracking-widest hidden sm:inline">Inspect State:</span>
              <div className={`px-2.5 py-1 text-label-sm font-label-sm rounded-DEFAULT transition-all ${stamp.status === 'PENDING' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}`}>
                [OPEN]
              </div>
              <div className={`px-2.5 py-1 text-label-sm font-label-sm rounded-DEFAULT transition-all ${stamp.status === 'MATCH' ? 'bg-[#EEF3E6] text-[#536233] shadow-sm font-semibold' : 'text-on-surface-variant'}`}>
                [MATCH]
              </div>
              <div className={`px-2.5 py-1 text-label-sm font-label-sm rounded-DEFAULT transition-all ${stamp.status === 'MISS' ? 'bg-[#F9EAE1] text-[#A0381C] shadow-sm font-semibold' : 'text-on-surface-variant'}`}>
                [MISS]
              </div>
              <div className={`px-2.5 py-1 text-label-sm font-label-sm rounded-DEFAULT transition-all ${stamp.status === 'THIN' ? 'bg-[#FDF5E2] text-[#966517] shadow-sm font-semibold' : 'text-on-surface-variant'}`}>
                [THIN]
              </div>
              <div className={`px-2.5 py-1 text-label-sm font-label-sm rounded-DEFAULT transition-all ${stamp.status === 'EXPIRED' ? 'bg-[#ECEAE5] text-[#5E564F] shadow-sm font-semibold' : 'text-on-surface-variant'}`}>
                [EXPIRED]
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 flex flex-col space-y-space-md">
              <div className="relative bg-surface-container-low rounded-t-xl shadow-md p-6 sm:p-8 pt-7">
                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-DEFAULT bg-surface-container-high text-primary font-label-sm text-label-sm tracking-wide">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                      Protocol Record
                    </span>
                  </div>
                  <div>
                    <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">{stamp.nct}</h1>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-variant/80">
                    <div>
                      <div className="font-label-sm text-[10px] uppercase text-outline">Protocol Hash</div>
                      <div className="font-label-sm text-label-sm text-primary font-semibold truncate flex items-center gap-1 mt-0.5" title={stamp.id}>
                        <span>{stamp.id.substring(0, 8)}...{stamp.id.substring(stamp.id.length - 4)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-label-sm text-[10px] uppercase text-outline">Claimed Status</div>
                      <div className="font-label-sm text-label-sm text-secondary font-bold tracking-wider mt-0.5">
                        {stamp.expected_status}
                      </div>
                    </div>
                    <div>
                      <div className="font-label-sm text-[10px] uppercase text-outline">Escrow Bond</div>
                      <div className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-secondary">lock</span>
                        <span>{bondValue} test GEN</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-label-sm text-[10px] uppercase text-outline">Poster Address</div>
                      <div className="font-label-sm text-label-sm text-on-surface font-medium truncate mt-0.5" title={stamp.poster}>
                        <span className="text-secondary font-semibold">{stamp.poster.substring(0, 6)}...{stamp.poster.substring(stamp.poster.length - 4)}</span>
                        {address?.toLowerCase() === stamp.poster.toLowerCase() && " (You)"}
                      </div>
                    </div>
                  </div>
                  
                  {stamp.status === "PENDING" && (
                    <div className="flex gap-4 mt-2">
                      <div className="bg-surface-container px-3 py-1.5 rounded-DEFAULT">
                        <span className="text-[10px] text-outline uppercase block">Challenge closes</span>
                        <span className="text-label-sm font-semibold">{expiresLabel}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Deck / Result Status */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col gap-4">
                {stamp.status === "PENDING" ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-DEFAULT bg-surface-container text-secondary font-label-sm text-label-sm font-bold tracking-wider">
                          [OPEN] UNSTAMPED RECORD
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {windowOpen
                          ? "Open for challengers. The poster cannot cancel or expire this bond until the challenge window closes."
                          : "The challenge window has closed. Expire returns the original bond to the poster."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {!isStamping && !isExpiring ? (
                        <>
                          {!isPoster && (
                            <button onClick={() => setIsStamping(true)} className="px-5 py-2.5 rounded-DEFAULT bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg tracking-wider uppercase transition-all shadow-sm flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px]">verified</span>
                              <span>Stamp Now</span>
                            </button>
                          )}
                          {isPoster && (
                            <button onClick={() => setIsExpiring(true)} disabled={windowOpen} className="px-4 py-2.5 rounded-DEFAULT bg-surface-container-low text-on-surface-variant font-label-md text-label-md tracking-wider uppercase transition-all border border-outline-variant flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                              <span className="material-symbols-outlined text-[16px]">hourglass_bottom</span>
                              <span>{windowOpen ? "Locked until close" : "Expire"}</span>
                            </button>
                          )}
                        </>
                      ) : kit ? (
                        <div className="flex flex-col gap-2">
                          <GenLayerTransactionPanel
                              kit={kit}
                              network="GenLayer Studio Next"
                              theme="light"
                              onDone={() => {
                                setIsStamping(false);
                                setIsExpiring(false);
                                window.location.reload();
                              }}
                              tx={{
                                kind: 'write',
                                address: contractAddress as `0x${string}`,
                                method: isExpiring ? 'expire' : 'match',
                                args: [stamp.id]
                              }}
                          />
                          <button onClick={() => { setIsStamping(false); setIsExpiring(false); }} className="px-4 py-2 text-on-surface-variant text-label-sm font-label-sm hover:text-error">Close</button>
                        </div>
                      ) : (
                        <div className="p-2 bg-error-container text-on-error-container">Not Connected</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-DEFAULT font-label-sm text-label-sm font-bold tracking-wider 
                        ${stamp.status === 'MATCH' ? 'bg-[#EEF3E6] text-[#536233]' : ''}
                        ${stamp.status === 'MISS' ? 'bg-[#F9EAE1] text-[#A0381C]' : ''}
                        ${stamp.status === 'THIN' ? 'bg-[#FDF5E2] text-[#966517]' : ''}
                        ${stamp.status === 'EXPIRED' ? 'bg-[#ECEAE5] text-[#5E564F]' : ''}
                       `}>
                          [{stamp.status}] SETTLED RECORD
                       </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="font-label-sm text-[10px] uppercase text-outline block mb-1">Executing Stamper</span>
                        <span className="font-label-sm text-label-sm font-semibold">{stamp.stamper || "N/A"}</span>
                      </div>
                      {(stamp.status === 'THIN' || stamp.status === 'EXPIRED') && (
                        <div>
                          <span className="font-label-sm text-[10px] uppercase text-outline block mb-1">Nullification Reason</span>
                          <span className="font-label-sm text-label-sm font-semibold text-error">{stamp.result_reason || "Unknown Error"}</span>
                        </div>
                      )}
                      {(stamp.status === 'MATCH' || stamp.status === 'MISS') && (
                        <div>
                          <span className="font-label-sm text-[10px] uppercase text-outline block mb-1">Actual Resolved Status</span>
                          <span className={`font-label-sm text-label-sm font-semibold ${stamp.status === 'MATCH' ? 'text-primary' : 'text-error'}`}>
                            {stamp.result_overall_status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Pipeline Info */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-variant">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[16px] text-primary font-semibold">Deterministic NIH Feed Pipeline</span>
                        <span className="bg-[#e8f0e4] text-[#2f5c3e] border border-[#b8d4ac] px-2 py-0.2 rounded-DEFAULT font-label-sm text-[10px] font-semibold">VERIFIED ORACLE</span>
                      </div>
                      <div className="font-label-sm text-[11px] text-outline">Target Host: clinicaltrials.gov JSON API v2</div>
                    </div>
                  </div>
                </div>

                <div className="my-4 p-3.5 bg-surface-container-low rounded-DEFAULT">
                  <div className="flex items-center justify-between font-label-sm text-[10px] text-outline uppercase tracking-wider mb-1">
                    <span>Deterministic URL Constructor</span>
                    <span className="text-secondary font-medium">RFC-3986 Standardized</span>
                  </div>
                  <div className="font-label-md text-label-md text-primary bg-surface-container-lowest p-2 rounded-DEFAULT select-all truncate border border-outline-variant/60">
                    https://clinicaltrials.gov/api/v2/studies/{stamp.nct}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-4 flex flex-col space-y-space-md">
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
                    <span className="font-headline-sm text-[17px] text-primary font-semibold">Bond Distribution Rules</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-surface-container-low rounded-DEFAULT">
                    <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#536233]"></span>
                        Outcome [MATCH]
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-tight">
                      Poster receives 97.5% principal back. A 2.5% fee is retained by the network.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-DEFAULT">
                    <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#a0381c]"></span>
                        Outcome [MISS]
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-tight">
                      Stamper receives the entire bond as a bounty for resolving the mismatch.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-DEFAULT">
                    <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#966517]"></span>
                        Outcome [THIN]
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-tight">
                      API errors or unresolvable formats result in a 100% refund.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-DEFAULT">
                    <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5E564F]"></span>
                        Outcome [EXPIRED]
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-tight">
                      After the 10-minute window, an unchallenged stamp refunds the original bond to the poster. Expire is rejected before that.
                    </p>
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
