"use client";

import { PrivyProvider, useWallets } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, useSetActiveWallet } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { http, useAccount } from "wagmi";
import { qieTestnet } from "@/config/chains";

const wagmiConfig = createConfig({
  chains: [qieTestnet],
  transports: {
    [qieTestnet.id]: http(qieTestnet.rpcUrls.default.http[0]),
  },
});

type WalletProviderProps = {
  children: React.ReactNode;
};

const rawPrivyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppId = rawPrivyAppId?.trim() || "cl00000000000000000000000";

function WalletConnectionSync() {
  const { wallets, ready } = useWallets();
  const { address } = useAccount();
  const { setActiveWallet } = useSetActiveWallet();
  const attemptRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!ready || address || wallets.length === 0) return;

    const preferredWallet = wallets[0];
    const addr = preferredWallet.address;
    const attempts = attemptRef.current[addr] ?? 0;

    if (attempts >= 3) {
      console.warn(
        `[SafeSign] Failed to sync wallet ${addr} after 3 attempts. Giving up.`,
      );
      return;
    }

    attemptRef.current[addr] = attempts + 1;

    setActiveWallet(preferredWallet)
      .then(() => {
        delete attemptRef.current[addr];
      })
      .catch((err) => {
        console.error(
          `[SafeSign] setActiveWallet failed for ${addr} (attempt ${attempts + 1}/3):`,
          err,
        );
      });
  }, [address, ready, setActiveWallet, wallets]);

  return null;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider appId={privyAppId}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <WalletConnectionSync />
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
