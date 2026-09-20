"use client";
import { useEffect, useState } from "react";
import { createTransactionKit, TransactionKit } from "@genlayer/transaction-kit";
import { studioDevnet } from "genlayer-js/chains";
import { useWalletContext } from "../lib/WalletProvider";

export function useGenLayer() {
  const [kit, setKit] = useState<TransactionKit | null>(null);
  const { account, selectedProvider, chainId } = useWalletContext();

  useEffect(() => {
    let parsedChainId = null;
    if (chainId) {
      parsedChainId = typeof chainId === 'string' && chainId.startsWith('0x') 
        ? parseInt(chainId, 16) 
        : parseInt(chainId as string, 10);
    }
    
    if (account && selectedProvider && parsedChainId === 61997) {
      const tkit = createTransactionKit({
        chain: studioDevnet,
        provider: selectedProvider,
        account: account as `0x${string}`,
        allowUnverified: true
      });
      setKit(tkit);
    } else {
      setKit(null);
    }
  }, [account, selectedProvider, chainId]);

  return { kit, address: account };
}
