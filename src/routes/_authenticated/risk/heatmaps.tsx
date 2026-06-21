import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useSnapshots } from "@/hooks/useKpis";
import { useEmployeesList, useDepartments } from "@/hooks/useOrganization";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { AlertTriangle, Grid3x3, TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/risk/heatmaps")({
  component: RiskHeatmapsPage,
});

function RiskHeatmapsPage() {
  const { lang: l } = useLanguage();
  const { data: snapshots, isLoading } = useSnapshots();
  const { data: empData } = useEmployeesList();
  const { data: deptsData } = useDepartments();

  const allSnaps = snapshots ?? [];
  const departments = deptsData ?? [];
  const employees = empData?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* Performance risk: employees × snapshot status */
  const empRisk = employees
    .slice(0, 10)
    .map((e) => {
      const empSnaps = allSnaps.filter((s) =>
        (
          ((s as unknown as Record<string, Record<string, string>>).employees?.first_name ?? "") +
          " " +
          ((s as unknown as Record<string, Record<string, string>>).employees?.last_name ?? "")
        )?.includes(e.first_name),
      );
      const redCount = empSnaps.filter((s) => s.status === "red").length;
      const yellowCount = empSnaps.filter((s) => s.status === "yellow").length;
      const score = Math.min(100, redCount * 30 + yellowCount * 15);
      return {
        name: `${e.first_name} ${e.last_name}`,
        score,
        reds: redCount,
        yellows: yellowCount,
        greens: empSnaps.filter((s) => s.status === "green").length,
      };
    })
    .sort((a, b) => b.score - a.score);

  /* Department aggregation (live data) */
  const deptAgg = departments.map((d) => {
    const count = allSnaps.length > 0 
      ? allSnaps.filter(s => 
          (s as any).departments?.name === d.name || 
          (s as any).department_id === d.id
        ).length 
      : 0;
    return { name: d.name, score: count };
  });

  /* KPI risk — which KPIs have most red snapshots */
  const kpiRisk: Record<string, { red: number; yellow: number; green: number }> = {};
  for (const s of allSnaps) {
    const name = (s as unknown as Record<string, Record<string, string>>).kpis?.name ?? "Unknown";
    if (!kpiRisk[name]) kpiRisk[name] = { red: 0, yellow: 0, green: 0 };
    if (s.status === "red") kpiRisk[name].red++;
    else if (s.status === "yellow") kpiRisk[name].yellow++;
    else kpiRisk[name].green++;
  }

  const kpiRows = Object.entries(kpiRisk)
    .map(([name, counts]) => ({
      name,
      ...counts,
      total: counts.red + counts.yellow + counts.green,
    }))
    .sort((a, b) => b.red - a.red);

  const cellColor = (score: number) =>
    score >= 60
      ? "bg-red-500 text-white"
      : score >= 30
        ? "bg-yellow-400 text-gray-900"
        : "bg-green-500 text-white";

  const totalRed = allSnaps.filter((s) => s.status === "red").length;
  const totalYellow = allSnaps.filter((s) => s.status === "yellow").length;

  return (
    <div>
      <PageHeader
        title="Risk Heatmaps"
        titleAr="خرائط المخاطر الحرارية"
        description="Multi-dimensional risk visualization from live performance data"
        descriptionAr="تصور المخاطر متعدد الأبعاد من بيانات الأداء الحية"
        currentLang={l}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-600">{totalRed}</p>
          <p className="text-xs text-gray-500">{l === "ar" ? "حرجة" : "Critical"}</p>
        </Card>
        <Card className="p-4 text-center">
          <Shield className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-yellow-600">{totalYellow}</p>
          <p className="text-xs text-gray-500">{l === "ar" ? "تحذير" : "Warning"}</p>
        </Card>
        <Card className="p-4 text-center">
          <Grid3x3 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{employees.length}</p>
          <p className="text-xs text-gray-500">{l === "ar" ? "موظفين" : "Employees"}</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{kpiRows.length}</p>
          <p className="text-xs text-gray-500">{l === "ar" ? "مؤشرات" : "KPIs Tracked"}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "مخاطر الموظفين" : "Employee Risk"}</CardTitle>
          </CardHeader>
          {empRisk.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              {l === "ar" ? "لا توجد بيانات" : "No data"}
            </p>
          ) : (
            <div className="space-y-2">
              {empRisk.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <span className="text-sm font-medium w-32 truncate">{e.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {e.reds > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                          {e.reds}R
                        </span>
                      )}
                      {e.yellows > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">
                          {e.yellows}Y
                        </span>
                      )}
                      {e.greens > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                          {e.greens}G
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${cellColor(e.score)}`}
                    >
                      {e.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* KPI Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "مخاطر المؤشرات" : "KPI Risk Distribution"}</CardTitle>
          </CardHeader>
          {kpiRows.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              {l === "ar" ? "لا توجد بيانات" : "No data"}
            </p>
          ) : (
            <div className="space-y-2">
              {kpiRows.map((k) => (
                <div key={k.name} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{k.name}</span>
                    <span className="text-xs text-gray-500">{k.total} snapshots</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                    {k.red > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ width: `${(k.red / k.total) * 100}%` }}
                      />
                    )}
                    {k.yellow > 0 && (
                      <div
                        className="bg-yellow-400"
                        style={{ width: `${(k.yellow / k.total) * 100}%` }}
                      />
                    )}
                    {k.green > 0 && (
                      <div
                        className="bg-green-500"
                        style={{ width: `${(k.green / k.total) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
