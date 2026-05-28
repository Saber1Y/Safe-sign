"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const hasPrivyAppId = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim());
  const { ready, authenticated, connectOrCreateWallet, logout } = usePrivy();
  const { wallets } = useWallets();
  const { address } = useAccount();

  const fallbackAddress = wallets[0]?.address;
  const connectedAddress = address ?? fallbackAddress;
  const isSyncingWallet = authenticated && !address;

  if (!hasPrivyAppId) {
    return (
      <button
        type="button"
        disabled
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500"
      >
        Set Privy App ID
      </button>
    );
  }

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

  if (!authenticated) {
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

  if (isSyncingWallet && !connectedAddress) {
    return (
      <button
        type="button"
        disabled
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-500"
      >
        Finalizing wallet...
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
        {connectedAddress ? shortAddress(connectedAddress) : "Wallet Connected"}
      </button>
    </div>
  );
}
