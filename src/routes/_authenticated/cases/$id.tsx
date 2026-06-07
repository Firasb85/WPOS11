import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import {
  Briefcase,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Target,
  GitBranch,
  ClipboardList,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useCase } from "@/hooks/useCases";
export const Route = createFileRoute("/_authenticated/cases/$id")({ component: CaseDetailPage });
function CaseDetailPage() {
  // Real data hook - needs route param
  // const { data: caseData } = useCase(id);
  const l = "ar";
  const c = {
    num: "CAS-001",
    emp: "Ahmad Khalid",
    empAr: "أحمد خالد",
    dept: "Operations",
    deptAr: "العمليات",
    mgr: "Khalid Al-Saud",
    mgrAr: "خالد آل سعود",
    causeCat: "skill_gap",
    cause: "Data Analysis Deficiency",
    causeAr: "نقص تحليل البيانات",
    pri: "high",
    priAr: "عالية",
    st: "open",
    created: "2026-06-04",
    due: "2026-07-04",
    riskScore: 72,
    confScore: 84,
    actions: [
      {
        n: 1,
        desc: "Complete data analysis training",
        descAr: "إتمام التدريب على تحليل البيانات",
        owner: "Ahmad Khalid",
        ownerAr: "أحمد خالد",
        start: "2026-06-10",
        end: "2026-06-24",
        st: "in_progress",
        pr: 45,
      },
      {
        n: 2,
        desc: "Weekly mentoring sessions",
        descAr: "جلسات إرشاد أسبوعية",
        owner: "Senior Analyst",
        ownerAr: "محلل أول",
        start: "2026-06-15",
        end: "2026-07-13",
        st: "pending",
        pr: 0,
      },
      {
        n: 3,
        desc: "Competency reassessment",
        descAr: "إعادة تقييم الكفاءة",
        owner: "HR Dept",
        ownerAr: "الموارد البشرية",
        start: "2026-07-01",
        end: "2026-07-04",
        st: "pending",
        pr: 0,
      },
    ],
    fups: [
      { type: "30_day", typeAr: "30 يوم", date: "2026-07-04", result: "pending" },
      { type: "60_day", typeAr: "60 يوم", date: "2026-08-03", result: "pending" },
      { type: "90_day", typeAr: "90 يوم", date: "2026-09-02", result: "pending" },
    ],
    journey: [
      {
        date: "2026-06-04",
        ev: "Diagnostic Report Generated",
        evAr: "تم إنشاء التقرير التشخيصي",
        type: "diagnostic",
      },
      { date: "2026-06-04", ev: "Case Opened - CAS-001", evAr: "تم فتح الحالة", type: "case" },
      { date: "2026-06-10", ev: "Action: Training Started", evAr: "بدأ التدريب", type: "action" },
    ],
  };
  return (
    <div>
      <PageHeader
        title={`${c.num}: ${l === "ar" ? c.empAr : c.emp}`}
        titleAr={`${c.num}: ${c.empAr}`}
        description={`${l === "ar" ? "الإدارة:" : "Dept:"} ${l === "ar" ? c.deptAr : c.dept}`}
        currentLang={l}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Briefcase className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "معلومات الحالة" : "Case Info"}
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "الحالة" : "Case"}</p>
                <p className="text-sm font-mono font-medium">{c.num}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "الموظف" : "Employee"}</p>
                <p className="text-sm font-medium">{l === "ar" ? c.empAr : c.emp}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "المدير" : "Manager"}</p>
                <p className="text-sm font-medium">{l === "ar" ? c.mgrAr : c.mgr}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "الأولوية" : "Priority"}</p>
                <StatusBadge
                  status={c.pri === "critical" ? "red" : c.pri === "high" ? "yellow" : "green"}
                  label={l === "ar" ? c.priAr : c.pri}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {l === "ar" ? "السبب الجذري" : "Root Cause"}
                </p>
                <p className="text-sm font-medium">{l === "ar" ? c.causeAr : c.cause}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "تاريخ الإنشاء" : "Created"}</p>
                <p className="text-sm">{c.created}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "تاريخ الاستحقاق" : "Due"}</p>
                <p className="text-sm">{c.due}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{l === "ar" ? "الحالة" : "Status"}</p>
                <StatusBadge status={c.st} />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <ClipboardList className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "خطة العمل" : "Action Plan"}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {c.actions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-blue-600">{a.n}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{l === "ar" ? a.descAr : a.desc}</p>
                      <StatusBadge status={a.st} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {l === "ar" ? a.ownerAr : a.owner} · {a.start} → {a.end}
                    </p>
                    <div className="mt-1.5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${a.pr}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-blue-600">{a.pr}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{l === "ar" ? "مخاطر ونضج" : "Risk & Maturity"}</CardTitle>
            </CardHeader>
            <div className="space-y-4 text-center">
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{
                    color:
                      c.riskScore >= 70 ? "#ef4444" : c.riskScore >= 40 ? "#eab308" : "#22c55e",
                  }}
                >
                  {c.riskScore}
                </p>
                <p className="text-xs text-gray-500">
                  {l === "ar" ? "درجة المخاطرة" : "Risk Score"}
                </p>
              </div>
              <div>
                <MaturityBadge
                  level={4}
                  confidenceScore={c.confScore}
                  showDetails
                  currentLang={l}
                />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "متابعة" : "Follow-Up Schedule"}
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {c.fups.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{l === "ar" ? f.typeAr : f.type}</p>
                    <p className="text-xs text-gray-500">{f.date}</p>
                  </div>
                  <StatusBadge
                    status={
                      f.result === "pending"
                        ? "yellow"
                        : f.result === "improvement"
                          ? "green"
                          : "red"
                    }
                    size="sm"
                    label={f.result}
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Activity className="w-4 h-4 inline mr-1" />
                {l === "ar" ? "رحلة الأداء" : "Performance Journey"}
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {c.journey.map((j, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full ${j.type === "diagnostic" ? "bg-blue-500" : j.type === "case" ? "bg-purple-500" : "bg-green-500"}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{j.date}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {l === "ar" ? j.evAr : j.ev}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
