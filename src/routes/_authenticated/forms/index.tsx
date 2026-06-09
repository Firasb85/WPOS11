import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card} from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, Layout, Eye} from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/forms/")({ component: FormsPage });
function FormsPage() {
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const l = "ar";
  const forms = [
    {
      code: "EVIDENCE-Q-001",
      nE: "Qualitative Evidence Form",
      nA: "نموذج دليل نوعي",
      t: "evidence",
      tA: "دليل",
      fields: 3,
      ver: 1,
      st: true,
    },
    {
      code: "DIAG-001",
      nE: "Quick Diagnostic Form",
      nA: "نموذج تشخيص سريع",
      t: "diagnostic",
      tA: "تشخيص",
      fields: 2,
      ver: 1,
      st: true,
    },
    {
      code: "ASSESS-001",
      nE: "Competency Assessment",
      nA: "تقييم الكفاءة",
      t: "assessment",
      tA: "تقييم",
      fields: 5,
      ver: 2,
      st: true,
    },
    {
      code: "AUDIT-001",
      nE: "Process Audit Form",
      nA: "نموذج تدقيق العملية",
      t: "audit",
      tA: "تدقيق",
      fields: 8,
      ver: 1,
      st: false,
    },
  ];
  const types = [
    { t: "evidence", tA: "دليل", c: 1 },
    { t: "diagnostic", tA: "تشخيص", c: 1 },
    { t: "assessment", tA: "تقييم", c: 1 },
    { t: "audit", tA: "تدقيق", c: 1 },
  ];
  return (
    <div>
      <PageHeader
        title="Dynamic Form Builder"
        titleAr="منشئ النماذج الديناميكي"
        description="Design enterprise forms with drag-and-drop, conditional logic, and validation"
        descriptionAr="تصميم نماذج مؤسسية بالسحب والإفلات والمنطق الشرطي والتحقق"
        currentLang={l}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>{l === "ar" ? "نموذج جديد" : "New Form"}</span>
          </button>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {types.map((t, i) => (
          <Card key={i} className="text-center">
            <p className="text-2xl font-bold text-blue-600">{t.c}</p>
            <p className="text-xs text-gray-500 mt-1">{l === "ar" ? t.tA : t.t}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((f, i) => (
          <Card key={i} className="hover:shadow-md cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Layout className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{l === "ar" ? f.nA : f.nE}</h3>
                  <p className="text-xs text-gray-500 font-mono">{f.code}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{f.fields} fields</span>
                    <span className="text-xs text-gray-400">v{f.ver}</span>
                    <StatusBadge status={f.st ? "active" : "inactive"} size="sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-gray-100">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100">
                  <Layout className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
