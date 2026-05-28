"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getScanHistory, clearScanHistory, type HistoryEntry } from "@/lib/scan-history";
import { RiskBadge } from "./risk-badge";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function shortAddress(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

type ScanHistoryProps = {
  onRestore: (entry: HistoryEntry) => void;
};

export function ScanHistory({ onRestore }: ScanHistoryProps) {
  const history = useSyncExternalStore(subscribeToStorage, getScanHistory, () => []);

  const handleClear = useCallback(() => {
    clearScanHistory();
    window.dispatchEvent(new Event("storage"));
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Scan History ({history.length})
        </h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Clear
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {history.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onRestore(entry)}
            className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm transition hover:bg-slate-50"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-900">
                {entry.report.action.functionName}
              </span>
              <span className="ml-2 font-mono text-xs text-slate-500">
                {shortAddress(entry.input.to)}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-slate-400">
                {relativeTime(entry.timestamp)}
              </span>
              <RiskBadge level={entry.report.risk} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
