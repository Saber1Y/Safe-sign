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
  const pendingAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || address || wallets.length === 0) return;

    const preferredWallet = wallets[0];
    if (pendingAddressRef.current === preferredWallet.address) return;

    pendingAddressRef.current = preferredWallet.address;
    void setActiveWallet(preferredWallet)
      .catch(() => {
        pendingAddressRef.current = null;
      })
      .finally(() => {
        if (pendingAddressRef.current === preferredWallet.address) {
          pendingAddressRef.current = null;
        }
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
