import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useDiagnosticMetrics, useRootCauseMetrics } from "@/hooks/useAnalytics";
import { Stethoscope, TrendingUp, Brain, BarChart3, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/dashboard")({
  component: DiagnosticDashboardPage,
});

function DiagnosticDashboardPage() {
  const { t, lang: l } = useLanguage();
  const { data: metrics, isLoading: mLoading } = useDiagnosticMetrics();
  const { data: causes, isLoading: cLoading } = useRootCauseMetrics();
  const m = metrics ?? {
    total: 0,
    avgMaturity: 0,
    avgConfidence: 0,
    byStatus: {},
    byDepartment: [],
  };
  const isLoading = mLoading || cLoading;

  return (
    <div>
      <PageHeader
        title="Diagnostic Dashboard"
        titleAr="لوحة التشخيص"
        description="Diagnostic intelligence overview — live data"
        descriptionAr="نظرة عامة على ذكاء التشخيص — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Total Reports", "التقارير")}
          value={String(m.total)}
          icon={<Stethoscope />}
          status="good"
        />
        <StatsCard
          title={t("Avg Maturity", "متوسط النضج")}
          value={String(m.avgMaturity)}
          icon={<TrendingUp />}
          status={m.avgMaturity >= 3 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Avg Confidence", "متوسط الثقة")}
          value={`${m.avgConfidence}%`}
          icon={<Brain />}
          status={m.avgConfidence >= 60 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Under Review", "قيد المراجعة")}
          value={String(m.byStatus["under_review"] ?? 0)}
          icon={<AlertTriangle />}
          status={(m.byStatus["under_review"] ?? 0) > 5 ? "warning" : "good"}
        />
      </div>
      {isLoading ? (
        <div className="h-64 bg-white rounded-xl border animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart3 className="w-4 h-4 inline mr-2" />
                {t("By Status", "حسب الحالة")}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {Object.entries(m.byStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm capitalize">{status.replace("_", " ")}</span>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(m.byStatus).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t("No data", "لا توجد بيانات")}
                </p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Brain className="w-4 h-4 inline mr-2" />
                {t("Top Root Causes", "أهم الأسباب الجذرية")}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {(causes ?? []).slice(0, 5).map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-sm flex-1 capitalize">{c.category}</span>
                  <span className="text-xs text-gray-500">{c.pct}%</span>
                  <span className="text-sm font-bold">{c.count}</span>
                </div>
              ))}
              {(causes ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t("No data", "لا توجد بيانات")}
                </p>
              )}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("By Department", "حسب الإدارة")}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {m.byDepartment.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium">{d.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      {d.count} {t("reports", "تقارير")}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {d.avgConfidence}% {t("avg conf", "متوسط الثقة")}
                    </span>
                  </div>
                </div>
              ))}
              {m.byDepartment.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {t("No data", "لا توجد بيانات")}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
