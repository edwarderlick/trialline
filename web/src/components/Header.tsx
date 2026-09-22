'use client';

import React from 'react';
import Link from 'next/link';
import { useWalletContext } from '../lib/WalletProvider';

export function Header() {
  const { account, chainId, isWrongNetwork, switchNetwork, connect, disconnect, providers } = useWalletContext();

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(43,30,22,0.06)]">
      {isWrongNetwork && (
        <div className="bg-error/10 py-1.5 px-margin flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-error text-[16px]">warning</span>
          <span className="font-label-sm text-error">Wrong Network. Please switch to GenLayer Studio Devnet (Chain 61997).</span>
          <button suppressHydrationWarning>
            Switch Network
          </button>
        </div>
      )}
      <div className="bg-surface-container-high py-1 px-margin-mobile lg:px-margin">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-surface-container px-2 py-0.5 rounded-DEFAULT text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d7a42] animate-pulse"></span>
              <span className="tracking-wider uppercase">GenLayer Studio Devnet</span>
              <span className="text-outline font-normal">(Chain 61997)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-outline">Deterministic Consensus Layer</span>
            {isWrongNetwork && (
              <span onClick={switchNetwork} className="text-secondary flex items-center gap-1 font-label-sm hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[12px]">sync_alt</span>
                <span>Switch Network</span>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="h-20 max-w-[1320px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img alt="TrialLine Logo" className="h-8 w-auto object-contain" src="/logo.svg" />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary leading-none tracking-tight font-medium">TrialLine</span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest text-outline mt-0.5">Clinical Protocol Attestation</span>
            </div>
          </Link>
          <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1 rounded-DEFAULT">
            <Link href="/how" className="px-3 py-1.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors rounded-DEFAULT">How TrialLine Works</Link>
            <Link href="/post" className="px-3 py-1.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors rounded-DEFAULT">Post a Stamp</Link>
            <Link href="/browse" className="px-3 py-1.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors rounded-DEFAULT">Browse</Link>
            <Link href="/me" className="px-3 py-1.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors rounded-DEFAULT">My Stamps</Link>
            <Link href="/economics" className="px-3 py-1.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors rounded-DEFAULT">Economics</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-DEFAULT shadow-[0_1px_3px_rgba(43,30,22,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3d7a42]"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">NIH Feed Active · clinicaltrials.gov</span>
          </div>
          
          {account ? (
            <div className="relative group">
              <button className="flex items-center bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-DEFAULT p-1 shadow-[inset_0_1px_2px_rgba(43,30,22,0.04)] cursor-pointer">
                <div className="flex items-center gap-2 px-2.5 py-1">
                  <span className="font-label-sm text-label-sm font-semibold text-primary">{formatAddress(account)}</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button 
                  onClick={disconnect} 
                  suppressHydrationWarning 
                  className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Disconnect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <button suppressHydrationWarning>
                Connect Wallet
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                {providers.length > 0 ? (
                  providers.map((p) => (
                    <button suppressHydrationWarning key={p.info.uuid} onClick={() => connect(p)}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest flex items-center gap-2"
                    >
                      <img src={p.info.icon} alt={p.info.name} className="w-5 h-5 object-contain" />
                      {p.info.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-outline">No wallets found</div>
                )}
              </div>
            </div>
          )}

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
