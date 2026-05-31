import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet";

const features = [
  {
    title: "Transaction Scanner",
    desc: "Paste any calldata and get a plain-English breakdown before you sign.",
    href: "/scanner",
  },
  {
    title: "Risk Detection",
    desc: "Unlimited approvals, intent mismatches, NFT operator grants — caught instantly.",
    href: "/scanner",
  },
  {
    title: "Approval Dashboard",
    desc: "Review and revoke existing token & NFT approvals in one place.",
    href: "/dashboard",
  },
];

export default function Home() {
  return (
    <section className="grid gap-10">
      <div className="rounded-3xl border border-white/30 bg-[radial-gradient(circle_at_10%_20%,rgba(255,245,215,0.9),rgba(255,255,255,0.92)_45%,rgba(231,246,255,0.9)_80%)] p-8 shadow-[0_20px_80px_rgba(16,36,54,0.12)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
          QIE SafeSign
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Know what you sign before you sign.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          SafeSign decodes wallet actions, detects risky approvals, explains
          transactions in plain English, and lets you revoke dangerous
          permissions — all before anything goes wrong.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/scanner"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open Scanner
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
          >
            View Dashboard
          </Link>
          <ConnectWalletButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-sky-700">
              {f.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
