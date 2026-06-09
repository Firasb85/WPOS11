import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCompetencies } from "@/hooks/useCompetencies";
import { Brain, TrendingUp, Users, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics/competency-trends")({ component: CompetencyTrendsPage });

function CompetencyTrendsPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: comps, isLoading } = useCompetencies();
  const items = comps ?? [];
  const categories = [...new Set(items.map((c) => c.category))];

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Competency Trends" titleAr="اتجاهات الكفاءات" description="Track competency development trends across the organization" descriptionAr="تتبع اتجاهات تطوير الكفاءات عبر المنظمة" currentLang={lang} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center"><Brain className="w-6 h-6 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-gray-500">{t("Competencies","الكفاءات")}</p></Card>
        <Card className="p-4 text-center"><Users className="w-6 h-6 text-purple-600 mx-auto mb-1" /><p className="text-2xl font-bold">{categories.length}</p><p className="text-xs text-gray-500">{t("Categories","الفئات")}</p></Card>
        <Card className="p-4 text-center"><TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" /><p className="text-2xl font-bold">+12%</p><p className="text-xs text-gray-500">{t("Growth","النمو")}</p></Card>
        <Card className="p-4 text-center"><BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-1" /><p className="text-2xl font-bold">3.8</p><p className="text-xs text-gray-500">{t("Avg Level","المستوى المتوسط")}</p></Card>
      </div>
      <Card><CardHeader><CardTitle>{t("Competencies by Category","الكفاءات حسب الفئة")}</CardTitle></CardHeader>
        <div className="p-5 space-y-3">{categories.map((cat) => {
          const catItems = items.filter((c) => c.category === cat);
          const catLabels: Record<string,string> = { skill: t("Skills","مهارات"), behavior: t("Behaviors","سلوكيات"), knowledge: t("Knowledge","معرفة"), attitude: t("Attitudes","مواقف") };
          return (<div key={cat}>
            <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{catLabels[cat] || cat}</span><span className="text-sm text-gray-500">{catItems.length} {t("competencies","كفاءات")}</span></div>
            <div className="space-y-1">{catItems.map((c) => (<div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm">
              <span>{lang === "ar" ? c.competency_name_ar : c.competency_name_en}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{c.status || "active"}</span>
            </div>))}</div>
          </div>);
        })}</div>
      </Card>
    </div>
  );
}
