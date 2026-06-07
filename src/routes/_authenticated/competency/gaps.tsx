import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { HeatmapGrid } from "~/components/wpos/visualizations/HeatmapGrid";
import { Brain, AlertTriangle, TrendingUp, Users, Download } from "lucide-react";
import { useEmployeeCompetencies } from "@/hooks/useCompetencies";

export const Route = createFileRoute("/_authenticated/competency/gaps")({
  component: CompetencyGapsPage,
});

function CompetencyGapsPage() {
  const { data: empComps } = useEmployeeCompetencies();
  const currentLang = "ar";
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
      employeeId: "2",
      employeeName: "Layla Ibrahim",
      competencyName: "Communication",
      currentLevel: 4,
      requiredLevel: 3,
      gap: -1,
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
      employeeId: "3",
      employeeName: "Omar Hassan",
      competencyName: "Communication",
      currentLevel: 2,
      requiredLevel: 3,
      gap: 1,
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

  return (
    <div>
      <PageHeader
        title="Competency Gap Analysis"
        titleAr="تحليل فجوات الكفاءات"
        description="Identify and analyze competency gaps"
        descriptionAr="تحديد وتحليل فجوات الكفاءات"
        currentLang={currentLang}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm">
            <Download className="w-4 h-4" />
            <span>{currentLang === "ar" ? "تصدير" : "Export"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {currentLang === "ar" ? "فجوات حرجة" : "Critical Gaps"}
              </p>
              <p className="text-xl font-bold text-red-600">3</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {currentLang === "ar" ? "فجوات متوسطة" : "Medium Gaps"}
              </p>
              <p className="text-xl font-bold text-yellow-600">3</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {currentLang === "ar" ? "مستوى متطابق" : "Matching"}
              </p>
              <p className="text-xl font-bold text-green-600">6</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {currentLang === "ar" ? "مؤشر الجاهزية" : "Readiness"}
              </p>
              <p className="text-xl font-bold text-blue-600">67%</p>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLang === "ar" ? "خريطة حرارية للكفاءات" : "Competency Heatmap"}
          </CardTitle>
        </CardHeader>
        <HeatmapGrid
          data={heatmapData}
          employees={employees}
          competencies={competencies}
          currentLang={currentLang}
        />
      </Card>
    </div>
  );
}
