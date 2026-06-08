import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { FormSelect } from "~/components/wpos/FormInput";
import {
  FileBarChart,
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  Building2,
  BarChart3,
} from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useDiagnosticMetrics } from "@/hooks/useAnalytics";
export const Route = createFileRoute("/_authenticated/reports/enterprise/")({
  component: EnterpriseReportsPage,
});
function EnterpriseReportsPage() {
  const { data: ceoMetrics, isLoading: _ceoMetricsLoading } = useCeoDashboard();
  const { data: diagMetrics } = useDiagnosticMetrics();
  const l = "ar";
  const reportTypes: { [k: string]: any }[] = [];
  const recent: { [k: string]: any }[] = [];
  return (
    <div>
      <PageHeader
        title="Enterprise Reports"
        titleAr="التقارير المؤسسية"
        description="Board, executive, operational, risk, and maturity reports"
        descriptionAr="تقارير مجلس الإدارة والتنفيذيين والعمليات والمخاطر والنضج"
        currentLang={l}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {reportTypes.map((r, i) => (
          <Card key={i} className="text-center hover:shadow-md cursor-pointer">
            <div className="p-2 mx-auto mb-2 rounded-lg bg-blue-50 w-fit">
              <r.icon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium">{l === "ar" ? r.nA : r.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{r.freq}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "توليد تقرير" : "Generate Report"}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <FormSelect
              label={l === "ar" ? "نوع التقرير" : "Report Type"}
              labelAr="نوع التقرير"
              options={reportTypes.map((r) => ({ value: r.code, label: r.name, labelAr: r.nA }))}
              value="board"
              currentLang={l}
            />
            <FormSelect
              label={l === "ar" ? "الفترة" : "Period"}
              labelAr="الفترة"
              options={[
                { value: "current", label: "Current Month", labelAr: "الشهر الحالي" },
                { value: "last", label: "Last Month", labelAr: "الشهر الماضي" },
                { value: "quarter", label: "Current Quarter", labelAr: "الربع الحالي" },
              ]}
              value="current"
              currentLang={l}
            />
            <FormSelect
              label={l === "ar" ? "التنسيق" : "Format"}
              labelAr="التنسيق"
              options={[
                { value: "pdf", label: "PDF" },
                { value: "excel", label: "Excel" },
              ]}
              value="pdf"
              currentLang={l}
            />
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>{l === "ar" ? "توليد وتحميل" : "Generate & Download"}</span>
            </button>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{l === "ar" ? "التقارير الأخيرة" : "Recent Reports"}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {recent.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{r.type} Report</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {r.num} - {r.dt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={r.st === "generated" ? "green" : "yellow"}
                    size="sm"
                    label={r.st}
                  />
                  <span className="text-xs text-gray-400">{r.size}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
