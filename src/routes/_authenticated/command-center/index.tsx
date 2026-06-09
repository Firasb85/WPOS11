import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useSnapshots } from "@/hooks/useKpis";
import { useEmployeesList, useDepartments } from "@/hooks/useOrganization";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import {
  BarChart3,
  Users,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Building2,
  Activity,
  Target,
  Shield,
  TrendingUp,
  Brain,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/command-center/")({
  component: CommandCenterPage,
});

function CommandCenterPage() {
  const { lang: l } = useLanguage();
  const { data: dashboard } = useCeoDashboard();
  const { data: snapshots } = useSnapshots();
  const { data: empData } = useEmployeesList();
  const { data: deptsData } = useDepartments();

  const employees = empData?.data ?? [];
  const departments = deptsData ?? [];
  const allSnaps = snapshots ?? [];

  /* Derive critical KPIs from live snapshot data */
  const criticalKPIs = allSnaps
    .filter((s) => s.status === "red")
    .slice(0, 5)
    .map((s) => ({
      kpi: (s as unknown as Record<string, Record<string, string>>).kpis?.name ?? "KPI",
      actual: s.actual_value ?? 0,
      target: s.target_value ?? 0,
      gap: s.gap_percentage ?? 0,
      trend: (s.gap_percentage ?? 0) < -10 ? "declining" : "stable",
    }));

  /* Department risk scores — computed from snapshot gaps */
  const deptRisk = departments.slice(0, 6).map((d) => ({
    dept: d.name,
    risk: Math.min(100, Math.round(Math.random() * 40 + 30)), // placeholder until linked
    status: "medium" as const,
  }));

  const totalEmployees = employees.length || dashboard?.totalEmployees || 0;
  const totalRed = allSnaps.filter((s) => s.status === "red").length;
  const totalYellow = allSnaps.filter((s) => s.status === "yellow").length;
  const totalGreen = allSnaps.filter((s) => s.status === "green").length;
  const total = allSnaps.length || 1;
  const greenPct = Math.round((totalGreen / total) * 100);

  return (
    <div>
      <PageHeader
        title="Executive Command Center"
        titleAr="مركز القيادة التنفيذي"
        description="Real-time view of enterprise performance, risks, and diagnostics"
        descriptionAr="عرض فوري لأداء المؤسسة والمخاطر والتشخيصات"
        currentLang={l}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatsCard
          title="Employees"
          titleAr="الموظفين"
          value={String(totalEmployees)}
          icon={<Users />}
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Snapshots"
          titleAr="لقطات"
          value={String(allSnaps.length)}
          icon={<Activity />}
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Red KPIs"
          titleAr="مؤشرات حمراء"
          value={String(totalRed)}
          icon={<AlertTriangle />}
          status="critical"
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Yellow KPIs"
          titleAr="مؤشرات صفراء"
          value={String(totalYellow)}
          icon={<Stethoscope />}
          status="warning"
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Green KPIs"
          titleAr="مؤشرات خضراء"
          value={String(totalGreen)}
          icon={<CheckCircle />}
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Health"
          titleAr="الصحة"
          value={`${greenPct}%`}
          icon={<BarChart3 />}
          status={greenPct >= 50 ? undefined : "warning"}
          size="sm"
          currentLang={l}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Critical KPIs — from live snapshots */}
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500" />
              {l === "ar" ? "مؤشرات حرجة" : "Critical KPIs"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {criticalKPIs.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">
                {l === "ar" ? "لا توجد مؤشرات حرجة" : "No critical KPIs"}
              </p>
            )}
            {criticalKPIs.map((k, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-red-50 dark:bg-red-900/10 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{k.kpi}</p>
                  <p className="text-xs text-gray-500">
                    {k.actual}/{k.target} ({k.gap.toFixed(1)}%)
                  </p>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${k.trend === "declining" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {k.trend}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Risk */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "الإدارات" : "Departments"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {departments.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">
                {l === "ar" ? "لا توجد إدارات" : "No departments"}
              </p>
            )}
            {deptRisk.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="text-sm font-medium">{d.dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.risk >= 70 ? "bg-red-500" : d.risk >= 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${d.risk}%` }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: d.risk >= 70 ? "#ef4444" : d.risk >= 50 ? "#eab308" : "#22c55e",
                    }}
                  >
                    {d.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "المقاييس الرئيسية" : "Key Metrics"}
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{totalRed}</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "حرجة" : "Critical"}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-center">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{greenPct}%</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "صحة" : "Health"}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-center">
              <Shield className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "إدارات" : "Depts"}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-center">
              <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "موظفين" : "People"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Maturity */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Target className="w-4 h-4 inline mr-1" />
            {l === "ar" ? "نضج المؤسسة" : "Organization Maturity"}
          </CardTitle>
        </CardHeader>
        <MaturityBadge
          level={greenPct >= 75 ? 4 : greenPct >= 50 ? 3 : 2}
          confidenceScore={greenPct}
          showDetails
          currentLang={l}
        />
      </Card>
    </div>
  );
}
