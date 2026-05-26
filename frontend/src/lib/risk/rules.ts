import { maxUint256 } from "viem";
import { getContractLabel } from "@/config/labels";
import type { DecodedAction, RiskSignal, ScanInput } from "./types";

function includesIntent(pageIntent: string | undefined, keyword: string) {
  if (!pageIntent) return false;
  return pageIntent.toLowerCase().includes(keyword);
}

function asBigInt(value: unknown) {
  try {
    return BigInt(String(value));
  } catch {
    return 0n;
  }
}

export function evaluateSignals(
  input: ScanInput,
  action: DecodedAction,
): RiskSignal[] {
  const signals: RiskSignal[] = [];
  const toLabel = getContractLabel(input.to);

  if (action.actionKind === "unknown") {
    signals.push({
      code: "unknown_selector",
      level: "Medium",
      message: "Unknown function selector. Review transaction manually.",
    });
  }

  if (action.actionKind === "approve") {
    const spender = String(action.args[0] ?? "");
    const amount = asBigInt(action.args[1] ?? 0n);
    const spenderLabel = getContractLabel(spender);

    if (amount >= maxUint256 - 10n) {
      signals.push({
        code: "unlimited_approval",
        level: "High",
        message:
          "Unlimited ERC-20 approval detected. Spender may move tokens later.",
      });
    }

    if (spenderLabel.risk === "unknown") {
      signals.push({
        code: "unknown_spender",
        level: "High",
        message: "Approval target is unknown and not verified by SafeSign.",
      });
    }
  }

  if (action.actionKind === "setApprovalForAll") {
    const approved = Boolean(action.args[1]);
    const operator = String(action.args[0] ?? "");
    const operatorLabel = getContractLabel(operator);

    if (approved && operatorLabel.risk !== "safe") {
      signals.push({
        code: "nft_approval_for_all",
        level: "Critical",
        message:
          "NFT approval-for-all granted to untrusted operator. All NFTs may be movable.",
      });
    }
  }

  if (
    (includesIntent(input.pageIntent, "claim") ||
      includesIntent(input.pageIntent, "mint")) &&
    action.actionKind === "approve"
  ) {
    signals.push({
      code: "intent_mismatch",
      level: "Critical",
      message:
        "Intent mismatch: page implies claim/mint but transaction grants approval.",
    });
  }

  if (toLabel.risk === "high") {
    signals.push({
      code: "known_risky_contract",
      level: "Critical",
      message: "Contract is flagged as risky by SafeSign labels.",
    });
  }

  return signals;
}

