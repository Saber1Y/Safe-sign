"use client";

import { useState } from "react";
import { DEMO_CONTRACTS } from "@/config/contracts";
import type { ScanInput } from "@/lib/risk/types";

type ScanFormProps = {
  onScan: (input: ScanInput) => void;
  defaultInput?: Partial<ScanInput>;
};

export function ScanForm({ onScan, defaultInput }: ScanFormProps) {
  const [to, setTo] = useState(
    defaultInput?.to ?? DEMO_CONTRACTS.demoToken,
  );
  const [data, setData] = useState(defaultInput?.data ?? "0x");
  const [valueWei, setValueWei] = useState(defaultInput?.valueWei ?? "0");
  const [pageIntent, setPageIntent] = useState(defaultInput?.pageIntent ?? "");

  return (
    <form
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onScan({ to, data, valueWei, pageIntent });
      }}
    >
      <h2 className="text-xl font-semibold text-slate-900">Manual Scanner</h2>
      <p className="text-sm text-slate-600">
        Paste a contract target, calldata, and optional page intent to run
        SafeSign risk checks.
      </p>

      <label className="block text-sm font-medium text-slate-700">
        Contract address
        <input
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Calldata
        <textarea
          value={data}
          onChange={(event) => setData(event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-slate-500 focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Value (wei)
        <input
          value={valueWei}
          onChange={(event) => setValueWei(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Page intent label (optional)
        <input
          value={pageIntent}
          onChange={(event) => setPageIntent(event.target.value)}
          placeholder="e.g. Claim Reward"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Scan transaction
      </button>
    </form>
  );
}
