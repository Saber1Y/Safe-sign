import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createPublicClient, decodeFunctionData, http, parseAbi, type Hex } from "viem";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const rpcUrl = process.env.QIE_RPC_URL ?? "https://testnet-rpc.qie.example";

app.use(cors());
app.use(express.json({ limit: "128kb" }));

const publicClient = createPublicClient({
  transport: http(rpcUrl),
});

const KNOWN_ABIS = parseAbi([
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
  "function transferFrom(address from,address to,uint256 amount)",
  "function setApprovalForAll(address operator,bool approved)",
  "function safeTransferFrom(address from,address to,uint256 tokenId)",
  "function mint()",
  "function claim()",
  "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline)",
]);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "qie-safesign-backend" });
});

app.post("/decode", (req, res) => {
  const { data } = req.body ?? {};
  if (!data || typeof data !== "string") {
    res.status(400).json({ error: "Missing or invalid 'data' field (hex calldata)." });
    return;
  }

  const selector = data.startsWith("0x") && data.length >= 10
    ? data.slice(0, 10).toLowerCase()
    : "0x00000000";

  try {
    const decoded = decodeFunctionData({
      abi: KNOWN_ABIS,
      data: data as Hex,
    });
    res.json({
      selector,
      functionName: decoded.functionName,
      args: decoded.args?.map((a) => String(a)) ?? [],
      source: "backend",
    });
  } catch {
    res.json({
      selector,
      functionName: "unknown",
      args: [],
      source: "backend",
    });
  }
});

app.post("/explain", (req, res) => {
  const { action = "unknown", risk = "Medium" } = req.body ?? {};

  const explanations: Record<string, string> = {
    approve: "This transaction sets a token spending permission for another contract. If the approval amount is unlimited, the spender can drain all your tokens.",
    transfer: "This transaction sends tokens directly to a recipient. No future recurring access is granted.",
    transferFrom: "This transaction moves tokens from one address to another using a prior approval.",
    setApprovalForAll: "This transaction grants an operator full control over all NFTs in a collection. They can transfer any of your NFTs at any time.",
    safeTransferFrom: "This transaction sends a specific NFT to another address.",
    mint: "This transaction requests minting new tokens or NFTs from the contract.",
    claim: "This transaction claims rewards or assets from a distributor contract.",
    swap: "This transaction swaps tokens through a decentralized exchange router.",
  };

  const recommendations: Record<string, string> = {
    Low: "Looks normal based on current checks. Continue with standard caution.",
    Medium: "Review the contract identity, function, and amount before signing.",
    High: "Proceed only if this spender and action are expected and intentional.",
    Critical: "Reject this transaction unless you fully trust the contract and understand all impacts.",
  };

  res.json({
    explanation: explanations[action.toLowerCase()] ?? `SafeSign could not fully decode this function.`,
    recommendation: recommendations[risk] ?? "Review carefully before signing.",
    risk,
    action,
    source: "backend",
    fallback: false,
  });
});

app.listen(port, () => {
  console.log(`QIE SafeSign backend listening on port ${port}`);
});
