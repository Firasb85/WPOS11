import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { FormSelect } from "~/components/wpos/FormInput";
import { BarChart3, TrendingUp, Users, GitMerge, Shield, Stethoscope } from "lucide-react";
import { useDiagnosticMetrics } from "@/hooks/useAnalytics";
export const Route = createFileRoute("/_authenticated/maturity/")({ component: MaturityPage });
function MaturityPage() {
  const { data: diagMetrics, isLoading: _diagMetricsLoading } = useDiagnosticMetrics();
  const l = "ar";
  const dimensions: Record<string, unknown>[] = [];
  const deptMaturity: Record<string, unknown>[] = [];
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
