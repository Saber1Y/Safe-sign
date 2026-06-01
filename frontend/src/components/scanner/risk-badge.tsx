import type { RiskLevel } from "@/lib/risk/types";
import { cn } from "@/lib/utils";

const config: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  Low: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Low Risk",
  },
  Medium: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Medium Risk",
  },
  High: {
    bg: "bg-orange-50 border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-500",
    label: "High Risk",
  },
  Critical: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "Critical Risk",
  },
};

type RiskBadgeProps = {
  level: RiskLevel;
  size?: "sm" | "md";
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const c = config[level];
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        c.bg, c.text,
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
      )}
    >
      <span className={cn("rounded-full", dotSize, c.dot)} />
      {c.label}
    </span>
  );
}
