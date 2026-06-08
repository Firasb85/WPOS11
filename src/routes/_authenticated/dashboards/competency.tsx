import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { HeatmapGrid } from "~/components/wpos/visualizations/HeatmapGrid";
import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { useEmployeeCompetencies } from "@/hooks/useCompetencies";

export const Route = createFileRoute("/_authenticated/dashboards/competency")({
  component: CompetencyDashboardPage,
});

function CompetencyDashboardPage() {
  const { data: empComps, isLoading: _empCompsLoading } = useEmployeeCompetencies();
  const l = "ar";
  const heatmapData: Record<string, unknown>[] = [];
  const employees = [...new Set(heatmapData.map((d) => d.employeeName))];
  const competencies = [...new Set(heatmapData.map((d) => d.competencyName))];
  const topMissing: Record<string, unknown>[] = [];

  return (
    <div>
      <PageHeader
        title="Competency Dashboard"
        titleAr="لوحة الكفاءات"
        description="Organizational capability intelligence"
        descriptionAr="ذكاء القدرات المؤسسية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Capability Index"
          titleAr="مؤشر القدرات"
          value="67%"
          change={2.1}
          icon={<Brain />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="Critical Gaps"
          titleAr="فجوات حرجة"
          value="3"
          change={50}
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Ready Employees"
          titleAr="موظفون جاهزون"
          value="6"
          icon={<Users />}
          currentLang={l}
        />
        <StatsCard
          title="Role Readiness"
          titleAr="جاهزية الدور"
          value="72%"
          change={3.5}
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{l === "ar" ? "خريطة الفجوات" : "Gap Heatmap"}</CardTitle>
          </CardHeader>
          <HeatmapGrid
            data={heatmapData}
            employees={employees}
            competencies={competencies}
            currentLang={l}
          />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {l === "ar" ? "أهم الكفاءات المفقودة" : "Top Missing Competencies"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {topMissing.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.count} {l === "ar" ? "موظف" : "employees"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{item.gap.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{l === "ar" ? "فجوة" : "Gap"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
