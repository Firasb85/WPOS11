import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { DependencyGraph } from "~/components/wpos/visualizations/DependencyGraph";
import { GitBranch, AlertTriangle, Shield, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboards/process-intelligence")({
  component: ProcessIntelligencePage,
});

function ProcessIntelligencePage() {
  const l = "ar";
  const graph = {
    nodes: [
      {
        id: "p1",
        name: l === "ar" ? "تسجيل العملاء" : "Customer Registration",
        riskLevel: "medium",
        criticality: "high",
      },
      {
        id: "p3",
        name: l === "ar" ? "معالجة الطلبات" : "Order Processing",
        riskLevel: "high",
        criticality: "critical",
      },
      {
        id: "p4",
        name: l === "ar" ? "التحقق من المخزون" : "Inventory Validation",
        riskLevel: "medium",
        criticality: "high",
      },
      {
        id: "p5",
        name: l === "ar" ? "تسليم الطلبات" : "Order Delivery",
        riskLevel: "high",
        criticality: "critical",
      },
      {
        id: "p6",
        name: l === "ar" ? "معالجة الفواتير" : "Invoice Processing",
        riskLevel: "high",
        criticality: "critical",
      },
    ],
    edges: [
      { from: "p1", to: "p3", type: "sequential", criticality: "high" },
      { from: "p3", to: "p4", type: "conditional", criticality: "critical" },
      { from: "p4", to: "p5", type: "sequential", criticality: "critical" },
      { from: "p5", to: "p6", type: "sequential", criticality: "high" },
    ],
  };
  const riskScores = [
    { name: l === "ar" ? "معالجة الطلبات" : "Order Processing", score: 85, level: "critical" },
    { name: l === "ar" ? "تسليم الطلبات" : "Order Delivery", score: 78, level: "high" },
    { name: l === "ar" ? "معالجة الفواتير" : "Invoice Processing", score: 72, level: "high" },
    { name: l === "ar" ? "التحقق من المخزون" : "Inventory Validation", score: 55, level: "medium" },
  ];

  return (
    <div>
      <PageHeader
        title="Process Intelligence"
        titleAr="لوحة ذكاء العمليات"
        description="Process dependency analysis"
        descriptionAr="تحليل تبعيات العمليات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Processes"
          titleAr="العمليات"
          value="5"
          icon={<GitBranch />}
          currentLang={l}
        />
        <StatsCard
          title="Critical Dependencies"
          titleAr="تبعيات حرجة"
          value="4"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Avg Risk"
          titleAr="متوسط المخاطرة"
          value="65%"
          icon={<Shield />}
          status="warning"
          currentLang={l}
        />
        <StatsCard
          title="Failures"
          titleAr="حالات الفشل"
          value="31"
          change={12}
          icon={<TrendingUp />}
          status="warning"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "درجات المخاطر" : "Risk Scores"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {riskScores.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium w-36">{item.name}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.score >= 80 ? "bg-red-500" : item.score >= 60 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-10 text-right">{item.score}</span>
                <StatusBadge
                  status={
                    item.level === "critical" ? "red" : item.level === "high" ? "yellow" : "green"
                  }
                  size="sm"
                  label={item.level}
                />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "رسم التبعيات" : "Dependency Graph"}</CardTitle>
          </CardHeader>
          <DependencyGraph nodes={graph.nodes} edges={graph.edges} currentLang={l} />
        </Card>
      </div>
    </div>
  );
}
