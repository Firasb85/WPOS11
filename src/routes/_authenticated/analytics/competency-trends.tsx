import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { TrendingUp, TrendingDown, Brain } from "lucide-react";
import { useEmployeeCompetencies } from "@/hooks/useCompetencies";

export const Route = createFileRoute("/_authenticated/analytics/competency-trends")({
  component: CompetencyTrendsPage,
});

function CompetencyTrendsPage() {
  const { data: _empComps, isLoading: _empCompsLoading } = useEmployeeCompetencies();
  const l = "ar";
  const trends = [
    { comp: "Data Analysis", compAr: "تحليل البيانات", q1: 1.8, q2: 1.7, q3: 1.5, trend: "down" },
    { comp: "Negotiation", compAr: "التفاوض", q1: 2.0, q2: 2.0, q3: 1.8, trend: "down" },
    { comp: "Time Management", compAr: "إدارة الوقت", q1: 1.2, q2: 1.5, q3: 1.8, trend: "up" },
    { comp: "Leadership", compAr: "القيادة", q1: 1.5, q2: 1.3, q3: 1.2, trend: "down" },
    {
      comp: "Analytical Thinking",
      compAr: "التفكير التحليلي",
      q1: 0.8,
      q2: 1.0,
      q3: 0.9,
      trend: "stable",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Competency Trends"
        titleAr="اتجاهات الكفاءات"
        description="Track gap evolution over time"
        descriptionAr="تتبع تطور الفجوات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Avg Gap"
          titleAr="متوسط الفجوة"
          value="1.4"
          change={-0.2}
          icon={<TrendingDown />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Improving"
          titleAr="تتحسن"
          value="3"
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Worsening"
          titleAr="تتدهور"
          value="1"
          icon={<TrendingDown />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Capability"
          titleAr="القدرة"
          value="81%"
          change={1.8}
          icon={<Brain />}
          status="good"
          currentLang={l}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "اتجاهات الفجوات" : "Gap Trends"}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-left">
                  {l === "ar" ? "الكفاءة" : "Competency"}
                </th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center">Q1</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center">Q2</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center">Q3</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center">
                  {l === "ar" ? "الاتجاه" : "Trend"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trends.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium">
                    {l === "ar" ? item.compAr : item.comp}
                  </td>
                  <td className="px-3 py-2 text-center text-sm">{item.q1.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center text-sm">{item.q2.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center text-sm font-bold">{item.q3.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center">
                    {item.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-green-500 inline" />
                    ) : item.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-red-500 inline" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
