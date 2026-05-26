# QIE SafeSign MVP Architecture

## Workspaces

- `frontend/`: Next.js app (landing, scanner, demo dApp, dashboard, developer mode, extension companion)
- `contracts/`: Hardhat project (DemoToken, DemoNFT, FakeRewardSpender, SafeSignRegistry)
- `backend/`: Express API scaffold (health + transaction explanation fallback endpoint)

## Demo Path

1. Generate a demo transaction in `frontend/src/app/demo-dapp`.
2. Open `frontend/src/app/scanner` with prefilled transaction params.
3. Decode calldata and evaluate risk rules in `frontend/src/lib/risk`.
4. Show risk warnings and recommendations.
5. Review risky approvals in `frontend/src/app/dashboard`.
