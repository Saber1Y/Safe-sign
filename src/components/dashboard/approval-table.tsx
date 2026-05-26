import { RiskBadge } from "@/components/scanner/risk-badge";
import type { RiskLevel } from "@/lib/risk/types";

export type ApprovalRow = {
  asset: string;
  spender: string;
  approvalType: string;
  amount: string;
  risk: RiskLevel;
};

type ApprovalTableProps = {
  title: string;
  rows: ApprovalRow[];
};

export function ApprovalTable({ title, rows }: ApprovalTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3 pr-4">Asset</th>
              <th className="pb-3 pr-4">Spender</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Risk</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={`${row.asset}-${row.spender}`} className="text-slate-700">
                <td className="py-3 pr-4">{row.asset}</td>
                <td className="py-3 pr-4 font-mono text-xs">{row.spender}</td>
                <td className="py-3 pr-4">{row.approvalType}</td>
                <td className="py-3 pr-4">{row.amount}</td>
                <td className="py-3 pr-4">
                  <RiskBadge level={row.risk} />
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

