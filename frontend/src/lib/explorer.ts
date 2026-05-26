const explorerBase =
  process.env.NEXT_PUBLIC_QIE_EXPLORER_URL ??
  "https://testnet-explorer.qie.example";

export function explorerAddressUrl(address: string) {
  return `${explorerBase}/address/${address}`;
}

export function explorerTxUrl(hash: string) {
  return `${explorerBase}/tx/${hash}`;
}

