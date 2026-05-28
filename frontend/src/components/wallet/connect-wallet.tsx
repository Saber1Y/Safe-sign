"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { ready, connectOrCreateWallet, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const walletAddress = wallets[0]?.address ?? user?.wallet?.address;

  if (!ready) {
    return (
      <button
        type="button"
        disabled
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500"
      >
        Loading wallet...
      </button>
    );
  }

  if (!walletAddress) {
    return (
      <button
        type="button"
        onClick={connectOrCreateWallet}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {shortAddress(walletAddress)}
      </button>
    </div>
  );
}
