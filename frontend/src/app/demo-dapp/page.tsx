import Link from "next/link";
import { demoTransactions } from "@/config/demo-transactions";

export default function DemoDappPage() {
  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Demo dApp
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Simulate safe and risky transaction intents, then send each payload to
          the scanner.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {demoTransactions.map((transaction) => (
          <article
            key={transaction.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {transaction.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{transaction.description}</p>
            <Link
              href={`/scanner?to=${transaction.to}&data=${transaction.data}&intent=${encodeURIComponent(transaction.intent)}&valueWei=0`}
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Scan Before Signing
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

