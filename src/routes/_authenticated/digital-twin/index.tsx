import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card} from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { useCeoDashboard } from "@/hooks/useDashboard";
import {
  Building2,
  GitBranch,
  Users,
  Briefcase,
  GitMerge,
  Gauge,
  Share2,
  RefreshCw,
} from "lucide-react";
export const Route = createFileRoute("/_authenticated/digital-twin/")({
  component: DigitalTwinPage,
});
function DigitalTwinPage() {
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const entities = [
    {
      name: "Companies",
      nA: "الشركات",
      icon: Building2,
      count: 1,
      color: "bg-blue-500",
      connections: 2,
    },
    {
      name: "Branches",
      nA: "الفروع",
      icon: GitBranch,
      count: 2,
      color: "bg-indigo-500",
      connections: 3,
    },
    {
      name: "Departments",
      nA: "الإدارات",
      icon: Building2,
      count: 4,
      color: "bg-purple-500",
      connections: 6,
    },
    { name: "Teams", nA: "الفرق", icon: Users, count: 8, color: "bg-orange-500", connections: 12 },
    {
      name: "Employees",
      nA: "الموظفين",
      icon: Users,
      count: 24,
      color: "bg-green-500",
      connections: 48,
    },
    {
      name: "Jobs",
      nA: "الوظائف",
      icon: Briefcase,
      count: 12,
      color: "bg-cyan-500",
      connections: 24,
    },
    {
      name: "Processes",
      nA: "العمليات",
      icon: GitMerge,
      count: 8,
      color: "bg-teal-500",
      connections: 16,
    },
    { name: "KPIs", nA: "المؤشرات", icon: Gauge, count: 15, color: "bg-rose-500", connections: 30 },
  ];
  return (
    <div>
      <PageHeader
        title="Digital Twin Organization"
        titleAr="التوأم الرقمي للمؤسسة"
        description="Live organizational model showing all entities, dependencies, and impacts"
        descriptionAr="نموذج مؤسسي حي يظهر جميع الكيانات والتبعيات والتأثيرات"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>{l === "ar" ? "تحديث" : "Refresh"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Entities"
          titleAr="إجمالي الكيانات"
          value="74"
          icon={<Building2 />}
          currentLang={l}
        />
        <StatsCard
          title="Connections"
          titleAr="الارتباطات"
          value="141"
          icon={<Share2 />}
          currentLang={l}
        />
        <StatsCard
          title="Last Sync"
          titleAr="آخر مزامنة"
          value={l === "ar" ? "الآن" : "Now"}
          icon={<RefreshCw />}
          currentLang={l}
        />
        <StatsCard
          title="Active"
          titleAr="نشط"
          value="74"
          icon={<Building2 />}
          status="good"
          currentLang={l}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {entities.map((e, i) => (
          <Card key={i} className="text-center hover:shadow-lg transition-shadow">
            <div
              className={`w-12 h-12 rounded-full ${e.color} mx-auto mb-2 flex items-center justify-center`}
            >
              <e.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium">{l === "ar" ? e.nA : e.name}</p>
            <p className="text-2xl font-bold mt-1">{e.count}</p>
            <p className="text-xs text-gray-400">
              {e.connections} {l === "ar" ? "ارتباط" : "connections"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
