"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  return (
    <div className="shrink-0">
      <ConnectButton accountStatus="address" showBalance={false} />
    </div>
  );
}

