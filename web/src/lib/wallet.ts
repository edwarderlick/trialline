import { useState, useEffect, useCallback } from 'react';

// EIP-6963 standard interfaces
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any; // EIP-1193 provider
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider';
  detail: EIP6963ProviderDetail;
}

const GENLAYER_CHAIN_ID = '0xf21d'; // Hex strictly lowercase for MetaMask comparison sometimes
const GENLAYER_CHAIN_ID_DECIMAL = 61997;
const GENLAYER_CHAIN_PARAMS = {
  chainId: GENLAYER_CHAIN_ID,
  chainName: 'GenLayer Studio Devnet',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://studio-dev.genlayer.com/api'],
  blockExplorerUrls: ['https://explorer-studio-dev.genlayer.com/'],
};

export function useWallet() {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<EIP6963ProviderDetail | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const checkIsWrongNetwork = (id: string | number | null) => {
    if (!id) return false;
    const parsed = typeof id === 'string' && id.startsWith('0x') ? parseInt(id, 16) : parseInt(id as string, 10);
    return parsed !== GENLAYER_CHAIN_ID_DECIMAL;
  };

  // 1. EIP-6963 Discovery
  useEffect(() => {
    function onAnnounceProvider(event: EIP6963AnnounceProviderEvent) {
      setProviders((prev) => {
        if (prev.some((p) => p.info.uuid === event.detail.info.uuid)) {
          return prev;
        }
        return [...prev, event.detail];
      });
    }

    window.addEventListener('eip6963:announceProvider', onAnnounceProvider as EventListener);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', onAnnounceProvider as EventListener);
    };
  }, []);

  // 1.5. Wallet Hydration (Persistence)
  useEffect(() => {
    if (selectedProviderDetail || providers.length === 0) return;
    if (typeof window !== 'undefined' && sessionStorage.getItem('wallet_disconnected') === 'true') return;

    const attemptHydration = async () => {
      for (const p of providers) {
        try {
          const accounts = await p.provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setSelectedProviderDetail(p);
            setAccount(accounts[0]);
            const currentChainId = await p.provider.request({ method: 'eth_chainId' });
            setChainId(currentChainId);
            setIsWrongNetwork(checkIsWrongNetwork(currentChainId));
            break;
          }
        } catch (error) {
          console.error("Hydration check failed for provider:", p.info.name, error);
        }
      }
    };
    attemptHydration();
  }, [providers, selectedProviderDetail]);

  // Fallback for generic EIP-1193 injected wallet removed to favor strict EIP-6963 providers.

  // Handle Account & Chain events
  useEffect(() => {
    const provider = selectedProviderDetail?.provider;
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts.length > 0 ? accounts[0] : null);
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      setIsWrongNetwork(checkIsWrongNetwork(newChainId));
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    // Initial check
    provider.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch(console.error);
      
    provider.request({ method: 'eth_chainId' })
      .then(handleChainChanged)
      .catch(console.error);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [selectedProviderDetail]);

  const connect = useCallback(async (providerDetail: EIP6963ProviderDetail) => {
    try {
      if (typeof window !== 'undefined') sessionStorage.removeItem('wallet_disconnected');
      setSelectedProviderDetail(providerDetail);
      const accounts = await providerDetail.provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const currentChainId = await providerDetail.provider.request({ method: 'eth_chainId' });
      setChainId(currentChainId);
      
      if (checkIsWrongNetwork(currentChainId)) {
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setSelectedProviderDetail(null);
      setAccount(null);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem('wallet_disconnected', 'true');
    setSelectedProviderDetail(null);
    setAccount(null);
    setChainId(null);
    setIsWrongNetwork(false);
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!selectedProviderDetail) return;
    
    try {
      await selectedProviderDetail.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GENLAYER_CHAIN_ID }],
      });
      setIsWrongNetwork(false);
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await selectedProviderDetail.provider.request({
            method: 'wallet_addEthereumChain',
            params: [GENLAYER_CHAIN_PARAMS],
          });
          setIsWrongNetwork(false);
        } catch (addError: any) {
          console.error("Failed to add GenLayer network:", addError?.message || addError);
        }
      } else {
        console.error("Failed to switch network:", error?.message || error);
      }
    }
  }, [selectedProviderDetail]);

  return {
    providers,
    selectedProvider: selectedProviderDetail?.provider,
    selectedProviderInfo: selectedProviderDetail?.info,
    account,
    chainId,
    isWrongNetwork,
    connect,
    disconnect,
    switchNetwork,
  };
}
