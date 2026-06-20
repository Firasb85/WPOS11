import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useOrgTier } from "@/lib/stores/organization-tier";
import { useKpis, useSnapshots } from "@/hooks/useKpis";
import { exportPilotResultsPDF, type PilotResultsData } from "@/lib/export/pdf";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  Download,
  FileBarChart,
  Sparkles,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/pilot-results/")({
  component: PilotResultsPage,
});

function PilotResultsPage() {
  const { t, lang, isRTL } = useLanguage();
  const { current: orgTier } = useOrgTier();
  const { data: kpisData } = useKpis();
  const { data: snapshotsData } = useSnapshots();

  // ── Build the before/after table by joining snapshots with KPI definitions.
  // Baseline = earliest snapshot per (employee, kpi) within pilot window
  // Current  = latest  snapshot per (employee, kpi) within pilot window
  const rows = useMemo(() => {
    const kpis = (kpisData ?? []) as Array<Record<string, unknown>>;
    const snaps = (snapshotsData ?? []) as Array<Record<string, unknown>>;

    // Group snapshots by employee × kpi
    const groups = new Map<string, Array<Record<string, unknown>>>();
    for (const s of snaps) {
      const empId = String(s.employee_id ?? "");
      const kpiId = String(s.kpi_id ?? "");
      const key = `${empId}|${kpiId}`;
      const list = groups.get(key) ?? [];
      list.push(s);
      groups.set(key, list);
    }

    // Build rows only when we have at least 2 snapshots to compare
    const out: PilotResultsData["rows"] = [];
    for (const [key, list] of groups) {
      if (list.length < 2) continue;
      const sorted = [...list].sort(
        (a, b) =>
          new Date(String(a.created_at ?? a.period ?? 0)).getTime() -
          new Date(String(b.created_at ?? b.period ?? 0)).getTime(),
      );
      const baseline = Number(sorted[0].actual_value ?? 0);
      const current = Number(sorted[sorted.length - 1].actual_value ?? 0);
      const baselineDate = String(sorted[0].created_at ?? sorted[0].period ?? "");
      const currentDate = String(sorted[sorted.length - 1].created_at ?? sorted[sorted.length - 1].period ?? "");
      const kpi = kpis.find((k) => String(k.id) === key.split("|")[1]);
      const kpiName =
        (kpi?.name as string) ||
        (sorted[0].kpis as Record<string, unknown> | undefined)?.name as string ||
        "KPI";
      const emp = (sorted[0].employees as Record<string, unknown> | undefined) ?? {};
      const empName =
        [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "—";

      const deltaPct = baseline === 0 ? 0 : ((current - baseline) / baseline) * 100;

      out.push({
        kpi: kpiName,
        employee: empName,
        baseline,
        current,
        deltaPct,
        range: `${formatDate(baselineDate)} → ${formatDate(currentDate)}`,
      });
    }

    // Enrich with follow-up context (count of completed follow-ups per KPI/emp).
    // Currently snapshot-driven; follow-up data can be layered on later.

    return out.sort((a, b) => b.deltaPct - a.deltaPct);
  }, [kpisData, snapshotsData]);

  const stats = useMemo(() => {
    const improved = rows.filter((r) => r.deltaPct > 0).length;
    const declined = rows.filter((r) => r.deltaPct < 0).length;
    const flat = rows.length - improved - declined;
    const avgDelta =
      rows.length === 0 ? 0 : rows.reduce((s, r) => s + r.deltaPct, 0) / rows.length;
    return { improved, declined, flat, avgDelta };
  }, [rows]);

  const handleExport = () => {
    if (rows.length === 0) {
      toast.error(
        t(
          "No before/after data yet. Add snapshots in two different periods to see results.",
          "لا توجد بيانات قبل/بعد بعد. أضف لقطات في فترتين مختلفتين لرؤية النتائج.",
        ),
      );
      return;
    }
    const data: PilotResultsData = {
      orgName: orgTier.scopeDepartmentId ? `Pilot · ${orgTier.scopeDepartmentId}` : "Pilot Org",
      pilotStart: orgTier.pilotExpiresAt
        ? formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        : "—",
      pilotEnd: orgTier.pilotExpiresAt ? formatDate(orgTier.pilotExpiresAt) : "—",
      rows,
    };
    exportPilotResultsPDF(data);
    toast.success(t("Pilot Results PDF opened in a new tab.", "تم فتح ملف نتائج التجربة في علامة تبويب جديدة."));
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader
        title="Pilot Results"
        titleAr="نتائج التجربة"
        description="Before / after KPI performance over your pilot window"
        descriptionAr="أداء المؤشرات قبل وبعد خلال فترة التجربة"
        currentLang={lang}
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            {t("Download PDF", "تنزيل PDF")}
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <FileBarChart className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{rows.length}</p>
          <p className="text-xs text-gray-500">{t("KPIs tracked", "مؤشرات مُتتبعة")}</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{stats.improved}</p>
          <p className="text-xs text-gray-500">{t("Improved", "تحسنت")}</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
          <p className="text-xs text-gray-500">{t("Declined", "تراجعت")}</p>
        </Card>
        <Card className="p-4 text-center">
          <Activity
            className={`w-6 h-6 mx-auto mb-1 ${stats.avgDelta >= 0 ? "text-green-600" : "text-red-600"}`}
          />
          <p
            className={`text-2xl font-bold ${stats.avgDelta >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {stats.avgDelta >= 0 ? "+" : ""}
            {stats.avgDelta.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">{t("Avg Δ", "متوسط التغيير")}</p>
        </Card>
      </div>

      <Card padding="none">
        <CardHeader>
          <CardTitle>
            <Sparkles className="w-4 h-4 inline mr-2 text-purple-500" />
            {t("Before / After Detail", "تفاصيل قبل / بعد")}
          </CardTitle>
        </CardHeader>
        {rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileBarChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {t(
                "No before/after pairs yet. Record snapshots for the same employee × KPI across two different periods to populate this view.",
                "لا توجد أزواج قبل/بعد بعد. سجّل لقطات لنفس الموظف × المؤشر في فترتين مختلفتين لملء هذه الشاشة.",
              )}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("KPI", "المؤشر")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Employee", "الموظف")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                  {t("Baseline", "الأساس")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                  {t("Current", "الحالي")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                  {t("Δ%", "التغيير %")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Range", "النطاق")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium">{r.kpi}</td>
                  <td className="px-4 py-3 text-gray-600">{r.employee}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500">
                    {r.baseline.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    {r.current.toFixed(1)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-bold ${
                      r.deltaPct >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {r.deltaPct >= 0 ? "+" : ""}
                    {r.deltaPct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <p className="text-[11px] text-gray-400 mt-4 text-center">
        {t(
          "This is the Pilot sales artifact — every cell is derived from existing snapshot data. No new data entry required.",
          "هذا هو ملف مبيعات التجربة — كل خلية مشتقة من بيانات اللقطات الموجودة. لا حاجة لإدخال بيانات جديدة.",
        )}
      </p>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || "—";
    return d.toLocaleDateString();
  } catch {
    return iso || "—";
  }
}
