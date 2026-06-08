import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useSnapshots } from "@/hooks/useKpis";
import { AtRiskEmployeesPanel } from "@/components/diagnostics/AtRiskPanel";
import { Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/supervisor")({
  component: SupervisorDashboardPage,
});

function SupervisorDashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: empData, isLoading: _empDataLoading } = useEmployeesList({ pageSize: 100 });
  const { data: snaps } = useSnapshots();
  const employees = empData?.data ?? [];
  const snapshots = snaps ?? [];
  const redSnaps = snapshots.filter((s) => s.status === "red").length;

  return (
    <div>
      <PageHeader
        title="Supervisor Dashboard"
        titleAr="لوحة المشرف"
        description="Team performance overview — live data"
        descriptionAr="نظرة عامة على أداء الفريق — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Team Members", "أعضاء الفريق")}
          value={String(employees.length)}
          icon={<Users />}
        />
        <StatsCard
          title={t("Snapshots", "اللقطات")}
          value={String(snapshots.length)}
          icon={<Clock />}
          status="good"
        />
        <StatsCard
          title={t("Issues", "مشاكل")}
          value={String(redSnaps)}
          icon={<AlertTriangle />}
          status={redSnaps > 0 ? "critical" : "good"}
        />
        <StatsCard
          title={t("Performance", "الأداء")}
          value={
            snapshots.length > 0
              ? `${Math.round((snapshots.filter((s) => s.status === "green").length / snapshots.length) * 100)}%`
              : "N/A"
          }
          icon={<TrendingUp />}
          status="good"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Team Members", "أعضاء الفريق")}</CardTitle>
        </CardHeader>
        {employees.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("No team members found.", "لا يوجد أعضاء فريق.")}
          </p>
        ) : (
          <div className="space-y-2">
            {employees.slice(0, 20).map((emp) => {
              const empSnaps = snapshots.filter((s) => s.employee_id === emp.id);
              const worst = empSnaps.some((s) => s.status === "red")
                ? "red"
                : empSnaps.some((s) => s.status === "yellow")
                  ? "yellow"
                  : "green";
              return (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${worst === "red" ? "bg-red-500" : worst === "yellow" ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{emp.employee_code ?? ""}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {empSnaps.length} {t("snapshots", "لقطات")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <AtRiskEmployeesPanel />
      </div>
    </div>
  );
}
