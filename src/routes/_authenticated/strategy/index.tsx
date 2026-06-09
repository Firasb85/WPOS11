import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, Target } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/strategy/")({ component: StrategyPage });
function StrategyPage() {
  const { t, lang: l } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const strategies = [
    {
      code: "STR-2026-001",
      nE: "Operational Excellence 2026",
      nA: "التميز التشغيلي 2026",
      vision: "World-class operations",
      mission: "Achieve 95% operational efficiency",
      objectives: 4,
      initiatives: 6,
      scorecard: { financial: 3, customer: 2, process: 4, growth: 3 },
      st: "active",
    },
    {
      code: "STR-2026-002",
      nE: "Digital Transformation",
      nA: "التحول الرقمي",
      vision: "Digitally enabled workforce",
      mission: "Transform 80% of processes digitally",
      objectives: 3,
      initiatives: 5,
      scorecard: { financial: 2, customer: 3, process: 3, growth: 4 },
      st: "active",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Strategic Performance Management"
        titleAr="إدارة الأداء الاستراتيجي"
        description="Link vision, mission, strategic objectives, and balanced scorecards to KPIs"
        descriptionAr="ربط الرؤية والرسالة والأهداف الاستراتيجية وبطاقات الأداء المتوازنة بالمؤشرات"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "استراتيجية جديدة" : "New Strategy"}</span>
          </button>
        }
      />
      <div className="space-y-4">
        {strategies.map((s, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">{l === "ar" ? s.nA : s.nE}</h3>
                  <StatusBadge status={s.st} size="sm" />
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{s.code}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {l === "ar" ? "الرؤية" : "Vision"}
                </p>
                <p className="text-sm">{s.vision}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {l === "ar" ? "الرسالة" : "Mission"}
                </p>
                <p className="text-sm">{s.mission}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {Object.entries(s.scorecard).map(([k, v]) => (
                <div key={k} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 capitalize">{k}</p>
                  <p className="text-lg font-bold">{String(v)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {s.objectives} {l === "ar" ? "أهداف" : "objectives"}
              </span>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs">
                {s.initiatives} {l === "ar" ? "مبادرات" : "initiatives"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
