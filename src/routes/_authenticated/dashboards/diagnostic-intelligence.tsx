import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { Stethoscope, TrendingUp, AlertTriangle, BarChart3, Brain } from "lucide-react";
import { useDiagnosticMetrics, useRootCauseMetrics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/_authenticated/dashboards/diagnostic-intelligence")({
  component: DiagnosticIntelligencePage,
});

function DiagnosticIntelligencePage() {
  const { data: diagMetrics, isLoading: _diagMetricsLoading } = useDiagnosticMetrics();
  const { data: rootCauseData } = useRootCauseMetrics();
  const l = "ar";
  const rootCauses = [
    { label: "Skill Gap", labelAr: "فجوة مهارية", count: 12, pct: 28, trend: "increasing" },
    { label: "Process Issue", labelAr: "مشكلة إجرائية", count: 10, pct: 23, trend: "stable" },
    { label: "Knowledge Gap", labelAr: "فجوة معرفية", count: 7, pct: 16, trend: "stable" },
    { label: "Tool Issue", labelAr: "مشكلة أدوات", count: 5, pct: 12, trend: "decreasing" },
    { label: "Motivation", labelAr: "تحفيز", count: 4, pct: 9, trend: "increasing" },
  ];
  const freqGaps = [
    { comp: "Data Analysis", compAr: "تحليل البيانات", freq: 8 },
    { comp: "Negotiation", compAr: "التفاوض", freq: 5 },
    { comp: "Time Management", compAr: "إدارة الوقت", freq: 4 },
  ];

  return (
    <div>
      <PageHeader
        title="Diagnostic Intelligence"
        titleAr="لوحة ذكاء التشخيص"
        description="Analytics from the diagnostic engine"
        descriptionAr="تحليلات من محرك التشخيص"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Diagnostics"
          titleAr="إجمالي التشخيصات"
          value="43"
          icon={<Stethoscope />}
          currentLang={l}
        />
        <StatsCard
          title="Avg Confidence"
          titleAr="متوسط الثقة"
          value="78%"
          change={5.2}
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Avg Maturity"
          titleAr="متوسط النضج"
          value="3.4"
          change={0.3}
          icon={<BarChart3 />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Open Validations"
          titleAr="تحقق مفتوح"
          value="7"
          icon={<AlertTriangle />}
          status="warning"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "الأسباب الجذرية" : "Root Causes"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {rootCauses.map((rc, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg">
                <span className="text-xs font-medium text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {l === "ar" ? rc.labelAr : rc.label}
                    </span>
                    <span className="text-sm font-bold">
                      {rc.count} ({rc.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rc.trend === "increasing" ? "bg-red-500" : rc.trend === "decreasing" ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${rc.pct}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${rc.trend === "increasing" ? "bg-red-100 text-red-700" : rc.trend === "decreasing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {rc.trend}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Brain className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "فجوات الكفاءات" : "Freq. Competency Gaps"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {freqGaps.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">{l === "ar" ? item.compAr : item.comp}</span>
                <span className="text-lg font-bold text-red-600">{item.freq}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "توزيع النضج" : "Maturity Distribution"}</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-5 gap-4">
          {[
            { level: 1, count: 3 },
            { level: 2, count: 8 },
            { level: 3, count: 12 },
            { level: 4, count: 6 },
            { level: 5, count: 2 },
          ].map((item) => (
            <div
              key={item.level}
              className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <MaturityBadge level={item.level} size="sm" currentLang={l} />
              <p className="text-lg font-bold mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
