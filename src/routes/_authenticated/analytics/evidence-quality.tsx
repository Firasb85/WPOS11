import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEvidence } from "@/hooks/useDiagnosticWorkflow";
import { Shield, CheckCircle, AlertTriangle, BarChart3, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics/evidence-quality")({ component: EvidenceQualityPage });

function EvidenceQualityPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: evidence, isLoading } = useEvidence();
  const items = evidence ?? [];
  const highR = items.filter((e) => e.reliability === "high").length;
  const medR = items.filter((e) => e.reliability === "medium").length;
  const lowR = items.filter((e) => e.reliability === "low").length;
  const total = items.length || 1;
  const types = [...new Set(items.map((e) => e.evidence_type))];

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Evidence Quality" titleAr="جودة الأدلة" description="Analyze evidence reliability and coverage" descriptionAr="تحليل موثوقية الأدلة والتغطية" currentLang={lang} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center"><Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-gray-500">{t("Total Evidence","إجمالي الأدلة")}</p></Card>
        <Card className="p-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" /><p className="text-2xl font-bold text-green-600">{highR}</p><p className="text-xs text-gray-500">{t("High Reliability","موثوقية عالية")}</p></Card>
        <Card className="p-4 text-center"><AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" /><p className="text-2xl font-bold text-yellow-600">{medR}</p><p className="text-xs text-gray-500">{t("Medium","متوسطة")}</p></Card>
        <Card className="p-4 text-center"><AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" /><p className="text-2xl font-bold text-red-600">{lowR}</p><p className="text-xs text-gray-500">{t("Low","منخفضة")}</p></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>{t("Reliability Distribution","توزيع الموثوقية")}</CardTitle></CardHeader>
          <div className="p-5"><div className="flex h-8 rounded-lg overflow-hidden bg-gray-100 mb-2">
            {highR > 0 && <div className="bg-green-500 text-white text-xs font-bold flex items-center justify-center" style={{width:`${(highR/total)*100}%`}}>{highR}</div>}
            {medR > 0 && <div className="bg-yellow-400 text-gray-900 text-xs font-bold flex items-center justify-center" style={{width:`${(medR/total)*100}%`}}>{medR}</div>}
            {lowR > 0 && <div className="bg-red-500 text-white text-xs font-bold flex items-center justify-center" style={{width:`${(lowR/total)*100}%`}}>{lowR}</div>}
          </div></div>
        </Card>
        <Card><CardHeader><CardTitle>{t("Evidence by Type","الأدلة حسب النوع")}</CardTitle></CardHeader>
          <div className="p-5 space-y-2">{types.map((type) => {
            const count = items.filter((e) => e.evidence_type === type).length;
            const typeLabels: Record<string,string> = { quantitative: t("Quantitative","كمي"), qualitative: t("Qualitative","نوعي"), behavioral: t("Behavioral","سلوكي"), contextual: t("Contextual","سياقي"), system_generated: t("System","نظامي") };
            return (<div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-sm font-medium">{typeLabels[type] || type}</span>
              <span className="text-sm font-bold">{count}</span>
            </div>);
          })}</div>
        </Card>
      </div>
    </div>
  );
}
