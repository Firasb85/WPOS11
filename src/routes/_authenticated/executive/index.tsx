import { createFileRoute } from "@tanstack/react-router";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useRootCauseMetrics, useDiagnosticMetrics } from "@/hooks/useAnalytics";
import { useCases } from "@/hooks/useCases";
import { BarChart3, Brain, Briefcase, TrendingUp, Users, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_authenticated/executive/")({ component: ExecutivePage });

function ExecutivePage() {
  const { t, lang: l } = useLanguage();
  const { data: ceo, isLoading: _ceoLoading } = useCeoDashboard();
  const { data: rootCauses } = useRootCauseMetrics();
  const { data: diagMetrics } = useDiagnosticMetrics();
  const { data: cases } = useCases();
  const m = ceo ?? {
    totalEmployees: 0,
    performanceIndex: 0,
    kpiStatus: { green: 0, yellow: 0, red: 0 },
    totalDiagnostics: 0,
    avgMaturity: 0,
  };
  const caseItems = (cases ?? []) as unknown as Array<Record<string, unknown>>;
  const resolvedCases = caseItems.filter((c) => c.status === "resolved").length;
  const dm = diagMetrics ?? { total: 0, avgConfidence: 0 };

  return (
    <div>
      <PageHeader
        title="Executive Analytics"
        titleAr="تحليلات تنفيذية"
        description="Strategic performance overview — live data"
        descriptionAr="نظرة عامة استراتيجية على الأداء — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title={t("Workforce", "القوى العاملة")}
          value={String(m.totalEmployees)}
          icon={<Users />}
          status="good"
        />
        <StatsCard
          title={t("Performance Index", "مؤشر الأداء")}
          value={`${m.performanceIndex}%`}
          icon={<TrendingUp />}
          status={m.performanceIndex >= 80 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Active Cases", "الحالات النشطة")}
          value={String(caseItems.length)}
          icon={<Briefcase />}
          status={caseItems.length > 10 ? "warning" : "good"}
        />
        <StatsCard
          title={t("Resolved Cases", "حالات محلولة")}
          value={String(resolvedCases)}
          icon={<Briefcase />}
          status="good"
        />
        <StatsCard
          title={t("Avg Confidence", "متوسط الثقة")}
          value={`${dm.avgConfidence}%`}
          icon={<Brain />}
          status={dm.avgConfidence >= 60 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Diagnostics", "التشخيصات")}
          value={String(dm.total)}
          icon={<Stethoscope />}
          status="good"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-4 h-4 inline mr-2" />
              {t("Top Root Causes", "أهم الأسباب الجذرية")}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {(rootCauses ?? []).slice(0, 5).map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <div className="w-32 text-sm capitalize">{c.category}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden relative">
                  <div className="h-full bg-blue-500 rounded" style={{ width: `${c.pct}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
              </div>
            ))}
            {(rootCauses ?? []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                {t("No data yet", "لا توجد بيانات")}
              </p>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("KPI Health", "صحة المؤشرات")}</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{m.kpiStatus.green}</p>
              <p className="text-xs mt-1">{t("Good", "جيد")}</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{m.kpiStatus.yellow}</p>
              <p className="text-xs mt-1">{t("Warning", "تحذير")}</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{m.kpiStatus.red}</p>
              <p className="text-xs mt-1">{t("Critical", "حرج")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
