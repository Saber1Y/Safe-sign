# QIE SafeSign MVP Architecture

## Layers

- **Web app (`src/app`)**: landing, scanner, demo dApp, approvals dashboard, developer mode.
- **Risk engine (`src/lib/risk`)**: selector decoding, scoring rules, explanation output.
- **Contracts (`contracts`)**: demo ERC-20, demo ERC-721, fake spender, optional registry.
- **Deploy scripts (`scripts`)**: Hardhat deployment to QIE testnet.
- **Extension (`extension`)**: basic MV3 companion popup/content/background scripts.

## Demo path

1. Generate demo transaction in `/demo-dapp`.
2. Open `/scanner` with transaction params.
3. Decode calldata and evaluate risk rules.
4. Display warnings and recommended actions.
5. Review risky approvals in `/dashboard`.

