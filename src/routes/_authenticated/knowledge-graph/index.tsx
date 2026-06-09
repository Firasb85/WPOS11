import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCompetencies } from "@/hooks/useCompetencies";
import { useProcesses } from "@/hooks/useProcesses";
import { useKpis } from "@/hooks/useKpis";
import { Share2, Brain, GitMerge, Gauge, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/knowledge-graph/")({ component: KnowledgeGraphPage });

function KnowledgeGraphPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: comps } = useCompetencies();
  const { data: procs } = useProcesses();
  const { data: kpis } = useKpis();

  const nodes = [
    { type: t("Competencies","الكفاءات"), count: (comps ?? []).length, icon: <Brain className="w-5 h-5 text-purple-600" />, color: "bg-purple-50 border-purple-200" },
    { type: t("Processes","العمليات"), count: (procs ?? []).length, icon: <GitMerge className="w-5 h-5 text-blue-600" />, color: "bg-blue-50 border-blue-200" },
    { type: t("KPIs","المؤشرات"), count: (kpis ?? []).length, icon: <Gauge className="w-5 h-5 text-green-600" />, color: "bg-green-50 border-green-200" },
  ];

  const relationships = [
    { from: t("Competencies","الكفاءات"), to: t("Processes","العمليات"), label: t("Required by","مطلوبة لـ") },
    { from: t("Processes","العمليات"), to: t("KPIs","المؤشرات"), label: t("Measured by","تقاس بـ") },
    { from: t("KPIs","المؤشرات"), to: t("Competencies","الكفاءات"), label: t("Drives development of","تدفع تطوير") },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Knowledge Graph" titleAr="الرسم المعرفي" description="Visualize relationships between competencies, processes, and KPIs" descriptionAr="عرض العلاقات بين الكفاءات والعمليات والمؤشرات" currentLang={lang} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {nodes.map((n) => (<Card key={n.type} className={`p-5 border-2 ${n.color}`}><div className="flex items-center gap-3">{n.icon}<div><p className="text-lg font-bold">{n.count}</p><p className="text-sm text-gray-500">{n.type}</p></div></div></Card>))}
      </div>
      <Card><CardHeader><CardTitle><Share2 className="w-4 h-4 inline me-2" />{t("Entity Relationships","علاقات الكيانات")}</CardTitle></CardHeader>
        <div className="p-5 space-y-4">
          {relationships.map((r, i) => (<div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="font-medium text-sm">{r.from}</span><ArrowRight className="w-4 h-4 text-blue-500" /><span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{r.label}</span><ArrowRight className="w-4 h-4 text-blue-500" /><span className="font-medium text-sm">{r.to}</span>
          </div>))}
        </div>
      </Card>
    </div>
  );
}
