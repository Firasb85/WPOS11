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
  Lightbulb,
  CheckCircle2,
  Activity,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/ceo")({
  component: CEODashboardPage,
});

/**
 * MiniSparkline — tiny SVG line chart for trend indicators.
 * Renders a series of values as a 80x24 px line. Colour comes from
 * the trend (up → green, down → red, flat → slate).
 */
function MiniSparkline({
  values,
  trend = "flat",
}: {
  values: number[];
  trend?: "up" | "down" | "flat";
}) {
  if (!values || values.length < 2) {
    return <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded" />;
  }
  const w = 80;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke =
    trend === "up"
      ? "#15803d"
      : trend === "down"
        ? "#b91c1c"
        : "#64748b";
  const fill =
    trend === "up"
      ? "rgba(21, 160, 77, 0.08)"
      : trend === "down"
        ? "rgba(185, 28, 28, 0.08)"
        : "rgba(100, 116, 139, 0.08)";
  // Build the area fill polygon
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
      <polygon points={area} fill={fill} />
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        {/* KPI Status — segmented horizontal bar + counts */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Gauge className="w-4 h-4 inline mr-2" />
              {t("KPI Status Overview", "نظرة عامة على حالة المؤشرات")}
            </CardTitle>
          </CardHeader>
          <KpiStatusBar
            green={m.kpiStatus.green}
            yellow={m.kpiStatus.yellow}
            red={m.kpiStatus.red}
            total={m.totalKpis}
            t={t}
          />
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
   KpiStatusBar — segmented horizontal bar (RAG).
   Shows the ratio of green : yellow : red KPIs visually as one bar,
   plus per-segment counts underneath.
   ───────────────────────────────────────────────────────────────────────── */

function KpiStatusBar({
  green,
  yellow,
  red,
  total,
  t,
}: {
  green: number;
  yellow: number;
  red: number;
  total: number;
  t: (en: string, ar: string) => string;
}) {
  const safeTotal = Math.max(total, green + yellow + red, 1);
  const greenPct = (green / safeTotal) * 100;
  const yellowPct = (yellow / safeTotal) * 100;
  const redPct = (red / safeTotal) * 100;
  return (
    <div className="space-y-3">
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
        {greenPct > 0 && (
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${greenPct}%` }}
            title={`${green} green`}
          />
        )}
        {yellowPct > 0 && (
          <div
            className="bg-amber-400 transition-all"
            style={{ width: `${yellowPct}%` }}
            title={`${yellow} warning`}
          />
        )}
        {redPct > 0 && (
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${redPct}%` }}
            title={`${red} critical`}
          />
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xl font-bold text-green-700 dark:text-green-400 tabular-nums">{green}</p>
          <p className="text-[10px] uppercase tracking-wider text-green-700 dark:text-green-400 font-semibold mt-0.5">
            {t("Good", "جيد")}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">{yellow}</p>
          <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
            {t("Warning", "تحذير")}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-xl font-bold text-red-700 dark:text-red-400 tabular-nums">{red}</p>
          <p className="text-[10px] uppercase tracking-wider text-red-700 dark:text-red-400 font-semibold mt-0.5">
            {t("Critical", "حرج")}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        {t("Total KPIs defined", "إجمالي المؤشرات المعرفة")}: {total}
      </p>
    </div>
  );
}
