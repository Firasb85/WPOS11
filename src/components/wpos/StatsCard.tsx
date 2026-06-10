import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  titleAr?: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  status?: "good" | "warning" | "critical";
  currentLang?: string;
  size?: "sm" | "md";
  [key: string]: unknown;
}

const statusColors = {
  good: { border: "border-l-emerald-500", icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", value: "text-emerald-700 dark:text-emerald-400" },
  warning: { border: "border-l-amber-500", icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", value: "text-amber-700 dark:text-amber-400" },
  critical: { border: "border-l-red-500", icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400", value: "text-red-700 dark:text-red-400" },
};

const defaultColors = {
  border: "border-l-blue-600",
  icon: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  value: "text-gray-900 dark:text-white",
};

export function StatsCard({ title, value, change, icon, status, size = "md" }: StatsCardProps) {
  const colors = status ? statusColors[status] : defaultColors;
  const compact = size === "sm";

  return (
    <div className={`bg-white dark:bg-[#111822] rounded-lg border border-gray-200 dark:border-[#1e2836] border-l-4 ${colors.border} ${compact ? "p-3" : "p-4"} flex items-center gap-3 shadow-sm hover:shadow transition-shadow`}>
      {icon && (
        <div className={`${compact ? "w-9 h-9" : "w-11 h-11"} rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className={`${compact ? "text-xl" : "text-2xl"} font-bold ${colors.value} tracking-tight leading-tight`}>{value}</p>
          {change !== undefined && change !== 0 && (
            <span className={`text-xs font-semibold ${change > 0 ? "text-emerald-600" : "text-red-600"}`}>
              {change > 0 ? "▲" : "▼"} {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
