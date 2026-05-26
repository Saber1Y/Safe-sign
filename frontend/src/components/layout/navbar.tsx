import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet";

const links = [
  { href: "/", label: "Landing" },
  { href: "/scanner", label: "Scanner" },
  { href: "/demo-dapp", label: "Demo dApp" },
  { href: "/dashboard", label: "Approvals" },
  { href: "/developer", label: "Developer Mode" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold tracking-tight text-slate-900">
          QIE SafeSign
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
