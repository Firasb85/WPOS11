import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useCases } from "@/hooks/useCases";
import {
  BarChart3,
  Users,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Building2,
  Activity,
  Target,
  Shield,
  TrendingUp,
  Brain,
} from "lucide-react";
export const Route = createFileRoute("/_authenticated/command-center/")({
  component: CommandCenterPage,
});
function CommandCenterPage() {
  const { data: ceoMetrics, isLoading: _ceoMetricsLoading } = useCeoDashboard();
  const { data: cases } = useCases();
  const l = "ar";
  const criticalKPIs = [
    {
      kpi: "Production Efficiency",
      kA: "كفاءة الإنتاج",
      actual: 78,
      target: 90,
      gap: -13.3,
      trend: "declining",
    },
    {
      kpi: "Customer Satisfaction",
      kA: "رضا العملاء",
      actual: 82,
      target: 95,
      gap: -13.7,
      trend: "declining",
    },
    {
      kpi: "On-Time Delivery",
      kA: "التسليم في الوقت",
      actual: 91,
      target: 98,
      gap: -7.1,
      trend: "stable",
    },
  ];
  const deptRisk = [
    { dept: "Operations", dA: "العمليات", risk: 72, status: "high" },
    { dept: "Finance", dA: "المالية", risk: 55, status: "medium" },
    { dept: "HR", dA: "الموارد البشرية", risk: 35, status: "low" },
    { dept: "IT", dA: "تقنية المعلومات", risk: 28, status: "low" },
  ];
  const caseStatus = [
    { st: "Open", stA: "مفتوحة", c: 9 },
    { st: "Under Investigation", stA: "قيد التحقيق", c: 4 },
    { st: "Monitoring", stA: "مراقبة", c: 2 },
    { st: "Resolved", stA: "تم الحل", c: 8 },
  ];
  const maturityDims = [
    { name: "People", nA: "الأفراد", s: 72 },
    { name: "Processes", nA: "العمليات", s: 68 },
    { name: "KPIs", nA: "المؤشرات", s: 81 },
    { name: "Evidence", nA: "الأدلة", s: 63 },
    { name: "Diagnostics", nA: "التشخيص", s: 58 },
  ];
  return (
    <div>
      <PageHeader
        title="Executive Command Center"
        titleAr="مركز القيادة التنفيذي"
        description="Single view of enterprise performance, diagnostics, risks, maturity, and strategy"
        descriptionAr="عرض موحد لأداء المؤسسة والتشخيصات والمخاطر والنضج والاستراتيجية"
        currentLang={l}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatsCard
          title="Employees"
          titleAr="الموظفين"
          value="24"
          icon={<Users />}
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Active Cases"
          titleAr="حالات نشطة"
          value="15"
          icon={<Activity />}
          status="warning"
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Diagnostics"
          titleAr="تشخيصات"
          value="43"
          icon={<Stethoscope />}
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Critical KPIs"
          titleAr="مؤشرات حرجة"
          value="3"
          icon={<AlertTriangle />}
          status="critical"
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Maturity"
          titleAr="النضج"
          value="68%"
          icon={<BarChart3 />}
          status="warning"
          size="sm"
          currentLang={l}
        />
        <StatsCard
          title="Strategies"
          titleAr="استراتيجيات"
          value="2"
          icon={<Target />}
          size="sm"
          currentLang={l}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500" />
              {l === "ar" ? "مؤشرات حرجة" : "Critical KPIs"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {criticalKPIs.map((k, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-red-50 dark:bg-red-900/10 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{l === "ar" ? k.kA : k.kpi}</p>
                  <p className="text-xs text-gray-500">
                    {k.actual}/{k.target} ({k.gap}%)
                  </p>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${k.trend === "declining" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {k.trend}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "مخاطر الإدارات" : "Dept Risk"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {deptRisk.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="text-sm font-medium">{l === "ar" ? d.dA : d.dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.risk >= 70 ? "bg-red-500" : d.risk >= 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${d.risk}%` }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: d.risk >= 70 ? "#ef4444" : d.risk >= 50 ? "#eab308" : "#22c55e",
                    }}
                  >
                    {d.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "الحالات" : "Cases"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {caseStatus.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm">{l === "ar" ? s.stA : s.st}</span>
                <span className="font-bold">{s.c}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 font-bold text-sm">
              <span>{l === "ar" ? "الإجمالي" : "Total"}</span>
              <span>{caseStatus.reduce((sum, s) => sum + s.c, 0)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "نضج المؤسسة" : "Organization Maturity"}
            </CardTitle>
          </CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <MaturityBadge level={3} confidenceScore={68} showDetails currentLang={l} />
          </div>
          <div className="space-y-3">
            {maturityDims.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{l === "ar" ? d.nA : d.name}</span>
                  <span className="font-bold">{d.s}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.s >= 75 ? "bg-green-500" : d.s >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${d.s}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "المقاييس الرئيسية" : "Key Metrics"}
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">43</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "التشخيصات" : "Diagnostics"}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">68%</p>
              <p className="text-xs text-gray-500">
                {l === "ar" ? "معدل الحل" : "Resolution Rate"}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <Shield className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-purple-600">48</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "متوسط المخاطرة" : "Avg Risk"}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <Target className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-600">2</p>
              <p className="text-xs text-gray-500">{l === "ar" ? "الاستراتيجيات" : "Strategies"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
