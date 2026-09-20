"use client";
import { useState, useEffect, useRef } from "react";
import { useGenLayer } from "../../hooks/useGenLayer";
import { GenLayerTransactionPanel } from "@genlayer/transaction-kit-react";
import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

export default function Page() {
  const { kit, address } = useGenLayer();
  const [creditBalance, setCreditBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    async function fetchCredit() {
      if (!address) {
        setCreditBalance("0");
        setLoading(false);
        return;
      }
      try {
        const client = createClient({
          chain: studioDevnet,
          endpoint: "https://studio-dev.genlayer.com/api"
        });
        
        const data = await client.readContract({
          address: contractAddress as `0x${string}`,
          functionName: "get_credit",
          args: [address]
        });
        
        if (data) {
          setCreditBalance(data as string);
        } else {
          setCreditBalance("0");
        }
      } catch (err) {
        console.error("Failed to fetch credit:", err);
        setCreditBalance("0");
      } finally {
        setLoading(false);
      }
    }
    
    fetchCredit();
  }, [contractAddress, address, txSuccess]);

  const formatGen = (weiString: string | null) => {
    if (!weiString) return "0.0000";
    return (Number(weiString) / 1e18).toFixed(4);
  };

  const hasCredit = creditBalance && Number(creditBalance) > 0;

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin py-space-md">
        <div className="flex flex-col w-full space-y-space-lg">
          <div className="relative w-full">
            <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-2xl relative z-10">
                <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  <span className="uppercase tracking-wider font-semibold">My Credits & Wallet</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-normal">
                  My Protocol Activity
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  View and withdraw your earned protocol credits. Connect your wallet to access GenLayer Studio Next (Chain 61997).
                </p>
              </div>

              <div className="flex items-center gap-4 bg-surface-container-low p-space-md rounded-DEFAULT shadow-sm relative z-10">
                <div className="w-12 h-12 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[26px]">fingerprint</span>
                </div>
                <div>
                  <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Connected Account</div>
                  <div className="font-label-lg text-label-lg font-semibold text-primary">
                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Not Connected'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high p-space-md rounded-DEFAULT shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-lowest text-secondary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">Contract Custody Credits</span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-DEFAULT font-label-sm text-[10px]">ESCROW</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                  Credits represent unbonded returns or native payouts held in smart contract custody. Withdraw is a first-class atomic action executed directly via consensus.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
              <div className="text-right">
                <div className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Withdrawable Available</div>
                <div className="font-headline-sm text-headline-sm text-primary font-medium">
                  {loading ? "..." : formatGen(creditBalance)} <span className="font-label-sm text-label-sm text-outline">test GEN</span>
                </div>
              </div>

              {!hasCredit || loading ? (
                <button 
                  className="px-4 py-2 bg-surface-container text-outline cursor-not-allowed font-label-sm text-label-sm uppercase tracking-wider rounded-DEFAULT transition-all flex items-center gap-1.5 shadow-sm" 
                  disabled={true}
                >
                  <span className="material-symbols-outlined text-[15px]">file_download_done</span>
                  <span>{loading ? "Loading..." : "No Credits"}</span>
                </button>
              ) : isWithdrawing ? (
                <div className="w-[400px]">
                  {kit ? (
                    <GenLayerTransactionPanel
                      kit={kit}
                      tx={{
                        kind: 'write',
                        address: contractAddress as `0x${string}`,
                        method: 'withdraw',
                        args: []
                      }}
                      network="GenLayer Studio Next"
                      theme="light"
                      onDone={(result: any) => {
                        setTimeout(() => {
                          const status = result?.statusName || result?.status;
                          const execution = result?.executionResultName || result?.executionResult || result?.execution?.result || result?.lifecycle?.outcome;
                          
                          if ((status === 'ACCEPTED' || status === 'FINALIZED') && 
                              (execution === 'FINISHED_WITH_RETURN' || execution === 'accepted' || !execution)) {
                            setTxSuccess(true);
                            setIsWithdrawing(false);
                          } else if (status === 'ACCEPTED' || status === 'FINALIZED') {
                            setTxSuccess(true);
                            setIsWithdrawing(false);
                          }
                        }, 0);
                      }}
                    />
                  ) : (
                    <div className="p-4 text-error font-label-sm">Please connect your wallet first.</div>
                  )}
                  <button 
                    onClick={() => setIsWithdrawing(false)}
                    className="mt-2 text-label-sm font-label-sm text-outline hover:text-primary transition-colors underline w-full text-center"
                  >
                    Cancel Withdrawal
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsWithdrawing(true)}
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-sm text-label-sm uppercase tracking-wider rounded-DEFAULT flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]">file_download_done</span>
                  <span>Withdraw Credits</span>
                </button>
              )}
            </div>
          </div>
          
          {txSuccess && (
            <div className="bg-[#e8f0e4] text-[#2f5c3e] p-space-md rounded-DEFAULT flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="font-label-md">Withdrawal Successful! Your credits have been moved to your wallet balance.</span>
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-md overflow-hidden p-space-lg text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container mb-4">
                <span className="material-symbols-outlined text-outline text-[32px]">history</span>
             </div>
             <h3 className="font-headline-sm text-primary mb-2">Historical Records Unavailable</h3>
             <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
               The current GenLayer smart contract does not retain indexable historical transaction logs. 
               Only active states and current balances are tracked.
             </p>
          </div>

        </div>
      </div>
    </>
  );
}
