import type { DecodedAction, RiskSignal } from "./types";

function actionMessage(action: DecodedAction) {
  switch (action.actionKind) {
    case "approve":
      return "This call sets token spending permission for another contract.";
    case "transfer":
      return "This call transfers tokens directly to the recipient now.";
    case "transferFrom":
      return "This call moves tokens from one wallet to another using prior approval.";
    case "setApprovalForAll":
      return "This call grants an operator control over all NFTs in a collection.";
    case "safeTransferFrom":
      return "This call transfers an NFT to another address.";
    case "mint":
      return "This call requests minting from the contract.";
    case "claim":
      return "This call requests claiming rewards or assets.";
    case "swap":
      return "This call performs a token swap through a router.";
    default:
      return "SafeSign could not fully decode this function.";
  }
}

export function buildExplanation(
  action: DecodedAction,
  signals: RiskSignal[],
): string {
  const message = actionMessage(action);

  if (signals.length === 0) {
    return `${message} No major risk rules were triggered for this transaction.`;
  }

  return `${message} Key warning: ${signals[0].message}`;
}

