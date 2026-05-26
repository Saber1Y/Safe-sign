# QIE SafeSign Monorepo

QIE SafeSign is organized as a monorepo with separate apps for frontend, contracts, and backend.

## Structure

- `frontend/` Next.js app (scanner, demo dApp, dashboard, extension)
- `contracts/` Hardhat project (DemoToken, DemoNFT, FakeRewardSpender, SafeSignRegistry)
- `backend/` Express API scaffold (AI/rule explanation endpoint)
- `docs/` project documentation

## Quick Start

```bash
npm install
npm run dev:frontend
```

## Useful Commands

```bash
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run build:backend
npm run contracts:compile
npm run contracts:deploy:qie
```

## Environment

Copy `.env.example` and then split values as needed into each workspace:

- `frontend/.env.local`
- `contracts/.env`
- `backend/.env`
