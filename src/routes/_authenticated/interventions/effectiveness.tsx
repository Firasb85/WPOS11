import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { TrendingUp, DollarSign, Target, Award} from "lucide-react";
import { useInterventionLibrary } from "@/hooks/useCases";
export const Route = createFileRoute("/_authenticated/interventions/effectiveness")({
  component: EffectivenessPage,
});
function EffectivenessPage() {
  const { data: _interventions, isLoading: _interventionsLoading } = useInterventionLibrary();
  const l = "ar";
  const rankings = [
    { name: "One-on-One Coaching", nA: "تدريب فردي", score: 92, roi: 380, cases: 15, imp: 24.5 },
    { name: "System Upgrade", nA: "ترقية النظام", score: 90, roi: 250, cases: 3, imp: 35.2 },
    { name: "Career Mentoring", nA: "إرشاد وظيفي", score: 88, roi: 180, cases: 10, imp: 18.1 },
    { name: "Technical Training", nA: "تدريب تقني", score: 85, roi: 220, cases: 12, imp: 22.8 },
    { name: "Process Redesign", nA: "إعادة تصميم", score: 72, roi: 310, cases: 5, imp: 28.3 },
  ];
  return (
    <div>
      <PageHeader
        title="Intervention Effectiveness Engine"
        titleAr="محرك فعالية التدخلات"
        description="Measure success rate, ROI, and improvement impact across all interventions"
        descriptionAr="قياس معدل النجاح والعائد على الاستثمار وتأثير التحسين عبر جميع التدخلات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Avg Success Rate"
          titleAr="متوسط النجاح"
          value="85%"
          icon={<Award />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Avg ROI"
          titleAr="متوسط العائد"
          value="268%"
          icon={<DollarSign />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Avg Improvement"
          titleAr="متوسط التحسن"
          value="25.8%"
          icon={<TrendingUp />}
          currentLang={l}
        />
        <StatsCard
          title="Total Cases"
          titleAr="إجمالي الحالات"
          value="45"
          icon={<Target />}
          currentLang={l}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Award className="w-4 h-4 inline mr-1" />
            {l === "ar" ? "تصنيف التدخلات" : "Intervention Rankings"}
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {rankings.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-blue-500"}`}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{l === "ar" ? r.nA : r.name}</span>
                  <span className="text-lg font-bold text-green-600">{r.score}%</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>ROI: {r.roi}%</span>
                  <span>
                    {r.cases} {l === "ar" ? "حالة" : "cases"}
                  </span>
                  <span>
                    {l === "ar" ? "تحسن" : "Imp"}: +{r.imp}%
                  </span>
                </div>
                <div className="mt-1.5 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${r.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
