import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { FormSelect, FormInput } from "~/components/wpos/FormInput";
import { Play, BarChart3, Brain, DollarSign, TrendingUp, Target } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/simulations/")({
  component: SimulationsPage,
});
function SimulationsPage() {
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const scenarios = [
    {
      nE: "Data Analysis Training Impact",
      nA: "تأثير تدريب تحليل البيانات",
      type: "training",
      params: { employees: 3, duration: "4 weeks", cost: 10500 },
      impact: { improvement: "15-25%", confidence: "78%", timeline: "6-8 weeks", cost: 10500 },
      st: "completed",
    },
    {
      nE: "Process Redesign - Order Fulfillment",
      nA: "إعادة تصميم العملية - تنفيذ الطلبات",
      type: "process_change",
      params: { processes: 2, duration: "8 weeks" },
      impact: { improvement: "20-35%", confidence: "72%", timeline: "10-12 weeks", cost: 15000 },
      st: "draft",
    },
    {
      nE: "Resource Reallocation",
      nA: "إعادة توزيع الموارد",
      type: "resource",
      params: { employees: 5, from: "Support", to: "Operations" },
      impact: { improvement: "8-15%", confidence: "65%", timeline: "4-6 weeks", cost: 5000 },
      st: "draft",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Scenario Simulation Engine"
        titleAr="محرك محاكاة السيناريوهات"
        description="Model what-if impacts of training, process changes, workload shifts, and resource allocation"
        descriptionAr="نمذجة تأثيرات ماذا لو للتدريب وتغييرات العمليات وتحولات عبء العمل وتخصيص الموارد"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Simulations" titleAr="محاكات" value="3" icon={<Play />} currentLang={l} />
        <StatsCard
          title="Avg Confidence"
          titleAr="متوسط الثقة"
          value="72%"
          icon={<Brain />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Avg Improvement"
          titleAr="متوسط التحسن"
          value="20%"
          icon={<TrendingUp />}
          currentLang={l}
        />
        <StatsCard
          title="Total Investment"
          titleAr="إجمالي الاستثمار"
          value="$30.5K"
          icon={<DollarSign />}
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {scenarios.map((s, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Target
                      className={`w-4 h-4 ${s.type === "training" ? "text-blue-500" : s.type === "process_change" ? "text-purple-500" : "text-green-500"}`}
                    />
                    <h3 className="font-medium">{l === "ar" ? s.nA : s.nE}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">
                    {s.type.replace("_", " ")}
                  </p>
                </div>
                <StatusBadge status={s.st} size="sm" />
              </div>
              {s.impact ? (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {Object.entries(s.impact).map(([k, v]) => (
                    <div key={k} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-center">
                      <p className="text-[10px] text-gray-500 capitalize">{k}</p>
                      <p className="text-sm font-bold">{String(v)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">
                    {l === "ar" ? "لم يتم تشغيل المحاكاة بعد" : "Not yet simulated"}
                  </p>
                  <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                    <Play className="w-3 h-3 inline mr-1" />
                    {l === "ar" ? "تشغيل المحاكاة" : "Run Simulation"}
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Play className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "محاكاة جديدة" : "New Simulation"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <FormSelect
              label={l === "ar" ? "النوع" : "Type"}
              labelAr="النوع"
              options={[
                { value: "training", label: "Training Impact", labelAr: "تأثير تدريب" },
                { value: "process_change", label: "Process Change", labelAr: "تغيير عملية" },
                { value: "workload", label: "Workload Shift", labelAr: "تحول عبء عمل" },
                { value: "resource", label: "Resource Allocation", labelAr: "تخصيص موارد" },
              ]}
              value="training"
              currentLang={l}
            />
            <FormInput
              label={l === "ar" ? "المعايير" : "Parameters"}
              labelAr="المعايير"
              placeholder={l === "ar" ? "وصف السيناريو..." : "Describe scenario..."}
              currentLang={l}
            />
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Play className="w-4 h-4 inline mr-1" />
              <span>{l === "ar" ? "تشغيل المحاكاة" : "Run Simulation"}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
