import { describe, it, expect } from "vitest";
import { evaluateSignals } from "./rules";
import type { DecodedAction, ScanInput } from "./types";

const UNKNOWN = "0xaAaAaaAaaAaAaaAaAAAAAAAAAaAAaaAaaAaaAa";

describe("evaluateSignals", () => {
  const action = (kind: string, args: readonly unknown[] = []): DecodedAction =>
    ({
      selector: "0x00000000",
      functionName: kind,
      actionKind: kind,
      args,
    }) as DecodedAction;

  it("flags unknown function selector", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0xdeadbeef" },
      action("unknown"),
    );
    expect(signals.some((s) => s.code === "unknown_selector")).toBe(true);
  });

  it("flags unlimited approval", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0x" },
      action("approve", [UNKNOWN, 2n ** 256n - 1n]),
    );
    expect(signals.some((s) => s.code === "unlimited_approval")).toBe(true);
  });

  it("flags unknown spender", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0x" },
      action("approve", [UNKNOWN, 100n]),
    );
    expect(signals.some((s) => s.code === "unknown_spender")).toBe(true);
  });

  it("flags intent mismatch when page says claim but tx is approve", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0x", pageIntent: "claim reward" },
      action("approve", [UNKNOWN, 100n]),
    );
    expect(signals.some((s) => s.code === "intent_mismatch")).toBe(true);
  });

  it("does NOT flag intent mismatch when page intent matches action", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0x", pageIntent: "approve" },
      action("approve", [UNKNOWN, 100n]),
    );
    expect(signals.some((s) => s.code === "intent_mismatch")).toBe(false);
  });

  it("flags NFT approval-for-all to untrusted operator", () => {
    const signals = evaluateSignals(
      { to: "0x2222222222222222222222222222222222222222", data: "0x" },
      action("setApprovalForAll", [UNKNOWN, true]),
    );
    expect(signals.some((s) => s.code === "nft_approval_for_all")).toBe(true);
  });

  it("flags known risky contract", () => {
    const signals = evaluateSignals(
      { to: "0x4444444444444444444444444444444444444444", data: "0x" },
      action("transfer", ["0x6666666666666666666666666666666666666666", 1n]),
    );
    expect(signals.some((s) => s.code === "known_risky_contract")).toBe(true);
  });

  it("returns empty signals for a normal transfer", () => {
    const signals = evaluateSignals(
      { to: "0x1111111111111111111111111111111111111111", data: "0x" },
      action("transfer", ["0x6666666666666666666666666666666666666666", 100n]),
    );
    expect(signals.length).toBe(0);
  });
});
