# QIE SafeSign MVP

Know what you sign before you sign.

QIE SafeSign is a transaction safety layer for QIE that decodes wallet actions, detects risky approvals, explains transactions in plain English, and helps users avoid dangerous contract interactions before signing.

## Stack

- Next.js + TypeScript + Tailwind CSS
- wagmi + viem + RainbowKit
- Rule-based risk engine
- Solidity + Hardhat + OpenZeppelin
- Chrome extension (Manifest V3) companion

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run contracts:compile
npm run contracts:deploy:qie
```

## Folder structure

```txt
src/
  app/
    page.tsx                # Landing
    scanner/page.tsx        # Manual scan + report
    demo-dapp/page.tsx      # Demo flow buttons
    dashboard/page.tsx      # Approval dashboard
    developer/page.tsx      # Dev mode entry
  components/
    layout/                 # Navbar
    wallet/                 # Wallet providers/connect button
    scanner/                # Scan form + report components
    dashboard/              # Approval table component
  config/
    chains.ts               # QIE chain config
    labels.ts               # Contract labels
    demo-transactions.ts    # Demo calldata payloads
  lib/
    decode/                 # ABI fragments + selector map + decoder
    risk/                   # Rules + scoring + explanation
contracts/                  # DemoToken, DemoNFT, FakeRewardSpender, Registry
scripts/                    # Hardhat deployment scripts
extension/                  # Chrome extension skeleton
docs/                       # Architecture notes
```
