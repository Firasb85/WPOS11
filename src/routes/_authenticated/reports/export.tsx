import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useCompanies, useEmployeesList } from "@/hooks/useOrganization";
import { useKpis } from "@/hooks/useKpis";
import { useDiagnostics } from "@/hooks/useDiagnosticWorkflow";
import { exportToCSV, exportToJSON } from "@/lib/export/csv";
import { Download, FileText, Table, Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports/export")({
  component: ExportPage,
});

function ExportPage() {
  const { t, lang: l } = useLanguage();
  const { data: metrics } = useCeoDashboard();
  const { data: companies } = useCompanies();
  const { data: employees } = useEmployeesList({ pageSize: 1000 });
  const { data: kpis } = useKpis();
  const { data: diagnostics } = useDiagnostics();

  const exports = [
    {
      title: t("Employees", "الموظفون"),
      icon: Table,
      desc: t("Export all employee records", "تصدير جميع سجلات الموظفين"),
      onCSV: () => {
        const data = (employees?.data ?? []).map((e) => ({
          name: `${e.first_name} ${e.last_name}`,
          code: e.employee_code ?? "",
          email: e.email ?? "",
          phone: e.phone ?? "",
          status: e.is_active ? "Active" : "Inactive",
        }));
        exportToCSV(
          data,
          [
            { key: "name", label: "Name" },
            { key: "code", label: "Code" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "status", label: "Status" },
          ],
          "employees",
        );
      },
      onJSON: () => exportToJSON(employees?.data ?? [], "employees"),
      count: employees?.total ?? 0,
    },
    {
      title: t("Companies", "الشركات"),
      icon: Database,
      desc: t("Export company records", "تصدير سجلات الشركات"),
      onCSV: () => {
        const data = (companies ?? []).map((c) => ({
          name: c.name,
          legalName: c.legal_name ?? "",
          city: c.city ?? "",
          country: c.country ?? "",
          email: c.email ?? "",
        }));
        exportToCSV(
          data,
          [
            { key: "name", label: "Name" },
            { key: "legalName", label: "Legal Name" },
            { key: "city", label: "City" },
            { key: "country", label: "Country" },
            { key: "email", label: "Email" },
          ],
          "companies",
        );
      },
      onJSON: () => exportToJSON(companies ?? [], "companies"),
      count: (companies ?? []).length,
    },
    {
      title: t("KPIs", "مؤشرات الأداء"),
      icon: FileText,
      desc: t("Export KPI definitions", "تصدير تعريفات المؤشرات"),
      onCSV: () => {
        const data = (kpis ?? []).map((k) => ({
          name: k.name,
          code: k.code ?? "",
          target: String(k.target_value ?? ""),
          unit: k.unit ?? "",
          frequency: k.measurement_frequency ?? "",
        }));
        exportToCSV(
          data,
          [
            { key: "name", label: "KPI Name" },
            { key: "code", label: "Code" },
            { key: "target", label: "Target" },
            { key: "unit", label: "Unit" },
            { key: "frequency", label: "Frequency" },
          ],
          "kpis",
        );
      },
      onJSON: () => exportToJSON(kpis ?? [], "kpis"),
      count: (kpis ?? []).length,
    },
    {
      title: t("Diagnostics", "التشخيصات"),
      icon: FileText,
      desc: t("Export diagnostic reports", "تصدير تقارير التشخيص"),
      onCSV: () => {
        const data = (diagnostics ?? []).map((d) => {
          const emp = (d as Record<string, unknown>).employees as Record<string, unknown> | null;
          return {
            title: d.title,
            employee: emp ? `${emp.first_name} ${emp.last_name}` : "",
            status: d.status ?? "",
            maturity: String(d.maturity_level ?? ""),
            confidence: String(d.confidence_score ?? ""),
            date: d.created_at ?? "",
          };
        });
        exportToCSV(
          data,
          [
            { key: "title", label: "Title" },
            { key: "employee", label: "Employee" },
            { key: "status", label: "Status" },
            { key: "maturity", label: "Maturity" },
            { key: "confidence", label: "Confidence" },
            { key: "date", label: "Date" },
          ],
          "diagnostics",
        );
      },
      onJSON: () => exportToJSON(diagnostics ?? [], "diagnostics"),
      count: (diagnostics ?? []).length,
    },
    {
      title: t("Dashboard Summary", "ملخص اللوحة"),
      icon: Database,
      desc: t("Export system metrics snapshot", "تصدير لقطة مقاييس النظام"),
      onCSV: () => {
        if (!metrics) return;
        const data = [
          { metric: "Employees", value: String(metrics.totalEmployees) },
          { metric: "Departments", value: String(metrics.totalDepartments) },
          { metric: "KPIs", value: String(metrics.totalKpis) },
          { metric: "Performance Index", value: `${metrics.performanceIndex}%` },
          { metric: "Diagnostics", value: String(metrics.totalDiagnostics) },
          { metric: "Evidence Items", value: String(metrics.totalEvidence) },
        ];
        exportToCSV(
          data,
          [
            { key: "metric", label: "Metric" },
            { key: "value", label: "Value" },
          ],
          "dashboard_summary",
        );
      },
      onJSON: () => exportToJSON(metrics, "dashboard_summary"),
      count: 6,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Export Reports"
        titleAr="تصدير التقارير"
        description="Download data as CSV or JSON files"
        descriptionAr="تحميل البيانات كملفات CSV أو JSON"
        currentLang={l}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exports.map((exp) => (
          <Card key={exp.title}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <exp.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{exp.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{exp.desc}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {exp.count} {t("records", "سجلات")}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={exp.onCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    <Download className="w-3 h-3" />
                    CSV
                  </button>
                  <button
                    onClick={exp.onJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                  >
                    <Download className="w-3 h-3" />
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
