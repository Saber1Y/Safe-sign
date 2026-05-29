"use client";

import { useReadContract } from "wagmi";
import { DEMO_CONTRACTS } from "@/config/contracts";
import { safeSignRegistryAbi } from "@/lib/abis/registry";
import {
  getContractLabel as getLocalLabel,
  type ContractLabel,
  type LabelRisk,
} from "@/config/labels";

const RISK_MAP: Record<number, LabelRisk> = {
  0: "unknown",
  1: "safe",
  2: "caution",
  3: "high",
};

function parseRegistryResponse(data: unknown): ContractLabel | null {
  if (!data || typeof data !== "object") return null;
  const entry = data as Record<string, unknown>;
  const name = String(entry.name ?? entry[0] ?? "");
  if (!name) return null;
  const riskLevel = Number(entry.riskLevel ?? entry[1] ?? 0);
  const verified = Boolean(entry.verifiedBySafeSign ?? entry[2] ?? false);
  return {
    name,
    risk: RISK_MAP[riskLevel] ?? "unknown",
    verifiedBySafeSign: verified,
  };
}

export function useContractLabel(address?: string) {
  const localLabel = getLocalLabel(address);

  const { data: registryData, isLoading } = useReadContract({
    address: DEMO_CONTRACTS.registry as `0x${string}`,
    abi: safeSignRegistryAbi,
    functionName: "getLabel",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const chainLabel = parseRegistryResponse(registryData);
  const hasChainEntry = chainLabel !== null && chainLabel.name !== "";

  return {
    label: hasChainEntry ? chainLabel : localLabel,
    source: hasChainEntry ? "chain" : ("local" as const),
    isLoading,
  };
}
