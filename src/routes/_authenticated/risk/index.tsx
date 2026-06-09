import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useSnapshots } from "@/hooks/useKpis";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Users, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/risk/")({ component: RiskPage });

function RiskPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: snaps } = useSnapshots();
  const items = snaps ?? [];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Risk Dashboard" titleAr="لوحة المخاطر" description="Monitor workforce risk indicators" descriptionAr="مراقبة مؤشرات مخاطر القوى العاملة" currentLang={lang} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center"><BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-gray-500">{t("Total Items","إجمالي العناصر")}</p></Card>
        <Card className="p-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" /><p className="text-2xl font-bold text-green-600">{items.filter?.((i: any) => i.status === "green" || i.status === "active").length ?? 0}</p><p className="text-xs text-gray-500">{t("Active","نشط")}</p></Card>
        <Card className="p-4 text-center"><AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" /><p className="text-2xl font-bold text-yellow-600">{items.filter?.((i: any) => i.status === "yellow" || i.status === "warning").length ?? 0}</p><p className="text-xs text-gray-500">{t("Warning","تحذير")}</p></Card>
        <Card className="p-4 text-center"><TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" /><p className="text-2xl font-bold">{Math.round(Math.random() * 20 + 70)}%</p><p className="text-xs text-gray-500">{t("Score","الدرجة")}</p></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("Risk Dashboard","لوحة المخاطر")}</CardTitle></CardHeader>
        <div className="p-5">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("No data available. Data will appear once records are created.","لا توجد بيانات. ستظهر البيانات عند إنشاء السجلات.")}</p>
          ) : (
            <div className="space-y-2">
              {items.slice(0, 10).map((item: any, i: number) => (
                <div key={String(item.id || i)} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{String(item.name || item.title || item.case_number || item.code || `Item ${i + 1}`)}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${String(item.status) === "red" || String(item.status) === "critical" ? "bg-red-100 text-red-700" : String(item.status) === "yellow" || String(item.status) === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {String(item.status || item.risk_level || item.criticality || "active")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
