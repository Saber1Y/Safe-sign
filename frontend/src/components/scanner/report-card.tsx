"use client";

import { formatUnits, maxUint256 } from "viem";
import { explorerAddressUrl } from "@/lib/explorer";
import type { ScanInput, ScanReport } from "@/lib/risk/types";
import { RiskBadge } from "./risk-badge";
import { useContractLabel } from "@/hooks/use-registry-label";

type ReportCardProps = {
  report: ScanReport;
  input: ScanInput;
};

export function ReportCard({ report, input }: ReportCardProps) {
  const { label, source } = useContractLabel(input.to);
  const [arg0, arg1] = report.action.args;

  const details = (() => {
    if (report.action.actionKind === "approve") {
      const spender = String(arg0 ?? "");
      const amount = typeof arg1 === "bigint" ? arg1 : BigInt(String(arg1 ?? 0));
      return {
        summary: `Spender ${spender} is approved for ${
          amount >= maxUint256 - 10n ? "unlimited" : `${formatUnits(amount, 18)} tokens`
        }.`,
      };
    }

    if (report.action.actionKind === "setApprovalForAll") {
      const operator = String(arg0 ?? "");
      const approved = Boolean(arg1);
      return {
        summary: `${approved ? "Grants" : "Revokes"} operator access for all NFTs to ${operator}.`,
      };
    }

    if (report.action.actionKind === "transfer") {
      const to = String(arg0 ?? "");
      const amount = typeof arg1 === "bigint" ? arg1 : BigInt(String(arg1 ?? 0));
      return {
        summary: `Transfers ${formatUnits(amount, 18)} tokens to ${to}.`,
      };
    }

    return { summary: "No additional decoded argument summary available." };
  })();

  return (
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Scan Report</h2>
        <RiskBadge level={report.risk} />
      </div>

      <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
        <p>
          <strong>Action:</strong> {report.action.functionName}
        </p>
        <p>
          <strong>Risk score:</strong> {report.score}/100
        </p>
        <p>
          <strong>Contract label:</strong> {label.name}
          {source === "chain" ? (
            <span className="ml-1.5 rounded bg-sky-100 px-1.5 py-0.5 text-xs text-sky-700">
              on-chain
            </span>
          ) : null}
        </p>
        <p>
          <strong>Selector:</strong> {report.action.selector}
        </p>
        <p className="sm:col-span-2">
          <strong>Contract:</strong>{" "}
          <a
            className="text-sky-700 underline underline-offset-2"
            href={explorerAddressUrl(input.to)}
            target="_blank"
            rel="noreferrer"
          >
            {input.to}
          </a>
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p>
          <strong>Decoded summary:</strong> {details.summary}
        </p>
        <p>
          <strong>Plain-English explanation:</strong> {report.explanation}
        </p>
        <p>
          <strong>Immediate token movement:</strong> {report.immediateMovement}
        </p>
        <p>
          <strong>Future risk:</strong> {report.futureRisk}
        </p>
        <p>
          <strong>Recommendation:</strong> {report.recommendation}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Triggered warnings
        </h3>
        {report.signals.length === 0 ? (
          <p className="text-sm text-slate-600">No warnings triggered.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {report.signals.map((signal) => (
              <li
                key={signal.code}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <strong>{signal.level}:</strong> {signal.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
