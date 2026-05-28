import { parseAbi } from "viem";

export const safeSignRegistryAbi = parseAbi([
  "function getLabel(address contractAddress) view returns (tuple(string name, uint8 riskLevel, bool verifiedBySafeSign))",
  "function setLabel(address contractAddress, string name, uint8 riskLevel, bool verifiedBySafeSign)",
]);
