import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { GitBranch, Play, Settings, ArrowRight } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/workflow-studio/")({
  component: WorkflowStudioPage,
});
function WorkflowStudioPage() {
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const workflows = [
    { code: "DIAG_REVIEW", nE: "Diagnostic Review", nA: "مراجعة التشخيص", steps: 3, st: "active" },
    { code: "CASE_APPROVAL", nE: "Case Approval", nA: "اعتماد الحالة", steps: 2, st: "active" },
    { code: "DOC_APPROVAL", nE: "Document Approval", nA: "اعتماد المستند", steps: 4, st: "draft" },
  ];
  return (
    <div>
      <PageHeader
        title="Workflow Studio"
        titleAr="استوديو سير العمل"
        description="Visual workflow designer with simulation and versioning"
        descriptionAr="مصمم سير عمل بصري مع المحاكاة وإدارة الإصدارات"
        currentLang={l}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workflows.map((wf, i) => (
          <Card key={i} className="hover:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium">{l === "ar" ? wf.nA : wf.nE}</h3>
              </div>
              <StatusBadge status={wf.st} size="sm" />
            </div>
            <p className="text-xs text-gray-500 font-mono mb-3">{wf.code}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(wf.steps)].map((_, j) => (
                  <div key={j} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{j + 1}</span>
                    </div>
                    {j < wf.steps - 1 && <ArrowRight className="w-3 h-3 text-gray-300 mx-1" />}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-2">{wf.steps} steps</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                <Play className="w-3 h-3" />
                <span>{l === "ar" ? "محاكاة" : "Simulate"}</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
                <Settings className="w-3 h-3" />
                <span>{l === "ar" ? "تعديل" : "Edit"}</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
