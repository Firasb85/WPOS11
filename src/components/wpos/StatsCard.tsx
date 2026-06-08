import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  status?: "good" | "warning" | "critical";
  currentLang?: string;
}

const statusStyles = {
  good: "from-green-50 to-emerald-50 border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800/30",
  warning:
    "from-yellow-50 to-amber-50 border-yellow-100 dark:from-yellow-900/10 dark:to-amber-900/10 dark:border-yellow-800/30",
  critical:
    "from-red-50 to-rose-50 border-red-100 dark:from-red-900/10 dark:to-rose-900/10 dark:border-red-800/30",
};

const iconStyles = {
  good: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  critical: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
};

export function StatsCard({ title, value, change, icon, status }: StatsCardProps) {
  const bgClass = status
    ? statusStyles[status]
    : "from-white to-gray-50/50 border-gray-100 dark:from-gray-900 dark:to-gray-800/50 dark:border-gray-800";
  const iconClass = status
    ? iconStyles[status]
    : "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} rounded-2xl border p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
          {change !== undefined && change !== 0 && (
            <p
              className={`text-xs font-medium mt-1.5 ${change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
