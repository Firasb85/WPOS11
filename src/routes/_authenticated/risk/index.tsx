import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Shield, AlertTriangle, Users, Building2, ArrowUp, ArrowDown } from "lucide-react";
export const Route = createFileRoute("/_authenticated/risk/")({ component: RiskDashboardPage });
function RiskDashboardPage() {
  const l = "ar";
  const deptScores = [
    { name: "Operations", nA: "العمليات", s: 72, l: "high", e: 12 },
    { name: "Finance", nA: "المالية", s: 55, l: "medium", e: 6 },
    { name: "HR", nA: "الموارد البشرية", s: 35, l: "low", e: 8 },
    { name: "IT", nA: "تقنية المعلومات", s: 28, l: "low", e: 5 },
  ];
  const empScores = [
    {
      name: "Ahmad Khalid",
      nA: "أحمد خالد",
      dept: "Operations",
      dA: "العمليات",
      s: 85,
      l: "critical",
    },
    { name: "Omar Hassan", nA: "عمر حسن", dept: "Operations", dA: "العمليات", s: 72, l: "high" },
    {
      name: "Layla Ibrahim",
      nA: "ليلى إبراهيم",
      dept: "HR",
      dA: "الموارد البشرية",
      s: 45,
      l: "medium",
    },
    { name: "Nadia Karim", nA: "نادية كريم", dept: "Finance", dA: "المالية", s: 35, l: "low" },
    { name: "Hussein Ali", nA: "حسين علي", dept: "IT", dA: "تقنية المعلومات", s: 20, l: "low" },
  ];
  const dist = [
    { lvl: "Critical", lvlA: "حرجة", c: 2, p: 8 },
    { lvl: "High", lvlA: "عالية", c: 5, p: 20 },
    { lvl: "Medium", lvlA: "متوسطة", c: 8, p: 32 },
    { lvl: "Low", lvlA: "منخفضة", c: 10, p: 40 },
  ];
  return (
    <div>
      <PageHeader
        title="Workforce Risk Scoring"
        titleAr="تسجيل مخاطر القوى العاملة"
        description="Risk assessment across employees, teams, and departments"
        descriptionAr="تقييم المخاطر عبر الموظفين والفرق والإدارات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Avg Risk Score"
          titleAr="متوسط المخاطرة"
          value="48"
          change={-3.2}
          icon={<Shield />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Critical Risk"
          titleAr="مخاطرة حرجة"
          value="2"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Employees at Risk"
          titleAr="موظفون معرضون"
          value="7"
          icon={<Users />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="Departments"
          titleAr="الإدارات"
          value="4"
          icon={<Building2 />}
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "توزيع المخاطر" : "Risk Distribution"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {dist.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span
                    className={`font-medium ${d.lvl === "Critical" ? "text-red-600" : d.lvl === "High" ? "text-orange-600" : d.lvl === "Medium" ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {l === "ar" ? d.lvlA : d.lvl}
                  </span>
                  <span className="font-bold">
                    {d.c} ({d.p}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.lvl === "Critical" ? "bg-red-500" : d.lvl === "High" ? "bg-orange-500" : d.lvl === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${d.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{l === "ar" ? "مخاطر الإدارات" : "Department Risk Scores"}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {deptScores.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium w-28">{l === "ar" ? d.nA : d.name}</span>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.s >= 70 ? "bg-red-500" : d.s >= 40 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${d.s}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-10 text-right">{d.s}</span>
                <StatusBadge
                  status={d.l === "high" ? "red" : d.l === "medium" ? "yellow" : "green"}
                  size="sm"
                  label={d.l}
                />
                <span className="text-xs text-gray-400">{d.e} emp</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "مخاطر الموظفين" : "Employee Risk Scores"}</CardTitle>
        </CardHeader>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">
                {l === "ar" ? "الموظف" : "Employee"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">
                {l === "ar" ? "الإدارة" : "Dept"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">
                {l === "ar" ? "المخاطرة" : "Risk"}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">
                {l === "ar" ? "المستوى" : "Level"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empScores.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{l === "ar" ? e.nA : e.name}</td>
                <td className="px-4 py-3 text-sm">{l === "ar" ? e.dA : e.dept}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${e.s >= 70 ? "bg-red-500" : e.s >= 40 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${e.s}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{e.s}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={e.l === "critical" ? "red" : e.l === "high" ? "yellow" : "green"}
                    size="sm"
                    label={e.l}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
