import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import {
  Share2,
  Briefcase,
  GitMerge,
  Gauge,
  ClipboardCheck,
  Search,
  Activity,
  Brain,
} from "lucide-react";
import { useProcesses } from "@/hooks/useProcesses";
import { useKpis } from "@/hooks/useKpis";
export const Route = createFileRoute("/_authenticated/knowledge-graph/")({
  component: KnowledgeGraphPage,
});
function KnowledgeGraphPage() {
  const { data: processes, isLoading: _processesLoading } = useProcesses();
  const { data: kpis } = useKpis();
  const l = "ar";
  const nodes = [
    {
      name: "Jobs",
      nA: "الوظائف",
      icon: Briefcase,
      count: 12,
      color: "bg-blue-500",
      conn: ["Processes", "KPIs", "Competencies"],
    },
    {
      name: "Processes",
      nA: "العمليات",
      icon: GitMerge,
      count: 8,
      color: "bg-green-500",
      conn: ["Jobs", "KPIs", "Root Causes"],
    },
    {
      name: "KPIs",
      nA: "المؤشرات",
      icon: Gauge,
      count: 15,
      color: "bg-purple-500",
      conn: ["Jobs", "Processes", "Evidence"],
    },
    {
      name: "Evidence",
      nA: "الأدلة",
      icon: ClipboardCheck,
      count: 37,
      color: "bg-orange-500",
      conn: ["KPIs", "Diagnostics", "Root Causes"],
    },
    {
      name: "Root Causes",
      nA: "الأسباب الجذرية",
      icon: Search,
      count: 6,
      color: "bg-red-500",
      conn: ["Evidence", "Diagnostics", "Interventions"],
    },
    {
      name: "Interventions",
      nA: "التدخلات",
      icon: Activity,
      count: 6,
      color: "bg-teal-500",
      conn: ["Root Causes", "Cases"],
    },
  ];
  return (
    <div>
      <PageHeader
        title="Knowledge Graph"
        titleAr="الرسم البياني المعرفي"
        description="Relationship mapping across all WPOS entities"
        descriptionAr="رسم خرائط العلاقات عبر جميع كيانات WPOS"
        currentLang={l}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {nodes.map((n, i) => (
          <Card key={i} className="text-center hover:shadow-lg">
            <div
              className={`w-12 h-12 rounded-full ${n.color} mx-auto mb-2 flex items-center justify-center`}
            >
              <n.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium">{l === "ar" ? n.nA : n.name}</p>
            <p className="text-xs text-gray-400">{n.count} items</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Brain className="w-4 h-4 inline mr-1" />
            Relationship Map
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map(
            (n, i) =>
              n.conn.length > 0 && (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${n.color}`} />
                    <span className="text-sm font-medium">{l === "ar" ? n.nA : n.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {n.conn.map((c, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        <Share2 className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      </Card>
    </div>
  );
}
