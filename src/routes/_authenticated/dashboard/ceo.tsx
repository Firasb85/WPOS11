import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { KpiStatusBar } from "~/components/wpos/KpiStatusBar";
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
  Lightbulb,
  CheckCircle2,
  Activity,
  Target,
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

      {/* Top Stats — Premium polished row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Second Row — Polished 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* KPI Status — segmented horizontal bar + counts */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Gauge className="w-4 h-4 mr-2" />
              {t("KPI Status Overview", "نظرة عامة على حالة المؤشرات")}
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <KpiStatusBar
              green={m.kpiStatus.green}
              yellow={m.kpiStatus.yellow}
              red={m.kpiStatus.red}
              total={m.totalKpis}
              labels={{
                good: t("Good", "جيد"),
                warning: t("Warning", "تحذير"),
                critical: t("Critical", "حرج"),
                total: t("Total KPIs defined", "إجمالي المؤشرات المعرفة"),
              }}
            />
          </div>
        </Card>

        {/* Diagnostic Status — Cleaner cards */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Stethoscope className="w-4 h-4 mr-2" />
              {t("Diagnostics Overview", "نظرة عامة على التشخيصات")}
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6 space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t("Total Reports", "إجمالي التقارير")}</span>
              <span className="font-bold text-xl tabular-nums">{m.totalDiagnostics}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("Draft", "مسودة")}</span>
                <span className="px-2.5 py-px text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                  {m.diagnosticsByStatus.draft}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("Under Review", "قيد المراجعة")}</span>
                <span className="px-2.5 py-px text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                  {m.diagnosticsByStatus.under_review}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("Approved", "معتمدة")}</span>
                <span className="px-2.5 py-px text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full">
                  {m.diagnosticsByStatus.approved}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-gray-500">{t("Avg Maturity", "متوسط النضج")}</span>
              <span className="font-bold text-blue-600 tabular-nums text-lg">{m.avgMaturity}</span>
            </div>
          </div>
        </Card>

        {/* Quick Stats — System Summary */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <FileText className="w-4 h-4 mr-2" />
              {t("System Summary", "ملخص النظام")}
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6 space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">{t("Total Evidence", "إجمالي الأدلة")}</span>
              <span className="font-semibold tabular-nums">{m.totalEvidence}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">{t("Active KPIs", "المؤشرات النشطة")}</span>
              <span className="font-semibold tabular-nums">{m.totalKpis}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">{t("Snapshots Recorded", "اللقطات المسجلة")}</span>
              <span className="font-semibold tabular-nums">
                {m.kpiStatus.green + m.kpiStatus.yellow + m.kpiStatus.red}
              </span>
            </div>
            <div className="flex justify-between pt-2 items-center">
              <span className="text-gray-500">{t("System Health", "صحة النظام")}</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                {m.performanceIndex >= 80 ? "✅" : m.performanceIndex >= 60 ? "⚠️" : "🔴"} {m.performanceIndex}%
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
              <Lightbulb className="w-4 h-4 inline mr-2 text-purple-600" />
              {t("Insights", "الرؤى")}
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-bold">
                {(insights ?? []).length}
              </span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(insights ?? []).map((ins) => {
              // Insight visual style by priority + type
              const palette = insightPalette(ins.priority, ins.type);
              const IconEl =
                ins.type === "achievement" ? CheckCircle2 :
                ins.type === "warning"      ? AlertTriangle :
                                              Activity;
              return (
                <div
                  key={ins.id}
                  className={`p-3 rounded-lg border ${palette.border} ${palette.bg} text-sm flex items-start gap-3`}
                >
                  <div className={`w-8 h-8 rounded-lg ${palette.iconBg} flex items-center justify-center flex-shrink-0 ${palette.iconText}`}>
                    <IconEl className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{ins.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${palette.badge}`}>
                        {ins.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{ins.description}</p>
                    {ins.suggestedAction && (
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1.5 font-medium flex items-start gap-1.5">
                        <Target className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{ins.suggestedAction}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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

/* ─────────────────────────────────────────────────────────────────────────
   insightPalette — visual style per insight priority + type.
   ───────────────────────────────────────────────────────────────────────── */

type InsightPalette = {
  bg: string;
  border: string;
  iconBg: string;
  iconText: string;
  badge: string;
};

function insightPalette(priority: string, type: string): InsightPalette {
  if (type === "achievement") {
    return {
      bg: "bg-green-50 dark:bg-green-900/15",
      border: "border-green-200 dark:border-green-900/50",
      iconBg: "bg-green-100 dark:bg-green-900/40",
      iconText: "text-green-700 dark:text-green-400",
      badge: "bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    };
  }
  if (priority === "critical") {
    return {
      bg: "bg-red-50 dark:bg-red-900/15",
      border: "border-red-200 dark:border-red-900/50",
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconText: "text-red-700 dark:text-red-400",
      badge: "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };
  }
  if (priority === "high") {
    return {
      bg: "bg-orange-50 dark:bg-orange-900/15",
      border: "border-orange-200 dark:border-orange-900/50",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconText: "text-orange-700 dark:text-orange-400",
      badge: "bg-orange-200 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    };
  }
  // default / low / suggestion
  return {
    bg: "bg-blue-50 dark:bg-blue-900/15",
    border: "border-blue-200 dark:border-blue-900/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   KpiStatusBar and MiniSparkline are now shared components:
     - src/components/wpos/KpiStatusBar.tsx
     - src/components/wpos/MiniSparkline.tsx
   ───────────────────────────────────────────────────────────────────────── */
