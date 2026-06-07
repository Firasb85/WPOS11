import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import {
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  GitBranch,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/dashboard")({
  component: DiagnosticDashboardPage,
});
function DiagnosticDashboardPage() {
  const l = "ar";
  const causes = [
    { cat: "skill_gap", la: "Skill Gap", laAr: "فجوة مهارية", c: 12, p: 28, t: "increasing" },
    { cat: "process_issue", la: "Process Issue", laAr: "مشكلة إجرائية", c: 10, p: 23, t: "stable" },
    { cat: "knowledge_gap", la: "Knowledge Gap", laAr: "فجوة معرفية", c: 7, p: 16, t: "stable" },
    { cat: "tool_issue", la: "Tool Issue", laAr: "مشكلة أدوات", c: 5, p: 12, t: "decreasing" },
    { cat: "motivation_issue", la: "Motivation", laAr: "تحفيز", c: 4, p: 9, t: "increasing" },
    { cat: "management_issue", la: "Management", laAr: "إدارة", c: 3, p: 7, t: "stable" },
  ];
  const depts = [
    { d: "Operations", dA: "العمليات", r: 72, o: 8, crit: 3 },
    { d: "Human Resources", dA: "الموارد البشرية", r: 45, o: 3, crit: 1 },
    { d: "Finance", dA: "المالية", r: 55, o: 4, crit: 1 },
    { d: "IT", dA: "تقنية المعلومات", r: 35, o: 2, crit: 0 },
  ];
  const contractions = [
    {
      d: l === "ar" ? "جودة عالية + أداء منخفض" : "High Quality + Low Performance",
      s: "high",
      e: l === "ar" ? "مشكلة إجرائية وليس فجوة" : "Process issue not skill gap",
    },
    {
      d: l === "ar" ? "حضور جيد + أداء متراجع" : "Good Attendance + Declining Perf",
      s: "medium",
      e: l === "ar" ? "عوامل تحفيزية" : "Motivational factors",
    },
    {
      d: l === "ar" ? "خبرة عالية + نتائج ضعيفة" : "High Exp + Poor Results",
      s: "high",
      e: l === "ar" ? "عوامل بيئية أو إجرائية" : "Environmental factors",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Diagnostic Dashboard"
        titleAr="لوحة التشخيص"
        description="Monitor diagnostics, contradictions, and root causes"
        descriptionAr="مراقبة التشخيص والتناقضات والأسباب الجذرية"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Total Reports"
          titleAr="إجمالي التقارير"
          value="43"
          icon={<Stethoscope />}
          currentLang={l}
        />
        <StatsCard
          title="Avg Maturity"
          titleAr="متوسط النضج"
          value="3.4"
          icon={<BarChart3 />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Under Review"
          titleAr="قيد المراجعة"
          value="7"
          icon={<AlertTriangle />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="Approved"
          titleAr="معتمدة"
          value="18"
          icon={<CheckCircle />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Contradictions"
          titleAr="تناقضات"
          value="3"
          icon={<GitBranch />}
          status="critical"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <Brain className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "الأسباب الجذرية" : "Root Causes"}
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
                    <span className="text-sm font-medium">{l === "ar" ? rc.laAr : rc.la}</span>
                    <div className="flex items-center gap-2">
                      {rc.t === "increasing" ? (
                        <ArrowUp className="w-3 h-3 text-red-500" />
                      ) : rc.t === "decreasing" ? (
                        <ArrowDown className="w-3 h-3 text-green-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-400" />
                      )}
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
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "الإدارات المعرضة للخطر" : "Depts at Risk"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {depts.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{l === "ar" ? d.dA : d.d}</p>
                  <p className="text-xs text-gray-500">
                    {d.o} open · {d.crit} critical
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${d.r >= 70 ? "text-red-600" : d.r >= 50 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {d.r}%
                  </p>
                  <p className="text-xs text-gray-500">{l === "ar" ? "مخاطرة" : "Risk"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <GitBranch className="w-4 h-4 text-orange-500 inline mr-1" />
              {l === "ar" ? "التناقضات" : "Detected Contradictions"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {contractions.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border-l-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                style={{ borderLeftColor: c.s === "high" ? "#ef4444" : "#eab308" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{c.d}</span>
                  <StatusBadge status={c.s === "high" ? "red" : "yellow"} size="sm" label={c.s} />
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">{c.e}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "توزيع النضج" : "Maturity Distribution"}</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-5 gap-4">
            {[
              { lvl: 1, c: 3 },
              { lvl: 2, c: 8 },
              { lvl: 3, c: 12 },
              { lvl: 4, c: 6 },
              { lvl: 5, c: 2 },
            ].map((item) => (
              <div
                key={item.lvl}
                className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <MaturityBadge level={item.lvl} size="sm" currentLang={l} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{item.c}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
