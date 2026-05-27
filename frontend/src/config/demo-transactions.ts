import { encodeFunctionData, parseAbi } from "viem";
import { DEMO_CONTRACTS, demoRecipient } from "@/config/contracts";

const demoAbi = parseAbi([
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
  "function setApprovalForAll(address operator,bool approved)",
]);

export const demoTransactions = [
  {
    id: "safe-transfer",
    title: "Safe Transfer",
    description: "Normal token transfer to another address.",
    to: DEMO_CONTRACTS.demoToken,
    intent: "send",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "transfer",
      args: [demoRecipient, 5n * 10n ** 18n],
    }),
  },
  {
    id: "normal-approval",
    title: "Normal Approval",
    description: "Limited token approval for known demo spender.",
    to: DEMO_CONTRACTS.demoToken,
    intent: "approve",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [DEMO_CONTRACTS.safeSpender, 100n * 10n ** 18n],
    }),
  },
  {
    id: "unlimited-approval",
    title: "Unlimited Approval",
    description: "Unlimited token approval to unknown spender.",
    to: DEMO_CONTRACTS.demoToken,
    intent: "approve",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [DEMO_CONTRACTS.fakeRewardSpender, 2n ** 256n - 1n],
    }),
  },
  {
    id: "fake-claim",
    title: "Fake Claim Reward",
    description: "Page says claim, but tx is an unlimited approval.",
    to: DEMO_CONTRACTS.demoToken,
    intent: "claim reward",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "approve",
      args: [DEMO_CONTRACTS.fakeRewardSpender, 2n ** 256n - 1n],
    }),
  },
  {
    id: "nft-approval-for-all",
    title: "NFT Approval-For-All",
    description: "Grants NFT operator full collection control.",
    to: DEMO_CONTRACTS.demoNft,
    intent: "list nft",
    data: encodeFunctionData({
      abi: demoAbi,
      functionName: "setApprovalForAll",
      args: [DEMO_CONTRACTS.fakeRewardSpender, true],
    }),
  },
] as const;
