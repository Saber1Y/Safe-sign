import { encodeFunctionData, parseAbi } from "viem";

const demoAbi = parseAbi([
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
  "function setApprovalForAll(address operator,bool approved)",
]);

const ADDRESSES = {
  token: "0x1111111111111111111111111111111111111111",
  nft: "0x2222222222222222222222222222222222222222",
  safeSpender: "0x3333333333333333333333333333333333333333",
  riskySpender: "0x4444444444444444444444444444444444444444",
  recipient: "0x6666666666666666666666666666666666666666",
} as const;

export const demoTransactions = [
  {
    id: "safe-transfer",
    title: "Safe Transfer",
    description: "Normal token transfer to another address.",
    to: ADDRESSES.token,
    intent: "send",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "transfer",
      args: [ADDRESSES.recipient, 5n * 10n ** 18n],
    }),
  },
  {
    id: "normal-approval",
    title: "Normal Approval",
    description: "Limited token approval for known demo spender.",
    to: ADDRESSES.token,
    intent: "approve",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [ADDRESSES.safeSpender, 100n * 10n ** 18n],
    }),
  },
  {
    id: "unlimited-approval",
    title: "Unlimited Approval",
    description: "Unlimited token approval to unknown spender.",
    to: ADDRESSES.token,
    intent: "approve",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [ADDRESSES.riskySpender, 2n ** 256n - 1n],
    }),
  },
  {
    id: "fake-claim",
    title: "Fake Claim Reward",
    description: "Page says claim, but tx is an unlimited approval.",
    to: ADDRESSES.token,
    intent: "claim reward",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [ADDRESSES.riskySpender, 2n ** 256n - 1n],
    }),
  },
  {
    id: "nft-approval-for-all",
    title: "NFT Approval-For-All",
    description: "Grants NFT operator full collection control.",
    to: ADDRESSES.nft,
    intent: "list nft",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "setApprovalForAll",
      args: [ADDRESSES.riskySpender, true],
    }),
  },
] as const;

