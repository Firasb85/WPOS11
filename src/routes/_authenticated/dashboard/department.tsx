import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useDepartmentMetrics } from "@/hooks/useAnalytics";
import { Building2, Users, TrendingUp, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/department")({
  component: DepartmentDashboardPage,
});

function DepartmentDashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: depts, isLoading } = useDepartmentMetrics();
  const items = depts ?? [];
  const totalEmps = items.reduce((s, d) => s + d.employees, 0);
  const totalRed = items.reduce((s, d) => s + d.redKpis, 0);

  return (
    <div>
      <PageHeader
        title="Department Dashboard"
        titleAr="لوحة الإدارات"
        description="Department-level performance overview — live data"
        descriptionAr="نظرة عامة على أداء الإدارات — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Departments", "الإدارات")}
          value={String(items.length)}
          icon={<Building2 />}
          status="good"
        />
        <StatsCard
          title={t("Total Employees", "الموظفون")}
          value={String(totalEmps)}
          icon={<Users />}
          status="good"
        />
        <StatsCard
          title={t("Critical KPIs", "مؤشرات حرجة")}
          value={String(totalRed)}
          icon={<AlertTriangle />}
          status={totalRed > 0 ? "critical" : "good"}
        />
        <StatsCard
          title={t("Avg Performance", "متوسط الأداء")}
          value={
            totalEmps > 0
              ? `${Math.round(
                  (items.reduce((s, d) => s + d.greenKpis, 0) /
                    Math.max(
                      items.reduce((s, d) => s + d.greenKpis + d.yellowKpis + d.redKpis, 0),
                      1,
                    )) *
                    100,
                )}%`
              : "N/A"
          }
          icon={<TrendingUp />}
          status="good"
        />
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl border animate-pulse" />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("Department Performance", "أداء الإدارات")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {items.map((d) => {
              const total = d.greenKpis + d.yellowKpis + d.redKpis;
              const perf =
                total > 0 ? Math.round(((d.greenKpis + d.yellowKpis * 0.5) / total) * 100) : 100;
              return (
                <div
                  key={d.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-gray-400">
                      {d.employees} {t("employees", "موظف")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${perf >= 80 ? "bg-green-500" : perf >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${perf}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 text-right mt-0.5">{perf}%</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-xs text-green-600 font-medium">{d.greenKpis}G</span>
                      <span className="text-xs text-yellow-600 font-medium">{d.yellowKpis}Y</span>
                      <span className="text-xs text-red-600 font-medium">{d.redKpis}R</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                {t("No department data yet.", "لا توجد بيانات إدارات بعد.")}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
