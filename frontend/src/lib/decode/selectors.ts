import { toFunctionSelector } from "viem";
import type { ActionKind } from "@/lib/risk/types";

export const selectorMap: Record<string, ActionKind> = {
  [toFunctionSelector("approve(address,uint256)")]: "approve",
  [toFunctionSelector("transfer(address,uint256)")]: "transfer",
  [toFunctionSelector("transferFrom(address,address,uint256)")]: "transferFrom",
  [toFunctionSelector("setApprovalForAll(address,bool)")]: "setApprovalForAll",
  [toFunctionSelector("safeTransferFrom(address,address,uint256)")]:
    "safeTransferFrom",
  [toFunctionSelector("mint()")]: "mint",
  [toFunctionSelector("claim()")]: "claim",
  [toFunctionSelector(
    "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
  )]: "swap",
};

