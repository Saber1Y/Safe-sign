"use client";

import { formatUnits, maxUint256 } from "viem";
import { explorerAddressUrl } from "@/lib/explorer";
import type { RiskLevel, ScanInput, ScanReport } from "@/lib/risk/types";
import { RiskBadge } from "./risk-badge";
import { useContractLabel } from "@/hooks/use-registry-label";
import { cn } from "@/lib/utils";

const riskAccent: Record<RiskLevel, string> = {
  Low: "border-t-emerald-500",
  Medium: "border-t-amber-500",
  High: "border-t-orange-500",
  Critical: "border-t-rose-500",
};

const scoreColor: Record<RiskLevel, string> = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-rose-500",
};

const recIcon: Record<RiskLevel, string> = {
  Low: "✓",
  Medium: "?",
  High: "⚠",
  Critical: "✕",
};

const recBg: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 border-emerald-200 text-emerald-800",
  Medium: "bg-amber-50 border-amber-200 text-amber-800",
  High: "bg-orange-50 border-orange-200 text-orange-800",
  Critical: "bg-rose-50 border-rose-200 text-rose-800",
};

function shortAddress(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function Value({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
        {children}
      </p>
    </div>
  );
}

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
        summary: `Spender ${shortAddress(spender)} is approved for ${
          amount >= maxUint256 - 10n ? "an unlimited amount" : `${formatUnits(amount, 18)} tokens`
        }.`,
      };
    }

    if (report.action.actionKind === "setApprovalForAll") {
      const operator = String(arg0 ?? "");
      const approved = Boolean(arg1);
      return {
        summary: `${approved ? "Grants" : "Revokes"} full operator control over all NFTs to ${shortAddress(operator)}.`,
      };
    }

    if (report.action.actionKind === "transfer") {
      const to = String(arg0 ?? "");
      const amount = typeof arg1 === "bigint" ? arg1 : BigInt(String(arg1 ?? 0));
      return {
        summary: `Transfers ${formatUnits(amount, 18)} tokens to ${shortAddress(to)}.`,
      };
    }

    return { summary: "No additional decoded argument summary available." };
  })();

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        "border-t-4",
        riskAccent[report.risk],
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Scan Report</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {report.action.functionName} on {label.name}
              {source === "chain" ? (
                <span className="ml-1.5 rounded bg-sky-100 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">
                  on-chain
                </span>
              ) : null}
            </p>
          </div>
          <RiskBadge level={report.risk} />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600">Risk Score</span>
            <span className="font-bold text-slate-900">{report.score}/100</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn("h-full rounded-full transition-all duration-700", scoreColor[report.risk])}
              style={{
                width: `${report.score}%`,
                animation: "score-fill 0.8s ease-out",
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-4">
          <Value label="Action">{report.action.functionName}</Value>
          <Value label="Selector">
            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs font-mono">
              {report.action.selector}
            </code>
          </Value>
          <Value label="Contract">
            <a
              href={explorerAddressUrl(input.to)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-sky-700 underline underline-offset-2"
            >
              {shortAddress(input.to)}
            </a>
          </Value>
          <Value label="Label">{label.name}</Value>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            What this transaction does
          </p>
          <p className="mt-1.5 font-medium text-slate-800">{report.explanation}</p>
          <p className="mt-2 border-t border-slate-100 pt-2 text-slate-600">
            <span className="font-medium">Decoded:</span> {details.summary}
          </p>
        </div>

        {report.signals.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Warnings ({report.signals.length})
            </p>
            <div className="mt-2 space-y-2">
              {report.signals.map((signal) => (
                <div
                  key={signal.code}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm",
                    signal.level === "Critical"
                      ? "border-rose-200 bg-rose-50 text-rose-800"
                      : signal.level === "High"
                        ? "border-orange-200 bg-orange-50 text-orange-800"
                        : signal.level === "Medium"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-slate-200 bg-slate-50 text-slate-700",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 font-bold">
                      {signal.level === "Critical"
                        ? "✕"
                        : signal.level === "High"
                          ? "⚠"
                          : signal.level === "Medium"
                            ? "!"
                            : "i"}
                    </span>
                    <div>
                      <p className="font-semibold">{signal.level}</p>
                      <p className="mt-0.5 text-sm opacity-90">{signal.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Immediate
            </p>
            <p className="mt-1 font-medium">{report.immediateMovement}</p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Future Risk
            </p>
            <p className="mt-1 font-medium">{report.futureRisk}</p>
          </div>
        </div>

        <div className={cn("mt-5 rounded-xl border p-4 text-sm font-medium", recBg[report.risk])}>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-base font-bold">{recIcon[report.risk]}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Recommendation
              </p>
              <p className="mt-1 leading-relaxed">{report.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
