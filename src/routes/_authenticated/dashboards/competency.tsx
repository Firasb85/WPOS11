import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { HeatmapGrid } from "~/components/wpos/visualizations/HeatmapGrid";
import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboards/competency")({
  component: CompetencyDashboardPage,
});

function CompetencyDashboardPage() {
  const l = "ar";
  const heatmapData = [
    {
      employeeId: "1",
      employeeName: "Ahmad Khalid",
      competencyName: "Data Analysis",
      currentLevel: 2,
      requiredLevel: 4,
      gap: 2,
    },
    {
      employeeId: "1",
      employeeName: "Ahmad Khalid",
      competencyName: "Leadership",
      currentLevel: 2,
      requiredLevel: 3,
      gap: 1,
    },
    {
      employeeId: "1",
      employeeName: "Ahmad Khalid",
      competencyName: "Communication",
      currentLevel: 3,
      requiredLevel: 3,
      gap: 0,
    },
    {
      employeeId: "2",
      employeeName: "Layla Ibrahim",
      competencyName: "Data Analysis",
      currentLevel: 3,
      requiredLevel: 3,
      gap: 0,
    },
    {
      employeeId: "2",
      employeeName: "Layla Ibrahim",
      competencyName: "Negotiation",
      currentLevel: 2,
      requiredLevel: 4,
      gap: 2,
    },
    {
      employeeId: "3",
      employeeName: "Omar Hassan",
      competencyName: "Time Management",
      currentLevel: 1,
      requiredLevel: 3,
      gap: 2,
    },
    {
      employeeId: "4",
      employeeName: "Nadia Karim",
      competencyName: "Technical",
      currentLevel: 3,
      requiredLevel: 4,
      gap: 1,
    },
    {
      employeeId: "5",
      employeeName: "Hussein Ali",
      competencyName: "Analytical Thinking",
      currentLevel: 4,
      requiredLevel: 4,
      gap: 0,
    },
  ];
  const employees = [...new Set(heatmapData.map((d) => d.employeeName))];
  const competencies = [...new Set(heatmapData.map((d) => d.competencyName))];
  const topMissing = [
    { name: l === "ar" ? "تحليل البيانات" : "Data Analysis", count: 3, gap: 1.7 },
    { name: l === "ar" ? "التفاوض" : "Negotiation", count: 2, gap: 2.0 },
    { name: l === "ar" ? "إدارة الوقت" : "Time Management", count: 2, gap: 1.5 },
  ];

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
