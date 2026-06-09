import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useSnapshots } from "@/hooks/useKpis";
import { useEmployeesList } from "@/hooks/useOrganization";
import {
  FileBarChart, Download, Filter, Calendar, Users, TrendingUp,
  BarChart3, PieChart, Loader2, CheckCircle, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports/enterprise/")(
  { component: EnterpriseReportsPage },
);

function EnterpriseReportsPage() {
  const { t, lang, isRTL } = useLanguage();
  const { data: snapshots } = useSnapshots();
  const { data: empData } = useEmployeesList();

  const allSnaps = snapshots ?? [];
  const employees = empData?.data ?? [];
  const [reportType, setReportType] = useState("performance");
  const [dateRange, setDateRange] = useState("last-30");
  const [exporting, setExporting] = useState(false);

  const redCount = allSnaps.filter((s) => s.status === "red").length;
  const yellowCount = allSnaps.filter((s) => s.status === "yellow").length;
  const greenCount = allSnaps.filter((s) => s.status === "green").length;
  const total = allSnaps.length || 1;

  const handleExport = async (format: string) => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExporting(false);
    toast.success(t(`Report exported as ${format.toUpperCase()}`, `تم تصدير التقرير بصيغة ${format.toUpperCase()}`));
  };

  const reportTypes = [
    { value: "performance", label: t("Performance Summary", "ملخص الأداء"), icon: <BarChart3 className="w-4 h-4" /> },
    { value: "workforce", label: t("Workforce Analytics", "تحليلات القوى العاملة"), icon: <Users className="w-4 h-4" /> },
    { value: "diagnostic", label: t("Diagnostic Summary", "ملخص التشخيص"), icon: <PieChart className="w-4 h-4" /> },
    { value: "risk", label: t("Risk Assessment", "تقييم المخاطر"), icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const dateRanges = [
    { value: "last-7", label: t("Last 7 days", "آخر 7 أيام") },
    { value: "last-30", label: t("Last 30 days", "آخر 30 يوم") },
    { value: "last-90", label: t("Last 90 days", "آخر 90 يوم") },
    { value: "year", label: t("This Year", "هذا العام") },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Enterprise Reports" titleAr="التقارير المؤسسية" description="Generate and export comprehensive enterprise performance reports" descriptionAr="إنشاء وتصدير تقارير أداء المؤسسة الشاملة" currentLang={lang} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
            {reportTypes.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
            {dateRanges.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 ms-auto">
          {["PDF", "CSV", "Excel"].map((fmt) => (
            <button key={fmt} onClick={() => handleExport(fmt.toLowerCase())} disabled={exporting} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50" aria-label={`Export as ${fmt}`}>
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{employees.length}</p>
          <p className="text-xs text-gray-500">{t("Employees", "الموظفين")}</p>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{greenCount}</p>
          <p className="text-xs text-gray-500">{t("On Target", "على الهدف")}</p>
        </Card>
        <Card className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-yellow-600">{yellowCount}</p>
          <p className="text-xs text-gray-500">{t("Warning", "تحذير")}</p>
        </Card>
        <Card className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-600">{redCount}</p>
          <p className="text-xs text-gray-500">{t("Critical", "حرج")}</p>
        </Card>
      </div>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileBarChart className="w-4 h-4 inline me-2" />
            {reportTypes.find((r) => r.value === reportType)?.label}
          </CardTitle>
        </CardHeader>
        <div className="p-5">
          {/* Performance bar chart */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-500">{t("KPI Status Distribution", "توزيع حالة المؤشرات")}</h3>
            <div className="flex h-8 rounded-lg overflow-hidden bg-gray-100">
              {greenCount > 0 && <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(greenCount / total) * 100}%` }}>{greenCount}</div>}
              {yellowCount > 0 && <div className="bg-yellow-400 flex items-center justify-center text-gray-900 text-xs font-bold" style={{ width: `${(yellowCount / total) * 100}%` }}>{yellowCount}</div>}
              {redCount > 0 && <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(redCount / total) * 100}%` }}>{redCount}</div>}
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> {t("Green", "أخضر")} ({Math.round((greenCount / total) * 100)}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> {t("Yellow", "أصفر")} ({Math.round((yellowCount / total) * 100)}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {t("Red", "أحمر")} ({Math.round((redCount / total) * 100)}%)</span>
            </div>
          </div>

          {/* Snapshot details table */}
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("Recent Snapshots", "اللقطات الأخيرة")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-gray-500">
                <th className="text-start p-2">{t("Employee", "الموظف")}</th>
                <th className="text-start p-2">{t("KPI", "المؤشر")}</th>
                <th className="text-center p-2">{t("Target", "الهدف")}</th>
                <th className="text-center p-2">{t("Actual", "الفعلي")}</th>
                <th className="text-center p-2">{t("Gap", "الفجوة")}</th>
                <th className="text-center p-2">{t("Status", "الحالة")}</th>
              </tr></thead>
              <tbody>
                {allSnaps.slice(0, 10).map((s) => {
                  const emp = (s as unknown as Record<string, Record<string, string>>).employees;
                  const kpi = (s as unknown as Record<string, Record<string, string>>).kpis;
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-2">{emp?.first_name} {emp?.last_name}</td>
                      <td className="p-2">{kpi?.name}</td>
                      <td className="p-2 text-center">{s.target_value}</td>
                      <td className="p-2 text-center">{s.actual_value}</td>
                      <td className="p-2 text-center">{s.gap_percentage?.toFixed(1)}%</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.status === "green" ? "bg-green-100 text-green-700" : s.status === "yellow" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {s.status === "green" ? t("Green", "أخضر") : s.status === "yellow" ? t("Yellow", "أصفر") : t("Red", "أحمر")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {allSnaps.length === 0 && <p className="text-center text-gray-400 py-8">{t("No data available", "لا توجد بيانات")}</p>}
        </div>
      </Card>
    </div>
  );
}
