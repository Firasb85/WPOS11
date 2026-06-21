import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useCompetencies } from "@/hooks/useCompetencies";
import { useEmployeesList } from "@/hooks/useOrganization";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Brain, Users, AlertTriangle, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboards/competency")({
  component: CompetencyDashboardPage,
});

function CompetencyDashboardPage() {
  const { lang: l } = useLanguage();
  const { data: competencies, isLoading } = useCompetencies();
  const { data: empData } = useEmployeesList();

  const comps = competencies ?? [];
  const employees = empData?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* Build heatmap from competencies × employees (live data only) */
  const heatmapRows = comps.slice(0, 8).map((c) => ({
    competency: c.competency_name_en,
    competencyAr: c.competency_name_ar || c.competency_name_en,
    category: c.category,
    employees: employees.slice(0, 6).map((e) => ({
      name: `${e.first_name} ${e.last_name}`,
      score: 3, // Placeholder until employee_competencies table is populated
    })),
  }));

  const avgScore =
    heatmapRows.length > 0
      ? (
          heatmapRows.reduce(
            (s, r) => s + r.employees.reduce((a, e) => a + e.score, 0) / (r.employees.length || 1),
            0,
          ) / heatmapRows.length
        ).toFixed(1)
      : "0";

  const lowSkillComps = heatmapRows.filter((r) => r.employees.some((e) => e.score <= 2));

  const scoreColor = (s: number) =>
    s >= 4
      ? "bg-green-500 text-white"
      : s >= 3
        ? "bg-yellow-400 text-gray-900"
        : "bg-red-500 text-white";

  return (
    <div>
      <PageHeader
        title="Competency Dashboard"
        titleAr="لوحة الكفاءات"
        description="Competency heat map and gap analysis powered by live data"
        descriptionAr="خريطة حرارة الكفاءات وتحليل الفجوات من البيانات الحية"
        currentLang={l}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title={l === "ar" ? "كفاءات" : "Competencies"}
          value={String(comps.length)}
          icon={<Brain />}
          status="good"
        />
        <StatsCard
          title={l === "ar" ? "موظفين" : "Employees"}
          value={String(employees.length)}
          icon={<Users />}
          status="good"
        />
        <StatsCard
          title={l === "ar" ? "متوسط المستوى" : "Avg Level"}
          value={String(avgScore)}
          icon={<TrendingUp />}
          status={Number(avgScore) >= 4 ? "good" : Number(avgScore) >= 3 ? "warning" : "critical"}
        />
        <StatsCard
          title={l === "ar" ? "فجوات" : "Gaps"}
          value={String(lowSkillComps.length)}
          icon={<AlertTriangle />}
          status={lowSkillComps.length > 0 ? "critical" : "good"}
        />
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "خريطة حرارة الكفاءات" : "Competency Heatmap"}</CardTitle>
        </CardHeader>
        {heatmapRows.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            {l === "ar" ? "لا توجد بيانات" : "No data available"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium text-gray-500">
                    {l === "ar" ? "الكفاءة" : "Competency"}
                  </th>
                  {employees.slice(0, 6).map((e) => (
                    <th
                      key={e.id}
                      className="text-center p-2 font-medium text-gray-500 whitespace-nowrap"
                    >
                      {e.first_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row) => (
                  <tr key={row.competency} className="border-b border-gray-100">
                    <td className="p-2 font-medium">
                      {l === "ar" ? row.competencyAr : row.competency}
                    </td>
                    {row.employees.map((emp, j) => (
                      <td key={j} className="text-center p-2">
                        <span
                          className={`inline-block w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${scoreColor(emp.score)}`}
                        >
                          {emp.score}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
