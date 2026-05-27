"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const hasPrivyAppId = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const { ready, authenticated, connectOrCreateWallet, logout } = usePrivy();
  const { address } = useAccount();

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

  if (!authenticated || !address) {
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
        {shortAddress(address)}
      </button>
    </div>
  );
}
