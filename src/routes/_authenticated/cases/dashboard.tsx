import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cases/dashboard")({
  component: CaseDashboardPage,
});

function CaseDashboardPage() {
  const { t, lang: l } = useLanguage();

  const byStatus = [
    { status: "Open", statusAr: "مفتوحة", count: 12, color: "bg-blue-500" },
    { status: "Under Investigation", statusAr: "قيد التحقيق", count: 8, color: "bg-yellow-500" },
    { status: "Action Planned", statusAr: "تم التخطيط", count: 5, color: "bg-purple-500" },
    { status: "Monitoring", statusAr: "مراقبة", count: 3, color: "bg-orange-500" },
    { status: "Resolved", statusAr: "تم الحل", count: 18, color: "bg-green-500" },
    { status: "Closed", statusAr: "مغلقة", count: 24, color: "bg-gray-500" },
  ];

  const byPriority = [
    { priority: "Critical", priorityAr: "حرجة", count: 3, color: "text-red-600 bg-red-50" },
    { priority: "High", priorityAr: "عالية", count: 7, color: "text-orange-600 bg-orange-50" },
    { priority: "Medium", priorityAr: "متوسطة", count: 15, color: "text-yellow-600 bg-yellow-50" },
    { priority: "Low", priorityAr: "منخفضة", count: 5, color: "text-green-600 bg-green-50" },
  ];

  const monthly = [
    { month: "Jan", created: 8, resolved: 5 },
    { month: "Feb", created: 12, resolved: 9 },
    { month: "Mar", created: 6, resolved: 11 },
    { month: "Apr", created: 10, resolved: 7 },
    { month: "May", created: 9, resolved: 8 },
    { month: "Jun", created: 5, resolved: 6 },
  ];

  return (
    <div>
      <PageHeader
        title="Case Dashboard"
        titleAr="لوحة الحالات"
        description="Overview of all case management metrics"
        descriptionAr="نظرة عامة على مقاييس إدارة الحالات"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title={t("Total Cases", "إجمالي الحالات")} value="70" icon={<Briefcase />} />
        <StatsCard title={t("Open", "مفتوحة")} value="12" icon={<Clock />} status="warning" />
        <StatsCard
          title={t("Resolved", "تم الحل")}
          value="18"
          icon={<CheckCircle />}
          status="good"
        />
        <StatsCard
          title={t("Critical", "حرجة")}
          value="3"
          icon={<AlertTriangle />}
          status="critical"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Cases by Status", "الحالات حسب الحالة")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {byStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <span className="text-sm flex-1">{l === "ar" ? s.statusAr : s.status}</span>
                <span className="text-sm font-bold">{s.count}</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${(s.count / 70) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Cases by Priority", "الحالات حسب الأولوية")}</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {byPriority.map((p) => (
              <div key={p.priority} className={`p-4 rounded-lg ${p.color} text-center`}>
                <p className="text-2xl font-bold">{p.count}</p>
                <p className="text-xs font-medium mt-1">{l === "ar" ? p.priorityAr : p.priority}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Monthly Trend", "الاتجاه الشهري")}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                  {t("Month", "الشهر")}
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">
                  {t("Created", "أنشئت")}
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">
                  {t("Resolved", "حُلّت")}
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">
                  {t("Net", "صافي")}
                </th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m) => (
                <tr key={m.month} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{m.month}</td>
                  <td className="px-4 py-2 text-center text-blue-600">{m.created}</td>
                  <td className="px-4 py-2 text-center text-green-600">{m.resolved}</td>
                  <td
                    className={`px-4 py-2 text-center font-medium ${m.created - m.resolved > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {m.created - m.resolved > 0 ? "+" : ""}
                    {m.created - m.resolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
