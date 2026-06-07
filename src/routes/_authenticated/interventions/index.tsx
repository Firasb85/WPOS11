import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { Plus, BookOpen, TrendingUp, DollarSign, Target, Award } from "lucide-react";
export const Route = createFileRoute("/_authenticated/interventions/")({
  component: InterventionsPage,
});
function InterventionsPage() {
  const l = "ar";
  const interventions = [
    {
      code: "TRN-001",
      name: "Technical Training Program",
      nA: "برنامج تدريب تقني",
      type: "training",
      tA: "تدريب",
      cost: 5000,
      dur: "4 weeks",
      outcome: "Level 3 competence",
      rate: "85%",
      cases: 12,
    },
    {
      code: "TRN-002",
      name: "Data Analytics Training",
      nA: "تدريب تحليل البيانات",
      type: "training",
      tA: "تدريب",
      cost: 3500,
      dur: "3 weeks",
      outcome: "Independent analysis",
      rate: "78%",
      cases: 8,
    },
    {
      code: "COA-001",
      name: "One-on-One Coaching",
      nA: "تدريب فردي",
      type: "coaching",
      tA: "تدريب",
      cost: 2000,
      dur: "6 weeks",
      outcome: "Skill improvement",
      rate: "92%",
      cases: 15,
    },
    {
      code: "MEN-001",
      name: "Career Mentoring",
      nA: "إرشاد وظيفي",
      type: "mentoring",
      tA: "إرشاد",
      cost: 1000,
      dur: "12 weeks",
      outcome: "Career growth",
      rate: "88%",
      cases: 10,
    },
    {
      code: "PRO-001",
      name: "Process Redesign",
      nA: "إعادة تصميم العملية",
      type: "process_redesign",
      tA: "تصميم",
      cost: 15000,
      dur: "8 weeks",
      outcome: "20% efficiency",
      rate: "72%",
      cases: 5,
    },
    {
      code: "SYS-001",
      name: "System Upgrade",
      nA: "ترقية النظام",
      type: "system_fix",
      tA: "نظام",
      cost: 25000,
      dur: "4 weeks",
      outcome: "Issues resolved",
      rate: "95%",
      cases: 3,
    },
  ];
  return (
    <div>
      <PageHeader
        title="Intervention Library"
        titleAr="مكتبة التدخلات"
        description="Manage performance interventions and track effectiveness"
        descriptionAr="إدارة تدخلات الأداء وتتبع الفعالية"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "إضافة تدخل" : "Add Intervention"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Interventions"
          titleAr="إجمالي التدخلات"
          value="6"
          icon={<BookOpen />}
          currentLang={l}
        />
        <StatsCard
          title="Avg Success Rate"
          titleAr="متوسط النجاح"
          value="85%"
          change={3.5}
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Avg Cost"
          titleAr="متوسط التكلفة"
          value="$8,667"
          icon={<DollarSign />}
          currentLang={l}
        />
        <StatsCard
          title="Cases Applied"
          titleAr="حالات مطبقة"
          value="53"
          icon={<Target />}
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interventions.map((iv, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-400">{iv.code}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                {l === "ar" ? iv.tA : iv.type.replace("_", " ")}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              {l === "ar" ? iv.nA : iv.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              {iv.cost && `$${iv.cost.toLocaleString()}`} · {iv.dur}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {l === "ar" ? "نسبة النجاح" : "Success"}:{" "}
                <strong className="text-green-600">{iv.rate}</strong>
              </span>
              <span className="text-gray-500">
                {iv.cases} {l === "ar" ? "حالة" : "cases"}
              </span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-green-500" style={{ width: iv.rate }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
