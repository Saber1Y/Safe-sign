import { deployment } from "@/config/generated/deployment";

function asHexAddress(value: string): `0x${string}` {
  if (value.startsWith("0x")) return value as `0x${string}`;
  return `0x${value}` as `0x${string}`;
}

function envAddress(key: string, fallback: `0x${string}`) {
  const value = process.env[key];
  return value ? asHexAddress(value) : fallback;
}

export const DEMO_CONTRACTS = {
  demoToken: envAddress(
    "NEXT_PUBLIC_DEMO_TOKEN_ADDRESS",
    deployment.contracts.demoToken,
  ),
  demoNft: envAddress("NEXT_PUBLIC_DEMO_NFT_ADDRESS", deployment.contracts.demoNft),
  safeSpender: envAddress(
    "NEXT_PUBLIC_SAFE_SPENDER_ADDRESS",
    deployment.contracts.safeSpender,
  ),
  fakeRewardSpender: envAddress(
    "NEXT_PUBLIC_FAKE_REWARD_SPENDER_ADDRESS",
    deployment.contracts.fakeRewardSpender,
  ),
  registry: envAddress("NEXT_PUBLIC_REGISTRY_ADDRESS", deployment.contracts.registry),
} as const;

export const demoRecipient: `0x${string}` = envAddress(
  "NEXT_PUBLIC_DEMO_RECIPIENT_ADDRESS",
  "0x6666666666666666666666666666666666666666" as `0x${string}`,
);
