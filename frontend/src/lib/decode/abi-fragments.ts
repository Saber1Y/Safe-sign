import { parseAbi } from "viem";

export const safeSignAbiFragments = parseAbi([
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
  "function transferFrom(address from,address to,uint256 amount)",
  "function setApprovalForAll(address operator,bool approved)",
  "function safeTransferFrom(address from,address to,uint256 tokenId)",
  "function mint()",
  "function claim()",
  "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline)",
]);

