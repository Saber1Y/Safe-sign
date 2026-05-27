# QIE SafeSign MVP Architecture

## Workspaces

- `frontend/`: Next.js app (landing, scanner, demo dApp, dashboard, developer mode, extension companion)
- `contracts/`: Hardhat project (DemoToken, DemoNFT, DemoSafeSpender, FakeRewardSpender, SafeSignRegistry)
- `backend/`: Express API scaffold (health + transaction explanation fallback endpoint)

## Wallet Layer

- `frontend` uses Privy (`@privy-io/react-auth`) for wallet connect UX.
- `frontend` uses `@privy-io/wagmi` + wagmi hooks for contract reads/writes.

## Address Source

- Deployment script exports canonical addresses to:
- `contracts/deployments/qieTestnet.json`
- `frontend/src/config/generated/deployment.ts`
- Frontend can override through `NEXT_PUBLIC_*` env variables.

## Demo Path

1. Generate a demo transaction in `frontend/src/app/demo-dapp`.
2. Open `frontend/src/app/scanner` with prefilled transaction params.
3. Decode calldata and evaluate risk rules in `frontend/src/lib/risk`.
4. Show risk warnings and recommendations.
5. Review live risky approvals in `frontend/src/app/dashboard` and revoke on-chain.
