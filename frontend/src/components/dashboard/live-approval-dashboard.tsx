"use client";

import { useMemo, useState } from "react";
import { formatUnits, maxUint256, zeroAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { DEMO_CONTRACTS } from "@/config/contracts";
import { ApprovalTable, type ApprovalRow } from "@/components/dashboard/approval-table";
import { explorerTxUrl } from "@/lib/explorer";
import { erc20ApprovalAbi, erc721ApprovalAbi } from "@/lib/abis";

type RevokeTarget = "safeSpender" | "riskySpender" | "nftOperator";

function formatAllowance(amount: bigint) {
  if (amount >= maxUint256 - 10n) return "Unlimited";
  return `${formatUnits(amount, 18)} QUSDC`;
}

export function LiveApprovalDashboard() {
  const { address, isConnected } = useAccount();
  const owner = address ?? zeroAddress;
  const [activeRevoke, setActiveRevoke] = useState<RevokeTarget | null>(null);

  const { data: safeAllowance = 0n, refetch: refetchSafeAllowance } =
    useReadContract({
      address: DEMO_CONTRACTS.demoToken as `0x${string}`,
      abi: erc20ApprovalAbi,
      functionName: "allowance",
      args: [owner, DEMO_CONTRACTS.safeSpender as `0x${string}`],
      query: { enabled: Boolean(address) },
    });

  const { data: riskyAllowance = 0n, refetch: refetchRiskyAllowance } =
    useReadContract({
      address: DEMO_CONTRACTS.demoToken as `0x${string}`,
      abi: erc20ApprovalAbi,
      functionName: "allowance",
      args: [owner, DEMO_CONTRACTS.fakeRewardSpender as `0x${string}`],
      query: { enabled: Boolean(address) },
    });

  const { data: isNftApprovalForAll = false, refetch: refetchNftApproval } =
    useReadContract({
      address: DEMO_CONTRACTS.demoNft as `0x${string}`,
      abi: erc721ApprovalAbi,
      functionName: "isApprovedForAll",
      args: [owner, DEMO_CONTRACTS.fakeRewardSpender as `0x${string}`],
      query: { enabled: Boolean(address) },
    });

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContractAsync,
  } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      query: { enabled: Boolean(hash) },
    });

  async function revokeSafeSpender() {
    setActiveRevoke("safeSpender");
    try {
      await writeContractAsync({
        address: DEMO_CONTRACTS.demoToken as `0x${string}`,
        abi: erc20ApprovalAbi,
        functionName: "approve",
        args: [DEMO_CONTRACTS.safeSpender as `0x${string}`, 0n],
      });
      await refetchSafeAllowance();
    } finally {
      setActiveRevoke(null);
    }
  }

  async function revokeRiskySpender() {
    setActiveRevoke("riskySpender");
    try {
      await writeContractAsync({
        address: DEMO_CONTRACTS.demoToken as `0x${string}`,
        abi: erc20ApprovalAbi,
        functionName: "approve",
        args: [DEMO_CONTRACTS.fakeRewardSpender as `0x${string}`, 0n],
      });
      await refetchRiskyAllowance();
    } finally {
      setActiveRevoke(null);
    }
  }

  async function revokeNftOperator() {
    setActiveRevoke("nftOperator");
    try {
      await writeContractAsync({
        address: DEMO_CONTRACTS.demoNft as `0x${string}`,
        abi: erc721ApprovalAbi,
        functionName: "setApprovalForAll",
        args: [DEMO_CONTRACTS.fakeRewardSpender as `0x${string}`, false],
      });
      await refetchNftApproval();
    } finally {
      setActiveRevoke(null);
    }
  }

  const tokenRows = useMemo<ApprovalRow[]>(
    () => [
      {
        id: "safe-spender",
        asset: "Demo QUSDC",
        spender: DEMO_CONTRACTS.safeSpender,
        approvalType: "ERC-20 Allowance",
        amount: formatAllowance(safeAllowance),
        risk: "Low",
        isActive: safeAllowance > 0n,
        onRevoke: revokeSafeSpender,
        revokeDisabled: !isConnected || safeAllowance === 0n || isWritePending,
        revokeLabel:
          activeRevoke === "safeSpender" && isWritePending
            ? "Revoking..."
            : "Revoke",
      },
      {
        id: "risky-spender",
        asset: "Demo QUSDC",
        spender: DEMO_CONTRACTS.fakeRewardSpender,
        approvalType: "ERC-20 Allowance",
        amount: formatAllowance(riskyAllowance),
        risk: riskyAllowance >= maxUint256 - 10n ? "Critical" : "High",
        isActive: riskyAllowance > 0n,
        onRevoke: revokeRiskySpender,
        revokeDisabled: !isConnected || riskyAllowance === 0n || isWritePending,
        revokeLabel:
          activeRevoke === "riskySpender" && isWritePending
            ? "Revoking..."
            : "Revoke",
      },
    ],
    [activeRevoke, isConnected, isWritePending, riskyAllowance, safeAllowance],
  );

  const nftRows = useMemo<ApprovalRow[]>(
    () => [
      {
        id: "nft-operator",
        asset: "DemoNFT",
        spender: DEMO_CONTRACTS.fakeRewardSpender,
        approvalType: "setApprovalForAll",
        amount: isNftApprovalForAll ? "All NFTs" : "None",
        risk: "Critical",
        isActive: Boolean(isNftApprovalForAll),
        onRevoke: revokeNftOperator,
        revokeDisabled: !isConnected || !isNftApprovalForAll || isWritePending,
        revokeLabel:
          activeRevoke === "nftOperator" && isWritePending
            ? "Revoking..."
            : "Revoke",
      },
    ],
    [activeRevoke, isConnected, isNftApprovalForAll, isWritePending],
  );

  return (
    <section className="grid gap-6">
      {!isConnected ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Connect your wallet to load live token and NFT approvals.
        </div>
      ) : null}

      {hash ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            Latest revoke tx:{" "}
            <a
              href={explorerTxUrl(hash)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-700 underline underline-offset-2"
            >
              {hash}
            </a>
          </p>
          <p className="mt-1 text-slate-600">
            {isTxConfirming
              ? "Waiting for confirmation..."
              : isTxConfirmed
                ? "Transaction confirmed."
                : "Transaction submitted."}
          </p>
        </div>
      ) : null}

      {writeError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Wallet rejected or failed transaction: {writeError.message}
        </div>
      ) : null}

      <ApprovalTable
        title="Token Approvals"
        rows={tokenRows}
        emptyMessage="No active token approvals found."
      />
      <ApprovalTable
        title="NFT Approvals"
        rows={nftRows}
        emptyMessage="No active NFT operator approvals found."
      />
    </section>
  );
}

