import { decodeFunctionData, type Hex } from "viem";
import type { DecodedAction } from "@/lib/risk/types";
import { safeSignAbiFragments } from "./abi-fragments";
import { selectorMap } from "./selectors";

const UNKNOWN_SELECTOR = "0x00000000";

export function decodeTransactionData(data: string): DecodedAction {
  const selector =
    data && data.startsWith("0x") && data.length >= 10
      ? data.slice(0, 10).toLowerCase()
      : UNKNOWN_SELECTOR;

  try {
    const decoded = decodeFunctionData({
      abi: safeSignAbiFragments,
      data: data as Hex,
    });

    const functionName = String(decoded.functionName);
    return {
      selector,
      functionName,
      actionKind: selectorMap[selector] ?? "unknown",
      args: decoded.args ?? [],
    };
  } catch {
    return {
      selector,
      functionName: "unknown",
      actionKind: selectorMap[selector] ?? "unknown",
      args: [],
    };
  }
}

