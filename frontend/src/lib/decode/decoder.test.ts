import { describe, it, expect } from "vitest";
import { decodeTransactionData } from "./decoder";

function padAddress(addr: string): string {
  return "000000000000000000000000" + addr.toLowerCase().slice(2);
}

function padAmount(hex: string): string {
  return hex.toLowerCase().padStart(64, "0");
}

describe("decodeTransactionData", () => {
  it("decodes approve(address,uint256)", () => {
    const addr = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const data = `0x095ea7b3${padAddress(addr)}${padAmount("100")}`;
    const result = decodeTransactionData(data);
    expect(result.functionName).toBe("approve");
    expect(result.actionKind).toBe("approve");
    expect(String(result.args[0]).toLowerCase()).toBe(addr);
  });

  it("decodes transfer(address,uint256)", () => {
    const data = `0xa9059cbb${padAddress("0x6666666666666666666666666666666666666666")}${padAmount("5000000000000000000")}`;
    const result = decodeTransactionData(data);
    expect(result.functionName).toBe("transfer");
    expect(result.actionKind).toBe("transfer");
  });

  it("decodes setApprovalForAll(address,bool)", () => {
    const data = `0xa22cb465${padAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")}${padAmount("1")}`;
    const result = decodeTransactionData(data);
    expect(result.functionName).toBe("setApprovalForAll");
    expect(result.actionKind).toBe("setApprovalForAll");
  });

  it("returns unknown for unrecognized selector", () => {
    const data = "0xdeadbeef00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    const result = decodeTransactionData(data);
    expect(result.actionKind).toBe("unknown");
    expect(result.functionName).toBe("unknown");
  });

  it("returns unknown for empty data", () => {
    const result = decodeTransactionData("0x");
    expect(result.actionKind).toBe("unknown");
  });
});
