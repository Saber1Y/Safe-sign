import { decodeTransactionData } from "@/lib/decode/decoder";
import type { RiskLevel, ScanInput, ScanReport } from "./types";
import { buildExplanation } from "./explain";
import { evaluateSignals } from "./rules";

function rank(level: RiskLevel) {
  switch (level) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
    default:
      return 1;
  }
}

function mergeRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.length === 0) return "Low";
  return levels.sort((a, b) => rank(b) - rank(a))[0];
}

function riskToScore(risk: RiskLevel): number {
  switch (risk) {
    case "Critical":
      return 95;
    case "High":
      return 75;
    case "Medium":
      return 50;
    case "Low":
    default:
      return 15;
  }
}

function recommendationFor(risk: RiskLevel): string {
  switch (risk) {
    case "Critical":
      return "Reject this transaction unless you fully trust the contract and understand the impact.";
    case "High":
      return "Proceed only if this spender and action are expected.";
    case "Medium":
      return "Review contract identity, function, and amount before signing.";
    case "Low":
    default:
      return "Looks normal based on current checks. Continue with standard caution.";
  }
}

function immediateMovementFor(actionKind: string): string {
  if (actionKind === "approve" || actionKind === "setApprovalForAll") {
    return "No immediate token movement.";
  }
  return "Immediate asset movement is expected.";
}

function futureRiskFor(actionKind: string): string {
  if (actionKind === "approve") {
    return "Spender may transfer tokens later up to approved amount.";
  }
  if (actionKind === "setApprovalForAll") {
    return "Operator may move all NFTs in this collection later.";
  }
  return "Future delegated spending risk appears limited.";
}

export function scanTransaction(input: ScanInput): ScanReport {
  const action = decodeTransactionData(input.data);
  const signals = evaluateSignals(input, action);
  const risk = mergeRisk(signals.map((signal) => signal.level));
  const score = riskToScore(risk);

  return {
    risk,
    score,
    action,
    signals,
    explanation: buildExplanation(action, signals),
    recommendation: recommendationFor(risk),
    immediateMovement: immediateMovementFor(action.actionKind),
    futureRisk: futureRiskFor(action.actionKind),
  };
}

