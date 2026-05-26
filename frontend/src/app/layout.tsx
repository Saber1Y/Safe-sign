import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { WalletProvider } from "@/components/wallet/wallet-provider";

export const metadata: Metadata = {
  title: "QIE SafeSign",
  description: "Know what you sign before you sign.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <WalletProvider>
          <Navbar />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
