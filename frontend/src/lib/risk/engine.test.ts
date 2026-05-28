import { describe, it, expect } from "vitest";
import { scanTransaction } from "./engine";
import type { ScanInput } from "./types";

const TOKEN = "0x1111111111111111111111111111111111111111";
const NFT = "0x2222222222222222222222222222222222222222";
const UNKNOWN = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const RECIPIENT = "0x6666666666666666666666666666666666666666";

function padAddress(addr: string): string {
  return "000000000000000000000000" + addr.toLowerCase().slice(2);
}

function padAmount(hex: string): string {
  return hex.toLowerCase().padStart(64, "0");
}

const MAX_UINT = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

describe("scanTransaction", () => {
  it("returns Low risk for a plain transfer", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0xa9059cbb${padAddress(RECIPIENT)}${padAmount("4563918244f40000")}`,
    };
    const report = scanTransaction(input);
    expect(report.risk).toBe("Low");
    expect(report.score).toBe(15);
    expect(report.action.actionKind).toBe("transfer");
  });

  it("returns High for approval to unknown spender (limited amount)", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0x095ea7b3${padAddress(UNKNOWN)}${padAmount("0")}`,
    };
    const report = scanTransaction(input);
    expect(report.risk).toBe("High");
    expect(report.signals.some((s) => s.code === "unknown_spender")).toBe(true);
  });

  it("detects unlimited approval when amount is maxUint256", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0x095ea7b3${padAddress(UNKNOWN)}${MAX_UINT}`,
    };
    const report = scanTransaction(input);
    expect(
      report.signals.some((s) => s.code === "unlimited_approval"),
    ).toBe(true);
    expect(
      report.signals.some((s) => s.code === "unknown_spender"),
    ).toBe(true);
  });

  it("detects intent mismatch when page says claim but tx is approve", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0x095ea7b3${padAddress(UNKNOWN)}${padAmount("1000000000000000000")}`,
      pageIntent: "claim reward",
    };
    const report = scanTransaction(input);
    expect(
      report.signals.some((s) => s.code === "intent_mismatch"),
    ).toBe(true);
    expect(report.risk).toBe("Critical");
  });

  it("detects NFT approval-for-all to untrusted operator", () => {
    const input: ScanInput = {
      to: NFT,
      data: `0xa22cb465${padAddress(UNKNOWN)}${padAmount("1")}`,
    };
    const report = scanTransaction(input);
    expect(
      report.signals.some((s) => s.code === "nft_approval_for_all"),
    ).toBe(true);
    expect(report.risk).toBe("Critical");
  });

  it("returns explanation, recommendation, movement, futureRisk for every scan", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0x095ea7b3${padAddress(UNKNOWN)}${MAX_UINT}`,
    };
    const report = scanTransaction(input);
    expect(report.explanation).toBeTruthy();
    expect(report.recommendation).toBeTruthy();
    expect(report.immediateMovement).toBe("No immediate token movement.");
    expect(report.futureRisk).toContain("Spender may transfer");
  });

  it("handles unknown selector gracefully", () => {
    const input: ScanInput = {
      to: TOKEN,
      data: `0x12345678${padAmount("0")}${padAmount("0")}`,
    };
    const report = scanTransaction(input);
    expect(report.action.actionKind).toBe("unknown");
    expect(report.signals.some((s) => s.code === "unknown_selector")).toBe(
      true,
    );
    expect(report.risk).toBe("Medium");
  });

  it("detects risky contract via label", () => {
    const input: ScanInput = {
      to: "0x4444444444444444444444444444444444444444",
      data: "0xa9059cbb00000000000000000000000066666666666666666666666666666666666666660000000000000000000000000000000000000000000000000000000000000001",
    };
    const report = scanTransaction(input);
    expect(
      report.signals.some((s) => s.code === "known_risky_contract"),
    ).toBe(true);
  });
});
