"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { http } from "wagmi";
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

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider appId={privyAppId}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
