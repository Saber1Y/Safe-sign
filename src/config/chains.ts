import { type Chain } from "viem";

const qieChainId = Number(process.env.NEXT_PUBLIC_QIE_CHAIN_ID ?? "35443");
const qieRpcUrl =
  process.env.NEXT_PUBLIC_QIE_RPC_URL ?? "https://testnet-rpc.qie.example";
const qieExplorerUrl =
  process.env.NEXT_PUBLIC_QIE_EXPLORER_URL ??
  "https://testnet-explorer.qie.example";

export const qieTestnet = {
  id: qieChainId,
  name: "QIE Testnet",
  nativeCurrency: {
    name: "QIE",
    symbol: "QIE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [qieRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "QIE Explorer",
      url: qieExplorerUrl,
    },
  },
  testnet: true,
} as const satisfies Chain;

