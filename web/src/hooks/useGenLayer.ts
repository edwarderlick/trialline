"use client";
import { useMemo } from "react";
import { createTransactionKit } from "@genlayer/transaction-kit";
import { studioDevnet } from "genlayer-js/chains";
import { useWalletContext } from "../lib/WalletProvider";

export function useGenLayer() {
  const { account, selectedProvider, chainId } = useWalletContext();
  const kit = useMemo(() => {
    let parsedChainId = null;
    if (chainId) {
      parsedChainId = typeof chainId === 'string' && chainId.startsWith('0x') 
        ? parseInt(chainId, 16) 
        : parseInt(chainId as string, 10);
    }
    
    if (account && selectedProvider && parsedChainId === 61997) {
      return createTransactionKit({
        chain: studioDevnet,
        provider: selectedProvider,
        account: account as `0x${string}`,
        allowUnverified: true
      });
    }
    return null;
  }, [account, selectedProvider, chainId]);

  return { kit, address: account };
}
