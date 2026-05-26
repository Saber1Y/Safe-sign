export type LabelRisk = "safe" | "caution" | "high" | "unknown";

export type ContractLabel = {
  name: string;
  risk: LabelRisk;
  verifiedBySafeSign: boolean;
};

const lower = (value: string) => value.toLowerCase();

export const CONTRACT_LABELS: Record<string, ContractLabel> = {
  [lower("0x1111111111111111111111111111111111111111")]: {
    name: "Official Demo Token",
    risk: "safe",
    verifiedBySafeSign: true,
  },
  [lower("0x2222222222222222222222222222222222222222")]: {
    name: "Official Demo NFT",
    risk: "safe",
    verifiedBySafeSign: true,
  },
  [lower("0x3333333333333333333333333333333333333333")]: {
    name: "Known Demo Spender",
    risk: "caution",
    verifiedBySafeSign: true,
  },
  [lower("0x4444444444444444444444444444444444444444")]: {
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

