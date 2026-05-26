"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { qieTestnet } from "@/config/chains";

const wagmiConfig = getDefaultConfig({
  appName: "QIE SafeSign",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id",
  chains: [qieTestnet],
  ssr: true,
});

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

