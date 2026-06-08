import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useSnapshots } from "@/hooks/useKpis";
import { Sparkline, detectDowntrend } from "@/components/diagnostics/Sparkline";
import { Plus, Camera, TrendingDown, ToggleLeft, ToggleRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/snapshots/")({
  component: SnapshotsPage,
});

function SnapshotsPage() {
  const { t, lang: l } = useLanguage();
  const { data: snapshots, isLoading } = useSnapshots();
  const [showTrends, setShowTrends] = useState(false);
  const [trendsOnly, setTrendsOnly] = useState(false);

  // Group snapshots by employee+KPI for trend analysis
  const trendData = useMemo(() => {
    if (!snapshots) return { rows: [], downtrends: 0 };

    // Group by employee_id + kpi_id
    const groups: Record<
      string,
      {
        employeeId: string;
        kpiId: string;
        employee: string;
        kpi: string;
        snapList: typeof snapshots;
      }
    > = {};

    for (const s of snapshots) {
      const emp = (s as Record<string, unknown>).employees as Record<string, unknown> | null;
      const kpi = (s as Record<string, unknown>).kpis as Record<string, unknown> | null;
      const key = `${s.employee_id}_${s.kpi_id}`;
      if (!groups[key]) {
        groups[key] = {
          employeeId: s.employee_id ?? "",
          kpiId: s.kpi_id ?? "",
          employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
          kpi: kpi ? `${kpi.name} (${kpi.code})` : "-",
          snapList: [],
        };
      }
      groups[key].snapList.push(s);
    }

    // Build rows with trend info
    let downtrends = 0;
    const rows = Object.values(groups).map((g) => {
      // Sort by date ascending for trend calc
      const sorted = [...g.snapList].sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
      );
      const actuals = sorted.map((s) => Number(s.actual_value ?? 0));
      const latest = sorted[sorted.length - 1];
      const isDown = detectDowntrend(actuals);
      if (isDown) downtrends++;

      return {
        id: latest.id,
        employee: g.employee,
        kpi: g.kpi,
        period: latest.period ?? "-",
        target: latest.target_value != null ? String(latest.target_value) : "-",
        actual: latest.actual_value != null ? String(latest.actual_value) : "-",
        gap: latest.gap_value != null ? String(latest.gap_value) : "-",
        gapPct:
          latest.gap_percentage != null ? `${Number(latest.gap_percentage).toFixed(1)}%` : "-",
        status: latest.status ?? "green",
        trendValues: actuals,
        isDowntrend: isDown,
        periodCount: sorted.length,
      };
    });

    return {
      rows: trendsOnly ? rows.filter((r) => r.isDowntrend) : rows,
      downtrends,
    };
  }, [snapshots, trendsOnly]);

  return (
    <div>
      <PageHeader
        title="Performance Snapshots"
        titleAr="لقطات الأداء"
        description="KPI measurements and gap tracking"
        descriptionAr="قياسات مؤشرات الأداء وتتبع الفجوات"
        currentLang={l}
        actions={
          <Link
            to="/snapshots/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 no-underline"
          >
            <Plus className="w-4 h-4" />
            {t("Record Snapshot", "تسجيل لقطة")}
          </Link>
        }
      />

      {/* Trend Analysis Toggle */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <button
          onClick={() => {
            setShowTrends(!showTrends);
            if (showTrends) setTrendsOnly(false);
          }}
          className="flex items-center gap-2 text-sm"
        >
          {showTrends ? (
            <ToggleRight className="w-5 h-5 text-blue-600" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
          <span className={showTrends ? "text-blue-700 font-medium" : "text-gray-500"}>
            {t("Trend Analysis", "تحليل الاتجاهات")}
          </span>
        </button>

        {showTrends && (
          <>
            <div className="h-4 border-l border-gray-300" />
            <button
              onClick={() => setTrendsOnly(!trendsOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                trendsOnly
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {t("Downtrends Only", "الاتجاهات الهابطة فقط")}
              {trendData.downtrends > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {trendData.downtrends}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">{t("Loading...", "جاري التحميل...")}</div>
        ) : trendData.rows.length === 0 ? (
          <div className="text-center py-12 text-gray-400 p-6">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {trendsOnly
                ? t(
                    "No downward trends detected. All KPIs are stable or improving.",
                    "لا توجد اتجاهات هابطة. جميع المؤشرات مستقرة أو في تحسن.",
                  )
                : t(
                    "No snapshots yet. Record your first performance measurement.",
                    "لا توجد لقطات بعد. سجّل أول قياس أداء.",
                  )}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Employee", "الموظف")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("KPI", "المؤشر")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Target", "الهدف")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Actual", "الفعلي")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Gap %", "% الفجوة")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Status", "الحالة")}
                </th>
                {showTrends && (
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    {t("Trend", "الاتجاه")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trendData.rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${row.isDowntrend && showTrends ? "bg-red-50/50 dark:bg-red-900/5" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{row.employee}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.kpi}</td>
                  <td className="px-4 py-3 text-center">{row.target}</td>
                  <td className="px-4 py-3 text-center font-medium">{row.actual}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-medium ${parseFloat(row.gapPct) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {row.gapPct}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={row.status} label={row.status} />
                  </td>
                  {showTrends && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkline values={row.trendValues} isDowntrend={row.isDowntrend} />
                        {row.isDowntrend && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                            <TrendingDown className="w-3 h-3" />
                            {t("Declining", "هابط")}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">{row.periodCount}p</span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
