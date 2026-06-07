import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import {
  Plus,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/_authenticated/cases/")({ component: CasesPage });
function CasesPage() {
  const l = "ar";
  const stats = [
    { title: "Total Cases", tA: "إجمالي الحالات", v: "28", ic: <Briefcase className="w-5 h-5" /> },
    {
      title: "Open",
      tA: "مفتوحة",
      v: "9",
      ic: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      st: "warning",
    },
    {
      title: "Resolved",
      tA: "تم الحل",
      v: "15",
      ic: <CheckCircle className="w-5 h-5 text-green-600" />,
      st: "good",
    },
    {
      title: "Critical",
      tA: "حرجة",
      v: "3",
      ic: <AlertTriangle className="w-5 h-5 text-red-600" />,
      st: "critical",
    },
  ];
  const cases = [
    {
      id: "1",
      num: "CAS-001",
      emp: "Ahmad Khalid",
      empAr: "أحمد خالد",
      dept: "Operations",
      deptAr: "العمليات",
      cause: "Skill Gap",
      causeAr: "فجوة مهارية",
      pri: "high",
      priAr: "عالية",
      st: "open",
      dt: "2026-06-04",
      due: "2026-07-04",
    },
    {
      id: "2",
      num: "CAS-002",
      emp: "Omar Hassan",
      empAr: "عمر حسن",
      dept: "Operations",
      deptAr: "العمليات",
      cause: "Attendance",
      causeAr: "حضور",
      pri: "critical",
      priAr: "حرجة",
      st: "under_investigation",
      dt: "2026-06-03",
      due: "2026-06-25",
    },
    {
      id: "3",
      num: "CAS-003",
      emp: "Layla Ibrahim",
      empAr: "ليلى إبراهيم",
      dept: "HR",
      deptAr: "الموارد البشرية",
      cause: "Knowledge Gap",
      causeAr: "فجوة معرفية",
      pri: "medium",
      priAr: "متوسطة",
      st: "action_planned",
      dt: "2026-06-01",
      due: "2026-06-30",
    },
    {
      id: "4",
      num: "CAS-004",
      emp: "Nadia Karim",
      empAr: "نادية كريم",
      dept: "Finance",
      deptAr: "المالية",
      cause: "Tool Issue",
      causeAr: "مشكلة أدوات",
      pri: "low",
      priAr: "منخفضة",
      st: "monitoring",
      dt: "2026-05-28",
      due: "2026-07-15",
    },
  ];
  const [sel, setSel] = useState<string | null>(null);
  const cols = [
    {
      key: "num",
      label: "Case",
      labelAr: "الحالة",
      sortable: true,
      render: (i) => <span className="font-mono text-xs font-medium">{i.num}</span>,
    },
    {
      key: "emp",
      label: "Employee",
      labelAr: "الموظف",
      render: (i) => <span className="text-sm font-medium">{l === "ar" ? i.empAr : i.emp}</span>,
    },
    { key: "cause", label: "Root Cause", labelAr: "السبب الجذري" },
    {
      key: "pri",
      label: "Priority",
      labelAr: "الأولوية",
      render: (i) => (
        <StatusBadge
          status={i.pri === "critical" ? "red" : i.pri === "high" ? "yellow" : "green"}
          size="sm"
          label={l === "ar" ? i.priAr : i.pri}
        />
      ),
    },
    {
      key: "st",
      label: "Status",
      labelAr: "الحالة",
      render: (i) => <StatusBadge status={i.st} />,
    },
    { key: "due", label: "Due Date", labelAr: "تاريخ الاستحقاق" },
  ];
  return (
    <div>
      <PageHeader
        title="Case Management"
        titleAr="إدارة الحالات"
        description="Track performance issues from diagnosis through resolution"
        descriptionAr="تتبع مشاكل الأداء من التشخيص إلى الحل"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "حالة جديدة" : "New Case"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatsCard
            key={i}
            title={s.title}
            titleAr={s.tA}
            value={s.v}
            icon={s.ic}
            status={s.st as "warning" | "good" | "critical"}
            currentLang={l}
          />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{l === "ar" ? "جميع الحالات" : "All Cases"}</CardTitle>
        </CardHeader>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {cols.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase ${l === "ar" ? "text-right" : "text-left"}`}
                >
                  {l === "ar" ? c.labelAr : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {cases.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                onClick={() => setSel(c.id)}
              >
                <td className="px-4 py-3 text-sm font-mono font-medium">{c.num}</td>
                <td className="px-4 py-3 text-sm font-medium">{l === "ar" ? c.empAr : c.emp}</td>
                <td className="px-4 py-3 text-sm">{l === "ar" ? c.causeAr : c.cause}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={c.pri === "critical" ? "red" : c.pri === "high" ? "yellow" : "green"}
                    size="sm"
                    label={l === "ar" ? c.priAr : c.pri}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.st} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
