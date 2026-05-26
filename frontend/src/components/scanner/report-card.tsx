import { getContractLabel } from "@/config/labels";
import { explorerAddressUrl } from "@/lib/explorer";
import type { ScanInput, ScanReport } from "@/lib/risk/types";
import { RiskBadge } from "./risk-badge";

type ReportCardProps = {
  report: ScanReport;
  input: ScanInput;
};

export function ReportCard({ report, input }: ReportCardProps) {
  const label = getContractLabel(input.to);

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

