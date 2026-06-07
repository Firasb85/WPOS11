import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import {
  Search,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Building2,
} from "lucide-react";
import { useRootCauseMetrics, useDiagnosticMetrics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/_authenticated/diagnostics/root-cause")({
  component: RootCauseDashboardPage,
});
function RootCauseDashboardPage() {
  const { data: rootCauses } = useRootCauseMetrics();
  const { data: diagMetrics } = useDiagnosticMetrics();
  const l = "ar";
  const causes = [
    {
      la: "Skill Gap",
      laAr: "فجوة مهارية",
      c: 12,
      p: 28,
      t: "increasing",
      ch: 15,
      top: "Data Analysis",
    },
    { la: "Process Issue", laAr: "مشكلة إجرائية", c: 10, p: 23, t: "stable", ch: 2, top: "—" },
    {
      la: "Knowledge Gap",
      laAr: "فجوة معرفية",
      c: 7,
      p: 16,
      t: "stable",
      ch: 1,
      top: "Product Knowledge",
    },
    {
      la: "Tool Issue",
      laAr: "مشكلة أدوات",
      c: 5,
      p: 12,
      t: "decreasing",
      ch: -8,
      top: "Technical",
    },
    { la: "Motivation", laAr: "تحفيز", c: 4, p: 9, t: "increasing", ch: 10, top: "—" },
    { la: "Management", laAr: "إدارة", c: 3, p: 7, t: "stable", ch: 0, top: "Leadership" },
    { la: "Resources", laAr: "موارد", c: 2, p: 5, t: "decreasing", ch: -5, top: "—" },
    { la: "Policy", laAr: "سياسات", c: 1, p: 2, t: "stable", ch: 0, top: "—" },
  ];
  const monthly = [
    { m: "Jan", sk: 5, pr: 4, kn: 3, to: 3, mv: 1 },
    { m: "Feb", sk: 6, pr: 5, kn: 3, to: 3, mv: 1 },
    { m: "Mar", sk: 7, pr: 6, kn: 4, to: 4, mv: 2 },
    { m: "Apr", sk: 9, pr: 7, kn: 5, to: 4, mv: 2 },
    { m: "May", sk: 10, pr: 8, kn: 5, to: 4, mv: 3 },
    { m: "Jun", sk: 12, pr: 10, kn: 7, to: 5, mv: 4 },
  ];
  const depts = [
    { d: "Operations", dA: "العمليات", sk: 6, pr: 5, kn: 3, to: 2, total: 16 },
    { d: "HR", dA: "الموارد البشرية", sk: 2, pr: 1, kn: 2, to: 1, total: 6 },
    { d: "Finance", dA: "المالية", sk: 3, pr: 2, kn: 1, to: 1, total: 7 },
    { d: "IT", dA: "تقنية المعلومات", sk: 1, pr: 2, kn: 1, to: 1, total: 5 },
  ];
  const TrendIcon = ({ trend }: { trend: string }) =>
    trend === "increasing" ? (
      <ArrowUp className="w-3 h-3 text-red-500" />
    ) : trend === "decreasing" ? (
      <ArrowDown className="w-3 h-3 text-green-500" />
    ) : (
      <Minus className="w-3 h-3 text-gray-400" />
    );
  return (
    <div>
      <PageHeader
        title="Root Cause Analysis Dashboard"
        titleAr="لوحة تحليل الأسباب الجذرية"
        description="Identify and analyze root causes of performance gaps"
        descriptionAr="تحديد وتحليل الأسباب الجذرية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Diagnoses"
          titleAr="الإجمالي"
          value="44"
          icon={<Search />}
          currentLang={l}
        />
        <StatsCard
          title="Top Cause"
          titleAr="السبب الأعلى"
          value={l === "ar" ? "فجوة مهارية" : "Skill Gap"}
          icon={<Brain />}
          currentLang={l}
        />
        <StatsCard
          title="Improving"
          titleAr="تتحسن"
          value="2"
          icon={<TrendingUp />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Worsening"
          titleAr="تتفاقم"
          value="2"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {l === "ar" ? "توزيع الأسباب الجذرية" : "Root Cause Distribution"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {causes.map((rc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
              >
                <span className="text-xs font-medium text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{l === "ar" ? rc.laAr : rc.la}</span>
                      {rc.top !== "—" && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                          {rc.top}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={rc.t} />
                      <span className="text-sm font-bold">{rc.c}</span>
                      <span className="text-xs text-gray-400">({rc.p}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rc.t === "increasing" ? "bg-red-500" : rc.t === "decreasing" ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${rc.p}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${rc.ch > 0 ? "bg-red-100 text-red-700" : rc.ch < 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {rc.ch > 0 ? "+" : ""}
                  {rc.ch}%
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "الاتجاه الشهري" : "Monthly Trends"}</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-left">
                    {l === "ar" ? "الشهر" : "Month"}
                  </th>
                  <th
                    className="px-3 py-2 text-xs font-semibold text-center"
                    style={{ color: "#ef4444" }}
                  >
                    {l === "ar" ? "مهارية" : "Skill"}
                  </th>
                  <th
                    className="px-3 py-2 text-xs font-semibold text-center"
                    style={{ color: "#f97316" }}
                  >
                    {l === "ar" ? "إجرائية" : "Process"}
                  </th>
                  <th
                    className="px-3 py-2 text-xs font-semibold text-center"
                    style={{ color: "#8b5cf6" }}
                  >
                    {l === "ar" ? "معرفية" : "Know"}
                  </th>
                  <th
                    className="px-3 py-2 text-xs font-semibold text-center"
                    style={{ color: "#06b6d4" }}
                  >
                    {l === "ar" ? "أدوات" : "Tool"}
                  </th>
                  <th
                    className="px-3 py-2 text-xs font-semibold text-center"
                    style={{ color: "#f59e0b" }}
                  >
                    {l === "ar" ? "تحفيز" : "Motv"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {monthly.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-3 py-2 text-sm font-medium">{m.m}</td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-red-600">
                      {m.sk}
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-orange-600">
                      {m.pr}
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-purple-600">
                      {m.kn}
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-cyan-600">
                      {m.to}
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-yellow-600">
                      {m.mv}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                  <td className="px-3 py-2 text-xs font-bold">
                    {l === "ar" ? "الإجمالي" : "Total"}
                  </td>
                  <td className="px-3 py-2 text-center text-xs font-bold text-red-600">
                    {monthly.reduce((s, m) => s + m.sk, 0)}
                  </td>
                  <td className="px-3 py-2 text-center text-xs font-bold text-orange-600">
                    {monthly.reduce((s, m) => s + m.pr, 0)}
                  </td>
                  <td className="px-3 py-2 text-center text-xs font-bold text-purple-600">
                    {monthly.reduce((s, m) => s + m.kn, 0)}
                  </td>
                  <td className="px-3 py-2 text-center text-xs font-bold text-cyan-600">
                    {monthly.reduce((s, m) => s + m.to, 0)}
                  </td>
                  <td className="px-3 py-2 text-center text-xs font-bold text-yellow-600">
                    {monthly.reduce((s, m) => s + m.mv, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Building2 className="w-4 h-4 inline mr-1" />
            {l === "ar" ? "الأسباب حسب الإدارة" : "Causes by Department"}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase ${l === "ar" ? "text-right" : "text-left"}`}
                >
                  {l === "ar" ? "الإدارة" : "Department"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-center">
                  {l === "ar" ? "مهارية" : "Skill"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-center">
                  {l === "ar" ? "إجرائية" : "Process"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-center">
                  {l === "ar" ? "معرفية" : "Know"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-center">
                  {l === "ar" ? "أدوات" : "Tool"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-center">
                  {l === "ar" ? "الإجمالي" : "Total"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {depts.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td
                    className={`px-4 py-3 text-sm font-medium ${l === "ar" ? "text-right" : "text-left"}`}
                  >
                    {l === "ar" ? d.dA : d.d}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{d.sk}</td>
                  <td className="px-4 py-3 text-center text-sm">{d.pr}</td>
                  <td className="px-4 py-3 text-center text-sm">{d.kn}</td>
                  <td className="px-4 py-3 text-center text-sm">{d.to}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold">{d.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
