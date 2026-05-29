"use client";

import { useState, useCallback } from "react";
import { decodeFunctionData, type Hex, type Abi } from "viem";
import { scanTransaction } from "@/lib/risk/engine";
import { ReportCard } from "@/components/scanner/report-card";
import type { ScanInput, ScanReport } from "@/lib/risk/types";

export function CustomAbiScanner() {
  const [abiJson, setAbiJson] = useState("");
  const [calldata, setCalldata] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [pageIntent, setPageIntent] = useState("");
  const [result, setResult] = useState<{
    decoded: string;
    report: ScanReport | null;
    error?: string;
  } | null>(null);

  const handleScan = useCallback(() => {
    setResult(null);

    if (!calldata || !calldata.startsWith("0x")) {
      setResult({ decoded: "Invalid calldata. Must start with 0x.", report: null });
      return;
    }

    let abi: Abi;
    try {
      abi = JSON.parse(abiJson) as Abi;
    } catch {
      setResult({ decoded: "Invalid ABI JSON.", report: null });
      return;
    }

    try {
      const decoded = decodeFunctionData({ abi, data: calldata as Hex });
      const input: ScanInput = {
        to: contractAddress || "0x0000000000000000000000000000000000000000",
        data: calldata,
        valueWei: "0",
        pageIntent: pageIntent || undefined,
      };
      const report = scanTransaction(input);

      const funcDef = abi.find(
        (entry) =>
          typeof entry === "object" &&
          "name" in entry &&
          entry.name === decoded.functionName,
      );

      setResult({
        decoded: [
          `Function: ${decoded.functionName}`,
          `Selector: ${calldata.slice(0, 10)}`,
          `Parameters: ${JSON.stringify(decoded.args, (_, v) =>
            typeof v === "bigint" ? v.toString() : v,
          )}`,
          funcDef
            ? `ABI entry: ${JSON.stringify(funcDef, null, 2)}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
        report,
      });
    } catch (err) {
      setResult({
        decoded: `Decoding failed: ${err instanceof Error ? err.message : String(err)}`,
        report: null,
      });
    }
  }, [abiJson, calldata, contractAddress, pageIntent]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Custom ABI Decoder
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Paste any valid contract ABI (JSON array) and transaction calldata to
          decode and run through the SafeSign risk engine.
        </p>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Contract ABI (JSON)
            <textarea
              value={abiJson}
              onChange={(e) => setAbiJson(e.target.value)}
              rows={6}
              placeholder='[{"type":"function","name":"transfer","inputs":[{"type":"address"},{"type":"uint256"}]}]'
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Contract address (optional)
            <input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Calldata (hex)
            <textarea
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              rows={3}
              placeholder="0x..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Page intent (optional)
            <input
              value={pageIntent}
              onChange={(e) => setPageIntent(e.target.value)}
              placeholder="e.g. claim reward"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleScan}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Decode &amp; Analyze
          </button>
        </div>
      </div>

      {result ? (
        <div className="space-y-6">
          {result.error || !result.report ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {result.decoded}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {result.decoded}
                </pre>
              </div>
              <ReportCard
                report={result.report}
                input={{
                  to: contractAddress || "0x0000000000000000000000000000000000000000",
                  data: calldata,
                  valueWei: "0",
                  pageIntent: pageIntent || undefined,
                }}
              />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
