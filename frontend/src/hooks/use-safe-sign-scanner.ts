"use client";

import { useCallback, useState } from "react";
import { scanTransaction } from "@/lib/risk/engine";
import { addScanToHistory } from "@/lib/scan-history";
import type { ScanInput, ScanReport } from "@/lib/risk/types";

export function useSafeSignScanner() {
  const [report, setReport] = useState<ScanReport | null>(null);
  const [input, setInput] = useState<ScanInput | null>(null);

  const scan = useCallback((nextInput: ScanInput) => {
    const nextReport = scanTransaction(nextInput);
    setInput(nextInput);
    setReport(nextReport);
    addScanToHistory(nextInput, nextReport);
    return nextReport;
  }, []);

  return { report, input, scan };
}
