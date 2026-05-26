"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ReportCard } from "@/components/scanner/report-card";
import { ScanForm } from "@/components/scanner/scan-form";
import { useSafeSignScanner } from "@/hooks/use-safe-sign-scanner";

export function ScannerClient() {
  const params = useSearchParams();
  const { report, input, scan } = useSafeSignScanner();

  const defaultInput = useMemo(
    () => ({
      to: params.get("to") ?? "0x1111111111111111111111111111111111111111",
      data: params.get("data") ?? "0x",
      pageIntent: params.get("intent") ?? "",
      valueWei: params.get("valueWei") ?? "0",
    }),
    [params],
  );

  useEffect(() => {
    if (params.get("data")) {
      scan(defaultInput);
    }
  }, [defaultInput, params, scan]);

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Transaction Scanner
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Paste calldata or use the demo dApp flow to decode actions and get a
          pre-sign risk report.
        </p>
      </header>

      <ScanForm onScan={scan} defaultInput={defaultInput} />
      {report && input ? <ReportCard report={report} input={input} /> : null}
    </section>
  );
}

