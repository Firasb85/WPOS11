import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useAIInsights } from "@/hooks/useAIInsights";
import { AtRiskEmployeesPanel, AtRiskDepartmentsPanel } from "@/components/diagnostics/AtRiskPanel";
import { useDashboardRealtime } from "@/hooks/useRealtimeSubscription";
import {
  Users,
  Building2,
  TrendingUp,
  Gauge,
  Stethoscope,
  FileText,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/ceo")({
  component: CEODashboardPage,
});

function CEODashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: metrics, isLoading } = useCeoDashboard();
  useDashboardRealtime(); // Live updates
  const { data: insights } = useAIInsights(); // structured insights

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="CEO Dashboard"
          titleAr="لوحة الرئيس التنفيذي"
          description="Organization-wide performance overview"
          descriptionAr="نظرة عامة على أداء المؤسسة"
          currentLang={l}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const m = metrics ?? {
    totalEmployees: 0,
    totalDepartments: 0,
    totalKpis: 0,
    totalEvidence: 0,
    performanceIndex: 0,
    kpiStatus: { green: 0, yellow: 0, red: 0 },
    totalDiagnostics: 0,
    avgMaturity: 0,
    diagnosticsByStatus: { draft: 0, under_review: 0, approved: 0 },
  };

  return (
    <div>
      <PageHeader
        title="CEO Dashboard"
        titleAr="لوحة الرئيس التنفيذي"
        description="Organization-wide performance overview — live data"
        descriptionAr="نظرة عامة على أداء المؤسسة — بيانات حية"
        currentLang={l}
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Total Employees", "إجمالي الموظفين")}
          value={String(m.totalEmployees)}
          icon={<Users />}
          status="good"
        />
        <StatsCard
          title={t("Departments", "الإدارات")}
          value={String(m.totalDepartments)}
          icon={<Building2 />}
          status="good"
        />
        <StatsCard
          title={t("Performance Index", "مؤشر الأداء")}
          value={`${m.performanceIndex}%`}
          icon={<TrendingUp />}
          status={
            m.performanceIndex >= 80 ? "good" : m.performanceIndex >= 60 ? "warning" : "critical"
          }
        />
        <StatsCard
          title={t("Critical KPIs", "مؤشرات حرجة")}
          value={String(m.kpiStatus.red)}
          icon={<AlertTriangle />}
          status={m.kpiStatus.red === 0 ? "good" : "critical"}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* KPI Status */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Gauge className="w-4 h-4 inline mr-2" />
              {t("KPI Status Overview", "نظرة عامة على حالة المؤشرات")}
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{m.kpiStatus.green}</p>
              <p className="text-xs mt-1">{t("Good", "جيد")}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{m.kpiStatus.yellow}</p>
              <p className="text-xs mt-1">{t("Warning", "تحذير")}</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{m.kpiStatus.red}</p>
              <p className="text-xs mt-1">{t("Critical", "حرج")}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            {t("Total KPIs defined", "إجمالي المؤشرات المعرفة")}: {m.totalKpis}
          </p>
        </Card>

        {/* Diagnostic Status */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Stethoscope className="w-4 h-4 inline mr-2" />
              {t("Diagnostics Overview", "نظرة عامة على التشخيصات")}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{t("Total Reports", "إجمالي التقارير")}</span>
              <span className="text-lg font-bold">{m.totalDiagnostics}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{t("Draft", "مسودة")}</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                {m.diagnosticsByStatus.draft}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{t("Under Review", "قيد المراجعة")}</span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                {m.diagnosticsByStatus.under_review}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{t("Approved", "معتمدة")}</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                {m.diagnosticsByStatus.approved}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">{t("Avg Maturity", "متوسط النضج")}</span>
              <span className="text-lg font-bold text-blue-600">{m.avgMaturity}</span>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FileText className="w-4 h-4 inline mr-2" />
              {t("System Summary", "ملخص النظام")}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">{t("Total Evidence", "إجمالي الأدلة")}</span>
              <span className="font-semibold">{m.totalEvidence}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">{t("Active KPIs", "المؤشرات النشطة")}</span>
              <span className="font-semibold">{m.totalKpis}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                {t("Snapshots Recorded", "اللقطات المسجلة")}
              </span>
              <span className="font-semibold">
                {m.kpiStatus.green + m.kpiStatus.yellow + m.kpiStatus.red}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">{t("System Health", "صحة النظام")}</span>
              <span className="font-semibold text-green-600">
                {m.performanceIndex >= 80 ? "✅" : m.performanceIndex >= 60 ? "⚠️" : "🔴"}{" "}
                {m.performanceIndex}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights */}
      {(insights ?? []).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              <span className="mr-2">🧠</span>
              {t("Insights", "الرؤى")}
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                {(insights ?? []).length}
              </span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(insights ?? []).map((ins) => (
              <div
                key={ins.id}
                className={
                  "p-3 rounded-lg border text-sm " +
                  (ins.priority === "critical"
                    ? "bg-red-50 border-red-200"
                    : ins.priority === "high"
                      ? "bg-orange-50 border-orange-200"
                      : ins.type === "achievement"
                        ? "bg-green-50 border-green-200"
                        : "bg-blue-50 border-blue-200")
                }
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium">{ins.title}</p>
                  <span
                    className={
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold " +
                      (ins.priority === "critical"
                        ? "bg-red-200 text-red-800"
                        : ins.priority === "high"
                          ? "bg-orange-200 text-orange-800"
                          : "bg-gray-200 text-gray-700")
                    }
                  >
                    {ins.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{ins.description}</p>
                {ins.suggestedAction && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">💡 {ins.suggestedAction}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Proactive Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AtRiskEmployeesPanel />
        <AtRiskDepartmentsPanel />
      </div>
    </div>
  );
}
