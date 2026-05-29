import { Suspense } from "react";
import { CustomAbiScanner } from "@/components/developer/custom-abi-scanner";

export default function DeveloperPage() {
  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Developer Mode
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Test custom ABI fragments and calldata to decode transactions and
          review generated risk recommendations.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Loading developer tools...
          </div>
        }
      >
        <CustomAbiScanner />
      </Suspense>
    </section>
  );
}
