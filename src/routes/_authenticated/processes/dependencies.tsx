import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import {
  DependencyGraph,
  CriticalPathChain,
} from "~/components/wpos/visualizations/DependencyGraph";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { GitBranch, AlertTriangle, Share2, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/processes/dependencies")({
  component: ProcessDependenciesPage,
});

function ProcessDependenciesPage() {
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
        id: "p2",
        name: l === "ar" ? "التقاط الموقع" : "GPS Capture",
        riskLevel: "low",
        criticality: "medium",
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
      { from: "p1", to: "p2", type: "sequential", criticality: "high" },
      { from: "p1", to: "p3", type: "sequential", criticality: "high" },
      { from: "p3", to: "p4", type: "conditional", criticality: "critical" },
      { from: "p4", to: "p5", type: "sequential", criticality: "critical" },
      { from: "p5", to: "p6", type: "sequential", criticality: "high" },
    ],
  };
  const criticalPath = [
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
  ];

  return (
    <div>
      <PageHeader
        title="Process Dependency Mapping"
        titleAr="خريطة تبعيات العمليات"
        description="Visualize process dependencies"
        descriptionAr="تصور تبعيات العمليات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Processes"
          titleAr="العمليات"
          value="6"
          icon={<GitBranch />}
          currentLang={l}
        />
        <StatsCard
          title="Dependencies"
          titleAr="التبعيات"
          value="5"
          icon={<Share2 />}
          currentLang={l}
        />
        <StatsCard
          title="Critical Paths"
          titleAr="مسارات حرجة"
          value="2"
          icon={<AlertTriangle />}
          status="critical"
          currentLang={l}
        />
        <StatsCard
          title="Avg Risk"
          titleAr="متوسط المخاطرة"
          value="65%"
          change={5.3}
          icon={<Shield />}
          status="warning"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "رسم التبعيات" : "Dependency Graph"}</CardTitle>
          </CardHeader>
          <DependencyGraph nodes={graph.nodes} edges={graph.edges} currentLang={l} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "المسار الحرج" : "Critical Path"}</CardTitle>
          </CardHeader>
          <CriticalPathChain nodes={criticalPath} currentLang={l} />
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">
              {l === "ar" ? "فشل هذه العمليات يؤثر على التسليم" : "Failure impacts delivery"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
