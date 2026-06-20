/**
 * KpiStatusBar — segmented horizontal RAG bar.
 *
 * Shows the ratio of green : yellow : red KPIs as one bar with
 * per-segment counts underneath. Encapsulates the standard BI
 * pattern (Grafana, Looker, Tableau) for proportion + counts.
 *
 * Pass `total` explicitly if it differs from green + yellow + red
 * (e.g. there are unmeasured KPIs).
 */
export function KpiStatusBar({
  green,
  yellow,
  red,
  total,
  labels,
}: {
  green: number;
  yellow: number;
  red: number;
  total: number;
  labels: { good: string; warning: string; critical: string; total: string };
}) {
  const measured = green + yellow + red;
  const safeTotal = Math.max(total, measured, 1);
  const greenPct = (green / safeTotal) * 100;
  const yellowPct = (yellow / safeTotal) * 100;
  const redPct = (red / safeTotal) * 100;
  const measuredPct = (measured / safeTotal) * 100;
  return (
    <div className="space-y-3">
      {/* Segmented bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800 relative">
        {greenPct > 0 && (
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${greenPct}%` }}
            title={`${green} ${labels.good}`}
          />
        )}
        {yellowPct > 0 && (
          <div
            className="bg-amber-400 transition-all"
            style={{ width: `${yellowPct}%` }}
            title={`${yellow} ${labels.warning}`}
          />
        )}
        {redPct > 0 && (
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${redPct}%` }}
            title={`${red} ${labels.critical}`}
          />
        )}
        {/* Unmeasured zone indicator */}
        {measuredPct < 100 && (
          <div
            className="bg-gray-200 dark:bg-gray-700 transition-all"
            style={{ width: `${100 - measuredPct}%` }}
            title="unmeasured"
          />
        )}
      </div>
      {/* Counts row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xl font-bold text-green-700 dark:text-green-400 tabular-nums">
            {green}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-green-700 dark:text-green-400 font-semibold mt-0.5">
            {labels.good}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {yellow}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
            {labels.warning}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-xl font-bold text-red-700 dark:text-red-400 tabular-nums">
            {red}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-red-700 dark:text-red-400 font-semibold mt-0.5">
            {labels.critical}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        {labels.total}: {total}
      </p>
    </div>
  );
}
