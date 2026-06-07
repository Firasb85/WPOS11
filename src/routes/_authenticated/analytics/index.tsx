import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useEvidenceMetrics, useDiagnosticMetrics } from "@/hooks/useAnalytics";
import { BarChart3, Search, TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics/")({
  component: AnalyticsIndexPage,
});

function AnalyticsIndexPage() {
  const { t, lang: l } = useLanguage();
  const { data: ceo, isLoading: _ceoLoading } = useCeoDashboard();
  const { data: evidence } = useEvidenceMetrics();
  const { data: diag } = useDiagnosticMetrics();
  const m = ceo ?? { performanceIndex: 0, totalDiagnostics: 0 };
  const ev = evidence ?? { total: 0 };
  const dm = diag ?? { total: 0, avgConfidence: 0 };

  const sections = [
    {
      href: "/analytics/root-cause",
      icon: Search,
      label: t("Root Cause Analysis", "تحليل الأسباب الجذرية"),
      desc: t("Distribution of performance root causes", "توزيع أسباب الأداء الجذرية"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      href: "/analytics/competency-trends",
      icon: TrendingUp,
      label: t("Competency Trends", "اتجاهات الكفاءات"),
      desc: t("Track competency gap trends over time", "تتبع اتجاهات فجوات الكفاءات"),
      color: "bg-green-50 text-green-600",
    },
    {
      href: "/analytics/evidence-quality",
      icon: Shield,
      label: t("Evidence Quality", "جودة الأدلة"),
      desc: t("Assess evidence reliability and coverage", "تقييم موثوقية وتغطية الأدلة"),
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        titleAr="التحليلات"
        description="Performance analytics overview — live data"
        descriptionAr="نظرة عامة على تحليلات الأداء — بيانات حية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={t("Performance Index", "مؤشر الأداء")}
          value={`${m.performanceIndex}%`}
          icon={<TrendingUp />}
          status={m.performanceIndex >= 80 ? "good" : "warning"}
        />
        <StatsCard
          title={t("Diagnostics", "التشخيصات")}
          value={String(dm.total)}
          icon={<BarChart3 />}
          status="good"
        />
        <StatsCard
          title={t("Evidence Items", "عناصر الأدلة")}
          value={String(ev.total)}
          icon={<Shield />}
          status="good"
        />
        <StatsCard
          title={t("Avg Confidence", "متوسط الثقة")}
          value={`${dm.avgConfidence}%`}
          icon={<Search />}
          status={dm.avgConfidence >= 60 ? "good" : "warning"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.href} to={s.href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}
                >
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
