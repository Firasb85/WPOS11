import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Play, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";
import { useProcesses } from "@/hooks/useProcesses";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/process-engineering/")({
  component: ProcessEngineeringPage,
});
function ProcessEngineeringPage() {
  const { t } = useLanguage();
  const { data: _processes, isLoading: _processesLoading } = useProcesses();
  const l = "ar";
  const executions = [
    {
      id: "1",
      proc: "Order Fulfillment",
      pA: "تنفيذ الطلبات",
      emp: "Ahmad Khalid",
      eA: "أحمد خالد",
      start: "2026-06-07 09:15",
      end: "2026-06-07 10:22",
      dur: "1h 07m",
      st: "completed",
      steps: 4,
      cp: 4,
      fail: 0,
    },
    {
      id: "2",
      proc: "Invoice Processing",
      pA: "معالجة الفواتير",
      emp: "Nadia Karim",
      eA: "نادية كريم",
      start: "2026-06-07 08:30",
      end: "2026-06-07 09:45",
      dur: "1h 15m",
      st: "completed",
      steps: 3,
      cp: 3,
      fail: 0,
    },
    {
      id: "3",
      proc: "Customer Registration",
      pA: "تسجيل العملاء",
      emp: "Omar Hassan",
      eA: "عمر حسن",
      start: "2026-06-07 10:00",
      st: "running",
      steps: 4,
      cp: 2,
      fail: 1,
      delay: 15,
    },
  ];
  const analytics = [
    {
      proc: "Order Fulfillment",
      pA: "تنفيذ الطلبات",
      exe: 24,
      avg: 12.5,
      fail: 3,
      rw: 5,
      del: 4.2,
    },
    {
      proc: "Invoice Processing",
      pA: "معالجة الفواتير",
      exe: 18,
      avg: 15.2,
      fail: 2,
      rw: 3,
      del: 6.8,
    },
    {
      proc: "Customer Registration",
      pA: "تسجيل العملاء",
      exe: 15,
      avg: 8.1,
      fail: 0,
      rw: 1,
      del: 1.5,
    },
  ];
  return (
    <div>
      <PageHeader
        title="Process Execution Engine"
        titleAr="محرك تنفيذ العمليات"
        description="Track and analyze process executions in real time"
        descriptionAr="تتبع وتحليل تنفيذ العمليات في الوقت الفعلي"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Today"
          titleAr="اليوم"
          value="7"
          icon={<Play />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Running"
          titleAr="قيد التشغيل"
          value="2"
          icon={<Activity />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title={t("Completed", "مكتمل")}
          titleAr="مكتملة"
          value="42"
          icon={<CheckCircle />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Failed"
          titleAr="فاشلة"
          value="3"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Avg Duration"
          titleAr="متوسط المدة"
          value="11.3m"
          icon={<Clock />}
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "التنفيذات الحية" : "Live Executions"}</CardTitle>
          </CardHeader>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Process", "Employee", "Duration", "Status"].map((h) => (
                  <th
                    key={h}
                    className={`px-3 py-2 text-xs font-semibold text-gray-500 ${l === "ar" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {executions.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium">{l === "ar" ? e.pA : e.proc}</td>
                  <td className="px-3 py-2 text-sm">{l === "ar" ? e.eA : e.emp}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{e.dur || "In progress"}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={e.st} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "تحليلات العمليات" : "Process Analytics"}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {analytics.map((a, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{l === "ar" ? a.pA : a.proc}</span>
                  <span className="text-sm font-bold">{a.exe}x</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {l === "ar" ? "متوسط" : "Avg"}: {a.avg}m
                  </span>
                  <span className="text-red-500">
                    {l === "ar" ? "فشل" : "Fail"}: {a.fail}
                  </span>
                  <span className="text-orange-500">
                    {l === "ar" ? "إعادة" : "Rework"}: {a.rw}
                  </span>
                  <span className="text-yellow-500">
                    {l === "ar" ? "تأخير" : "Delay"}: {a.del}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
