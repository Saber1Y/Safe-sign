import { RiskBadge } from "@/components/scanner/risk-badge";
import type { RiskLevel } from "@/lib/risk/types";

export type ApprovalRow = {
  id: string;
  asset: string;
  spender: string;
  approvalType: string;
  amount: string;
  risk: RiskLevel;
  isActive?: boolean;
  revokeDisabled?: boolean;
  revokeLabel?: string;
  onRevoke?: () => void;
};

type ApprovalTableProps = {
  title: string;
  rows: ApprovalRow[];
  emptyMessage?: string;
};

export function ApprovalTable({
  title,
  rows,
  emptyMessage = "No approvals found.",
}: ApprovalTableProps) {
  const visibleRows = rows.filter((row) => row.isActive ?? true);

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
            {visibleRows.length === 0 ? (
              <tr>
                <td className="py-3 text-slate-500" colSpan={6}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.id} className="text-slate-700">
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
                      onClick={row.onRevoke}
                      disabled={row.revokeDisabled}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {row.revokeLabel ?? "Revoke"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
