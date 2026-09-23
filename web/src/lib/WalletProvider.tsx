'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet, EIP6963ProviderDetail, EIP1193Provider, EIP6963ProviderInfo } from './wallet';

interface WalletContextType {
  providers: EIP6963ProviderDetail[];
  selectedProvider: EIP1193Provider | null;
  selectedProviderInfo?: EIP6963ProviderInfo;
  account: string | null;
  chainId: string | null;
  isWrongNetwork: boolean;
  connect: (providerDetail: EIP6963ProviderDetail) => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}
