import { AlertTriangle, TrendingDown, Minus, TrendingUp } from "lucide-react";

interface AtRiskBadgeProps {
  probability: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  trend?: "worsening" | "stable" | "improving";
  size?: "sm" | "md";
}

const RISK_COLORS = {
  critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  medium:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "worsening") return <TrendingDown className="w-3 h-3" />;
  if (trend === "improving") return <TrendingUp className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export function AtRiskBadge({ probability, riskLevel, trend, size = "sm" }: AtRiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-full font-medium ${RISK_COLORS[riskLevel]} ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}
      title={`${probability}% breach probability${trend ? ` (${trend})` : ""}`}
    >
      <AlertTriangle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {probability}%{trend && <TrendIcon trend={trend} />}
    </span>
  );
}
