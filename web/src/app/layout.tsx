import type { Metadata } from "next";
import "./globals.css";
import "@genlayer/transaction-kit-react/styles.css";
import { WalletProvider } from "../lib/WalletProvider";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "TrialLine",
  description: "Clinical Protocol Attestation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <WalletProvider>
          <Header />

        <main className="w-full pt-20 bg-background flex-grow">
          {children}
        </main>

        <footer className="w-full bg-surface-container-low mt-auto py-space-xl">
          <div className="max-w-[1320px] mx-auto px-margin-mobile lg:px-margin">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-space-lg mb-space-lg">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary italic font-normal">TrialLine Protocol Archive</span>
                  <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded-DEFAULT text-on-surface-variant">v0.9.4-STUDIO</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">Same-session NIH trial status stamp on GenLayer Studio Next (Chain 61997). Queries built deterministically to ClinicalTrials.gov JSON API.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm">
                <a className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest text-on-surface hover:text-secondary rounded-DEFAULT transition-colors shadow-[0_1px_2px_rgba(43,30,22,0.04)]" href="https://explorer-studio-dev.genlayer.com/" rel="noreferrer" target="_blank">
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>Explorer
                </a>
                <a className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest text-on-surface hover:text-secondary rounded-DEFAULT transition-colors shadow-[0_1px_2px_rgba(43,30,22,0.04)]" href="https://studio-next.genlayer.com/api" rel="noreferrer" target="_blank">
                  <span className="material-symbols-outlined text-[14px]">api</span>RPC API
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-space-md font-label-sm text-label-sm text-outline">
              <div>All bonds and payouts are test GEN with no real monetary value.</div>
              <div>Clinical Records Registry © 2025 TrialLine Core Verifier</div>
            </div>
          </div>
        </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
