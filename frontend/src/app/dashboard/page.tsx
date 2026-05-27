import { LiveApprovalDashboard } from "@/components/dashboard/live-approval-dashboard";

export default function DashboardPage() {
  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Approval Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Review existing demo approvals and revoke risky permissions before
          they can be abused.
        </p>
      </header>

      <LiveApprovalDashboard />
    </section>
  );
}
