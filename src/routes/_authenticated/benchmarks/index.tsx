import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { BarChart3, TrendingUp, TrendingDown} from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";

export const Route = createFileRoute("/_authenticated/benchmarks/")({
  component: BenchmarksPage,
});

function BenchmarksPage() {
  const { t, lang: l } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();

  const benchmarks = [
    {
      metric: "Employee Turnover Rate",
      metricAr: "معدل دوران الموظفين",
      industry: 15,
      topPerformer: 8,
      company: 12,
      unit: "%",
    },
    {
      metric: "Training Hours per Employee",
      metricAr: "ساعات التدريب لكل موظف",
      industry: 40,
      topPerformer: 80,
      company: 55,
      unit: "hrs",
    },
    {
      metric: "Employee Satisfaction",
      metricAr: "رضا الموظفين",
      industry: 72,
      topPerformer: 90,
      company: 78,
      unit: "%",
    },
    {
      metric: "Time to Fill Position",
      metricAr: "وقت شغل الوظيفة",
      industry: 45,
      topPerformer: 25,
      company: 38,
      unit: "days",
    },
    {
      metric: "Performance Review Completion",
      metricAr: "إكمال تقييم الأداء",
      industry: 85,
      topPerformer: 98,
      company: 92,
      unit: "%",
    },
    {
      metric: "Internal Mobility Rate",
      metricAr: "معدل التنقل الداخلي",
      industry: 10,
      topPerformer: 20,
      company: 14,
      unit: "%",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Industry Benchmarks"
        titleAr="المقاييس المرجعية"
        description="Compare your workforce metrics against industry standards"
        descriptionAr="قارن مقاييس القوى العاملة بمعايير الصناعة"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">6</p>
          <p className="text-xs text-gray-500">{t("Metrics Tracked", "المقاييس المتتبعة")}</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-gray-500">{t("Above Industry Avg", "فوق متوسط الصناعة")}</p>
        </Card>
        <Card className="text-center">
          <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-gray-500">{t("Below Industry Avg", "تحت متوسط الصناعة")}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Benchmark Comparison", "مقارنة المقاييس")}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Metric", "المقياس")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Industry Avg", "متوسط الصناعة")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Top Performer", "الأفضل أداءً")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Your Company", "شركتك")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                  {t("Status", "الحالة")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {benchmarks.map((b) => {
                const gap = b.company - b.industry;
                const isGood =
                  b.metric.includes("Turnover") || b.metric.includes("Time to Fill")
                    ? gap < 0
                    : gap > 0;
                return (
                  <tr key={b.metric} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{l === "ar" ? b.metricAr : b.metric}</td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {b.industry}
                      {b.unit}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-600 font-medium">
                      {b.topPerformer}
                      {b.unit}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {b.company}
                      {b.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {isGood ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isGood ? t("Above", "فوق") : t("Below", "تحت")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
