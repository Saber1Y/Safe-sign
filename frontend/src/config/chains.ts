import { type Chain } from "viem";

const qieChainId = Number(process.env.NEXT_PUBLIC_QIE_CHAIN_ID ?? "1983");
const qieRpcUrl =
  process.env.NEXT_PUBLIC_QIE_RPC_URL ?? "https://rpc5testnet.qie.digital";
const qieExplorerUrl =
  process.env.NEXT_PUBLIC_QIE_EXPLORER_URL ??
  "https://testnet.qie.digital";

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

