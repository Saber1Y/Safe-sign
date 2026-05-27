import { DEMO_CONTRACTS } from "@/config/contracts";

export type LabelRisk = "safe" | "caution" | "high" | "unknown";

export type ContractLabel = {
  name: string;
  risk: LabelRisk;
  verifiedBySafeSign: boolean;
};

const lower = (value: string) => value.toLowerCase();

export const CONTRACT_LABELS: Record<string, ContractLabel> = {
  [lower(DEMO_CONTRACTS.demoToken)]: {
    name: "Official Demo Token",
    risk: "safe",
    verifiedBySafeSign: true,
  },
  [lower(DEMO_CONTRACTS.demoNft)]: {
    name: "Official Demo NFT",
    risk: "safe",
    verifiedBySafeSign: true,
  },
  [lower(DEMO_CONTRACTS.safeSpender)]: {
    name: "Known Demo Spender",
    risk: "caution",
    verifiedBySafeSign: true,
  },
  [lower(DEMO_CONTRACTS.fakeRewardSpender)]: {
    name: "Fake Claim Spender",
    risk: "high",
    verifiedBySafeSign: false,
  },
};

export function getContractLabel(address?: string): ContractLabel {
  if (!address) {
    return {
      name: "Unknown Contract",
      risk: "unknown",
      verifiedBySafeSign: false,
    };
  }

  return (
    CONTRACT_LABELS[address.toLowerCase()] ?? {
      name: "Unknown Contract",
      risk: "unknown",
      verifiedBySafeSign: false,
    }
  );
}
