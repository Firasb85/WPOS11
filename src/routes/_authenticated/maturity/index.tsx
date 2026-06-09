import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { FormSelect } from "~/components/wpos/FormInput";
import { BarChart3, Users, GitMerge, Shield, Stethoscope } from "lucide-react";
import { useDiagnosticMetrics } from "@/hooks/useAnalytics";
export const Route = createFileRoute("/_authenticated/maturity/")({ component: MaturityPage });
function MaturityPage() {
  const { data: _diagMetrics, isLoading: _diagMetricsLoading } = useDiagnosticMetrics();
  const l = "ar";
  const dimensions = [
    {
      name: "People",
      nA: "الأفراد",
      score: 72,
      lvl: 3,
      icon: Users,
      desc: "Skills, competencies, team capability",
    },
    {
      name: "Processes",
      nA: "العمليات",
      score: 68,
      lvl: 3,
      icon: GitMerge,
      desc: "Process documentation, execution maturity",
    },
    {
      name: "KPIs",
      nA: "المؤشرات",
      score: 81,
      lvl: 4,
      icon: BarChart3,
      desc: "KPI coverage, measurement accuracy",
    },
    {
      name: "Evidence",
      nA: "الأدلة",
      score: 63,
      lvl: 3,
      icon: Shield,
      desc: "Evidence collection, reliability scoring",
    },
    {
      name: "Diagnostics",
      nA: "التشخيص",
      score: 58,
      lvl: 2,
      icon: Stethoscope,
      desc: "Diagnostic maturity, root cause analysis",
    },
  ];
  const deptMaturity = [
    { dept: "Operations", dA: "العمليات", score: 68, lvl: 3, change: 4.2 },
    { dept: "HR", dA: "الموارد البشرية", score: 75, lvl: 3, change: 2.1 },
    { dept: "Finance", dA: "المالية", score: 62, lvl: 3, change: -1.5 },
    { dept: "IT", dA: "تقنية المعلومات", score: 71, lvl: 3, change: 5.8 },
  ];
  return (
    <div>
      <PageHeader
        title="Organizational Maturity"
        titleAr="النضج المؤسسي"
        description="Assess maturity across people, processes, KPIs, evidence, and diagnostics"
        descriptionAr="تقييم النضج عبر الأفراد والعمليات والمؤشرات والأدلة والتشخيص"
        currentLang={l}
        actions={
          <FormSelect
            options={[
              { value: "company", label: "Company Level", labelAr: "مستوى الشركة" },
              { value: "department", label: "Department Level", labelAr: "مستوى الإدارة" },
            ]}
            value="company"
            currentLang={l}
          />
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-purple-600">68</p>
          <p className="text-xs text-gray-500 mt-1">
            {l === "ar" ? "النضج الكلي" : "Overall Maturity"}
          </p>
          <MaturityBadge level={3} size="sm" currentLang={l} />
        </Card>
        <StatsCard
          title="People"
          titleAr="الأفراد"
          value="72%"
          icon={<Users />}
          status="good"
          currentLang={l}
        />
        <StatsCard
          title="Processes"
          titleAr="العمليات"
          value="68%"
          icon={<GitMerge />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="KPIs"
          titleAr="المؤشرات"
          value="81%"
          icon={<BarChart3 />}
          status="good"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "أبعاد النضج" : "Maturity Dimensions"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {dimensions.map((d, i) => {
              const IC = d.icon;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IC className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{l === "ar" ? d.nA : d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{d.score}</span>
                      <MaturityBadge level={d.lvl as 1 | 2 | 3 | 4 | 5} size="sm" currentLang={l} />
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "نضج الإدارات" : "Department Maturity"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {deptMaturity.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{l === "ar" ? d.dA : d.dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{d.score}</span>
                    <MaturityBadge level={d.lvl as 1 | 2 | 3 | 4 | 5} size="sm" currentLang={l} />
                    <span
                      className={`text-xs ${d.change >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {d.change >= 0 ? "+" : ""}
                      {d.change}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-600"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
