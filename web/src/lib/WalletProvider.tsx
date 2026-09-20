'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet, EIP6963ProviderDetail } from './wallet';

interface WalletContextType {
  providers: EIP6963ProviderDetail[];
  selectedProvider: any;
  selectedProviderInfo?: any;
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
