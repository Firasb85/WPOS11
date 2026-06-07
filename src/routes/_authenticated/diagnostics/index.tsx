import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useDiagnostics, useDeleteDiagnostic } from "@/hooks/useDiagnosticWorkflow";
import { Plus, Stethoscope, Trash2, Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/")({
  component: DiagnosticsListPage,
});

function DiagnosticsListPage() {
  const { t, lang: l } = useLanguage();
  const { data: diagnostics, isLoading } = useDiagnostics();
  const deleteMutation = useDeleteDiagnostic();

  const statusColors: Record<string, string> = {
    draft: "yellow",
    evidence_collection: "blue",
    under_review: "orange",
    approved: "green",
    rejected: "red",
    final: "green",
  };

  const tableData = (diagnostics ?? []).map((d) => {
    const emp = (d as Record<string, unknown>).employees as Record<string, unknown> | null;
    const dept = (d as Record<string, unknown>).departments as Record<string, unknown> | null;
    return {
      id: d.id,
      title: d.title,
      employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
      department: (dept?.name as string) ?? "-",
      status: d.status ?? "draft",
      maturity: d.maturity_level ?? 1,
      confidence: d.confidence_score != null ? `${d.confidence_score}%` : "-",
      date: d.created_at ? new Date(d.created_at).toLocaleDateString() : "-",
    };
  });

  return (
    <div>
      <PageHeader
        title="Diagnostic Reports"
        titleAr="تقارير التشخيص"
        description="Performance diagnostic investigations and hypotheses"
        descriptionAr="التحقيقات التشخيصية للأداء والفرضيات"
        currentLang={l}
        actions={
          <Link
            to="/diagnostics/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 no-underline"
          >
            <Plus className="w-4 h-4" />
            {t("New Diagnostic", "تشخيص جديد")}
          </Link>
        }
      />

      <DataTable
        columns={[
          {
            key: "title",
            label: t("Title", "العنوان"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium">{row.title}</span>
              </div>
            ),
          },
          { key: "employee", label: t("Employee", "الموظف"), sortable: true },
          { key: "department", label: t("Department", "الإدارة") },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => (
              <StatusBadge
                status={statusColors[row.status] ?? "gray"}
                label={row.status.replace("_", " ")}
              />
            ),
          },
          {
            key: "maturity",
            label: t("Maturity", "النضج"),
            render: (row) => (
              <MaturityBadge level={row.maturity as 1 | 2 | 3 | 4 | 5} size="sm" currentLang={l} />
            ),
          },
          { key: "confidence", label: t("Confidence", "الثقة") },
          { key: "date", label: t("Date", "التاريخ"), sortable: true },
          {
            key: "id",
            label: "",
            render: (row) => (
              <div className="flex items-center gap-1">
                <Link
                  to="/diagnostics/report/$id" params={{ id: row.id }}
                  className="p-1 text-blue-400 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteMutation.mutate(row.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />

      {!isLoading && tableData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t("No diagnostic reports yet.", "لا توجد تقارير تشخيصية بعد.")}
          </p>
          <Link
            to="/diagnostics/new"
            className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm no-underline"
          >
            {t("Create First Diagnostic", "إنشاء أول تشخيص")}
          </Link>
        </div>
      )}
    </div>
  );
}
