import { Suspense } from "react";
import { ScannerClient } from "@/components/scanner/scanner-client";

export default function ScannerPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading scanner...
        </div>
      }
    >
      <ScannerClient />
    </Suspense>
  );
}

