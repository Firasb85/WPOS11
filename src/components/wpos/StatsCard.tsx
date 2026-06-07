import { TrendingUp, TrendingDown, Minus } from "lucide-react";
type StatsCardProps = {
  title: string;
  titleAr?: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  status?: "good" | "warning" | "critical";
  size?: "sm" | "md" | "lg";
  currentLang?: "ar" | "en";
};

const sizeClasses = {
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function StatsCard({
  title,
  titleAr,
  value,
  change,
  icon,
  status,
  size = "md",
  currentLang = "en",
}: StatsCardProps) {
  const resolvedTitle = currentLang === "ar" && titleAr ? titleAr : title;

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow ${sizeClasses[size]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {resolvedTitle}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            {change !== undefined && (
              <span
                className={`flex items-center text-xs font-medium ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-500"}`}
              >
                {change > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : change < 0 ? (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div
            className={`p-3 rounded-lg ${status === "critical" ? "bg-red-100 dark:bg-red-900/30" : status === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
