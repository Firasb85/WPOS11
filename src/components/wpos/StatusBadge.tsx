interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: "sm" | "md";
}

const COLOR_MAP: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
  yellow: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
  red: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

export function StatusBadge({ status, label, size = "sm" }: StatusBadgeProps) {
  const colorClass = COLOR_MAP[status.toLowerCase()] ?? COLOR_MAP.gray;
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded font-semibold uppercase tracking-wider ${colorClass} ${sizeClass}`}>
      {label ?? status}
    </span>
  );
}
