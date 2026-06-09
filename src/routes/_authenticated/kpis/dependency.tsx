import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { KpiTreeView } from "~/components/wpos/visualizations/KpiTreeView";
import { Share2, Search, ArrowDown, AlertTriangle } from "lucide-react";
import { useKpis } from "@/hooks/useKpis";
import { useKpiRelationships } from "@/hooks/useAdmin";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
export const Route = createFileRoute("/_authenticated/kpis/dependency")({
  component: KpiDependencyPage,
});
function KpiDependencyPage() {
  const { t } = useLanguage();
  const { data: _relationships, isLoading: _relLoading } = useKpiRelationships();
  const { data: _kpis, isLoading: _kpisLoading } = useKpis();
  const l = "ar";
  const tree = {
    kpi: {
      id: "root",
      name: "Total Revenue",
      code: "REV-001",
      currentValue: 14200000,
      targetValue: 15000000,
      status: "yellow",
    },
    impactWeight: 1,
    children: [
      {
        kpi: {
          id: "c1",
          name: "Sales Volume",
          code: "SLS-001",
          currentValue: 2850,
          targetValue: 3000,
          status: "yellow",
        },
        impactWeight: 1,
        children: [
          {
            kpi: {
              id: "c1a",
              name: "Active Customers",
              code: "CUS-001",
              currentValue: 1240,
              targetValue: 1300,
              status: "yellow",
            },
            impactWeight: 0.8,
            children: [
              {
                kpi: {
                  id: "c1a1",
                  name: "New Customers",
                  code: "CUS-002",
                  currentValue: 185,
                  targetValue: 200,
                  status: "yellow",
                },
                impactWeight: 0.6,
                children: [],
              },
              {
                kpi: {
                  id: "c1a2",
                  name: "Retention Rate",
                  code: "CUS-003",
                  currentValue: 94,
                  targetValue: 95,
                  status: "green",
                },
                impactWeight: 0.4,
                children: [],
              },
            ],
          },
          {
            kpi: {
              id: "c1b",
              name: "Avg Deal Size",
              code: "SLS-002",
              currentValue: 4850,
              targetValue: 5000,
              status: "green",
            },
            impactWeight: 0.5,
            children: [],
          },
        ],
      },
      {
        kpi: {
          id: "c2",
          name: "Product Profitability",
          code: "PRF-001",
          currentValue: 22.5,
          targetValue: 25,
          status: "yellow",
        },
        impactWeight: 0.7,
        children: [
          {
            kpi: {
              id: "c2a",
              name: "Production Cost",
              code: "CST-001",
              currentValue: 145,
              targetValue: 140,
              status: "red",
            },
            impactWeight: 0.6,
            children: [],
          },
          {
            kpi: {
              id: "c2b",
              name: "Profit Margin",
              code: "PRF-002",
              currentValue: 18.2,
              targetValue: 20,
              status: "yellow",
            },
            impactWeight: 0.4,
            children: [],
          },
        ],
      },
    ],
  };
  return (
    <div>
      <PageHeader
        title="KPI Dependency Engine"
        titleAr="محرك تبعية المؤشرات"
        description="Cause-and-effect KPI relationship mapping for root cause tracing"
        descriptionAr="رسم خرائط علاقات السبب والنتيجة للمؤشرات لتتبع السبب الجذري"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Root KPIs"
          titleAr="مؤشرات جذرية"
          value="3"
          icon={<Share2 />}
          currentLang={l}
        />
        <StatsCard
          title="Dependencies"
          titleAr="تبعيات"
          value="8"
          icon={<ArrowDown />}
          currentLang={l}
        />
        <StatsCard
          title="Critical Impact"
          titleAr="تأثير حرج"
          value="2"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Root Cause Tracing"
          titleAr="تتبع السبب"
          value="Active"
          icon={<Search />}
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{l === "ar" ? "شجرة تبعية المؤشرات" : "KPI Dependency Tree"}</CardTitle>
          </CardHeader>
          <KpiTreeView tree={tree} currentLang={l} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "تحليل التأثير" : "Impact Analysis"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-700">
                {l === "ar" ? "السبب الجذري" : "Root Cause"}
              </p>
              <p className="text-sm font-bold text-red-600 mt-1">
                {l === "ar" ? "تكلفة الإنتاج" : "Production Cost"}
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                {l === "ar" ? "يؤثر على 3 مؤشرات فرعية" : "Impacts 3 downstream KPIs"}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs font-medium text-yellow-700">
                {l === "ar" ? "التأثير النهائي" : "Final Impact"}
              </p>
              <p className="text-sm font-bold text-yellow-600 mt-1">
                {l === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
              </p>
              <p className="text-xs text-yellow-500 mt-0.5">
                {l === "ar" ? "متأثر بمسارين" : "Affected by 2 paths"}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-700">
                {l === "ar" ? "تحليل ماذا لو" : "What-If Analysis"}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {l === "ar"
                  ? "تحسين تكلفة الإنتاج بنسبة 5٪ يمكن أن يزيد الربحية بمقدار 2.3٪"
                  : "5% cost reduction could improve profitability by 2.3%"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
