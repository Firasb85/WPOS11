interface MaturityBadgeProps {
  level: number;
  confidenceScore?: number;
  evidenceScore?: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  currentLang?: "ar" | "en";
}

const levelColors: Record<number, string> = {
  1: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400",
  2: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400",
  3: "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400",
  4: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400",
  5: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const levelNames: Record<number, { en: string; ar: string }> = {
  1: { en: "KPI Data Only", ar: "بيانات مؤشرات فقط" },
  2: { en: "KPI + Evidence", ar: "مؤشرات + أدلة" },
  3: { en: "+ Trends", ar: "+ اتجاهات" },
  4: { en: "+ Manager Validation", ar: "+ تحقق مدير" },
  5: { en: "Full Maturity", ar: "نضج كامل" },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export function MaturityBadge({
  level,
  confidenceScore,
  evidenceScore,
  size = "md",
  showDetails = false,
  currentLang = "ar",
}: MaturityBadgeProps) {
  const name = currentLang === "ar" ? levelNames[level]?.ar : levelNames[level]?.en;
  return (
    <div className="space-y-2">
      <div
        className={`inline-flex items-center gap-2 rounded-full border font-medium ${levelColors[level]} ${sizeClasses[size]}`}
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/50 dark:bg-black/20 text-xs font-bold">
          {level}
        </span>
        <span>
          L{level} — {name}
        </span>
      </div>
      {showDetails && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {confidenceScore !== undefined && (
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-lg font-bold text-blue-600">{confidenceScore}%</p>
              <p className="text-[10px] text-gray-500">
                {currentLang === "ar" ? "ثقة" : "Confidence"}
              </p>
            </div>
          )}
          {evidenceScore !== undefined && (
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{evidenceScore}%</p>
              <p className="text-[10px] text-gray-500">
                {currentLang === "ar" ? "أدلة" : "Evidence"}
              </p>
            </div>
          )}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-4 rounded-sm ${i <= level ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {currentLang === "ar" ? "النضج" : "Maturity"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
