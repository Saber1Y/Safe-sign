import type { ScanInput, ScanReport } from "@/lib/risk/types";

const STORAGE_KEY = "qie_safesign_history";
const MAX_ENTRIES = 50;

export type HistoryEntry = {
  id: string;
  timestamp: number;
  input: ScanInput;
  report: ScanReport;
};

export function getScanHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addScanToHistory(
  input: ScanInput,
  report: ScanReport,
): HistoryEntry[] {
  const history = getScanHistory();
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    input,
    report,
  };
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* storage full or unavailable */
  }
  return updated;
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
