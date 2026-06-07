import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import {
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/evidence/dashboards/")({
  component: EvidenceDashboardPage,
});
function EvidenceDashboardPage() {
  const l = "ar";
  const byType = [
    {
      type: "system_generated",
      la: "System Generated",
      laAr: "منشأ من النظام",
      c: 15,
      p: 41,
      co: "bg-blue-500",
    },
    { type: "quantitative", la: "Quantitative", laAr: "كمي", c: 10, p: 27, co: "bg-green-500" },
    { type: "qualitative", la: "Qualitative", laAr: "نوعي", c: 6, p: 16, co: "bg-purple-500" },
    { type: "behavioral", la: "Behavioral", laAr: "سلوكي", c: 3, p: 8, co: "bg-orange-500" },
    { type: "contextual", la: "Contextual", laAr: "سياقي", c: 2, p: 5, co: "bg-pink-500" },
    { type: "temporal", la: "Temporal", laAr: "زمني", c: 1, p: 3, co: "bg-teal-500" },
  ];
  const reliability = [
    { ra: "High (85-100)", c: 12, co: "bg-green-500" },
    { ra: "Medium (60-84)", c: 8, co: "bg-yellow-500" },
    { ra: "Low (40-59)", c: 4, co: "bg-orange-500" },
    { ra: "Very Low (0-39)", c: 2, co: "bg-red-500" },
  ];
  const recent = [
    {
      id: "1",
      src: "System Logs - KPI Report",
      t: "system_generated",
      tA: "منشأ من النظام",
      rl: 95,
      dt: "2026-06-06",
      st: "verified" as const,
    },
    {
      id: "2",
      src: "Supervisor Observation",
      t: "qualitative",
      tA: "نوعي",
      rl: 60,
      dt: "2026-06-05",
      st: "pending" as const,
    },
    {
      id: "3",
      src: "Attendance System",
      t: "system_generated",
      tA: "منشأ من النظام",
      rl: 95,
      dt: "2026-06-04",
      st: "verified" as const,
    },
    {
      id: "4",
      src: "Customer Feedback Q2",
      t: "quantitative",
      tA: "كمي",
      rl: 85,
      dt: "2026-06-03",
      st: "unverified" as const,
    },
    {
      id: "5",
      src: "Peer Feedback",
      t: "behavioral",
      tA: "سلوكي",
      rl: 40,
      dt: "2026-06-02",
      st: "unverified" as const,
    },
  ];
  const cols = [
    {
      key: "src",
      label: "Source",
      labelAr: "المصدر",
      render: (i) => (
        <div className="flex items-center gap-2">
          {i.t === "system_generated" ? (
            <Eye className="w-4 h-4 text-blue-500" />
          ) : i.t === "quantitative" ? (
            <FileText className="w-4 h-4 text-green-500" />
          ) : i.t === "qualitative" ? (
            <UserCheck className="w-4 h-4 text-purple-500" />
          ) : (
            <Clock className="w-4 h-4 text-orange-500" />
          )}
          <span className="text-sm font-medium">{i.src}</span>
        </div>
      ),
    },
    {
      key: "t",
      label: "Type",
      labelAr: "النوع",
      render: (i) => (
        <span className="text-xs text-gray-500">{l === "ar" ? i.tA : i.t.replace("_", " ")}</span>
      ),
    },
    {
      key: "rl",
      label: "Reliability",
      labelAr: "الموثوقية",
      render: (i) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${i.rl >= 85 ? "bg-green-500" : i.rl >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${i.rl}%` }}
            />
          </div>
          <span className="text-xs font-medium">{i.rl}%</span>
        </div>
      ),
    },
    { key: "dt", label: "Date", labelAr: "التاريخ" },
    {
      key: "st",
      label: "Status",
      labelAr: "الحالة",
      render: (i) => <StatusBadge status={i.st} />,
    },
  ];
  return (
    <div>
      <PageHeader
        title="Evidence Dashboard"
        titleAr="لوحة الأدلة"
        description="Monitor evidence collection, reliability, and verification"
        descriptionAr="مراقبة جمع الأدلة والموثوقية والتحقق"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Evidence"
          titleAr="إجمالي الأدلة"
          value="37"
          icon={<Shield />}
          currentLang={l}
        />
        <StatsCard
          title="Avg Reliability"
          titleAr="متوسط الموثوقية"
          value="78%"
          change={3.2}
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Verified"
          titleAr="موثقة"
          value="22"
          change={15}
          icon={<CheckCircle />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Pending Review"
          titleAr="قيد المراجعة"
          value="8"
          icon={<AlertTriangle />}
          status="warning"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "توزيع الأدلة حسب النوع" : "Evidence by Type"}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {byType.map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28">
                  {l === "ar" ? item.laAr : item.la}
                </span>
                <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.co} flex items-center justify-end pr-2`}
                    style={{ width: `${item.p}%` }}
                  >
                    {item.p > 15 && (
                      <span className="text-[10px] text-white font-medium">{item.p}%</span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold w-8 text-right">{item.c}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "توزيع الموثوقية" : "Reliability Distribution"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {reliability.map((item) => (
              <div key={item.ra}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{item.ra}</span>
                  <span className="font-bold">
                    {item.c} {l === "ar" ? "دليل" : "items"}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.co}`}
                    style={{ width: `${(item.c / 26) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "أحدث الأدلة" : "Recent Evidence"}</CardTitle>
        </CardHeader>
        <DataTable columns={cols} data={recent} currentLang={l} />
      </Card>
    </div>
  );
}
