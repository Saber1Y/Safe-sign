import { ApprovalTable, type ApprovalRow } from "@/components/dashboard/approval-table";

const tokenApprovals: ApprovalRow[] = [
  {
    asset: "Demo QUSDC",
    spender: "0x3333333333333333333333333333333333333333",
    approvalType: "ERC-20 Allowance",
    amount: "100 QUSDC",
    risk: "Low",
  },
  {
    asset: "Demo QUSDC",
    spender: "0x4444444444444444444444444444444444444444",
    approvalType: "ERC-20 Allowance",
    amount: "Unlimited",
    risk: "High",
  },
];

const nftApprovals: ApprovalRow[] = [
  {
    asset: "DemoNFT",
    spender: "0x4444444444444444444444444444444444444444",
    approvalType: "setApprovalForAll",
    amount: "All NFTs",
    risk: "Critical",
  },
];

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

      <ApprovalTable title="Token Approvals" rows={tokenApprovals} />
      <ApprovalTable title="NFT Approvals" rows={nftApprovals} />
    </section>
  );
}

