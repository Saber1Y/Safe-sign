import type { RiskLevel } from "@/lib/risk/types";
import { cn } from "@/lib/utils";

const tone: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
};

type RiskBadgeProps = {
  level: RiskLevel;
};

export function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        tone[level],
      )}
    >
      {level} Risk
    </span>
  );
}

