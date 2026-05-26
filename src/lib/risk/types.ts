export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ActionKind =
  | "approve"
  | "transfer"
  | "transferFrom"
  | "setApprovalForAll"
  | "safeTransferFrom"
  | "mint"
  | "claim"
  | "swap"
  | "unknown";

export type ScanInput = {
  to: string;
  data: string;
  valueWei?: string;
  pageIntent?: string;
};

export type DecodedAction = {
  selector: string;
  functionName: string;
  actionKind: ActionKind;
  args: readonly unknown[];
};

export type RiskSignal = {
  code: string;
  level: RiskLevel;
  message: string;
};

export type ScanReport = {
  risk: RiskLevel;
  score: number;
  action: DecodedAction;
  signals: RiskSignal[];
  explanation: string;
  recommendation: string;
  immediateMovement: string;
  futureRisk: string;
};

