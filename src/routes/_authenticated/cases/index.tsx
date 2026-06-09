import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCases, useDeleteCase, useUpdateCaseStatus } from "@/hooks/useCases";
import { Briefcase, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cases/")({
  component: CasesListPage,
});

function CasesListPage() {
  const { t, lang: l } = useLanguage();
  const { data: cases, isLoading } = useCases();
  const deleteMutation = useDeleteCase();
  const updateStatus = useUpdateCaseStatus();

  const statusColors: Record<string, string> = {
    open: "blue",
    under_investigation: "orange",
    action_planned: "purple",
    intervention_running: "cyan",
    monitoring: "yellow",
    resolved: "green",
    closed: "gray",
    cancelled: "red",
  };

  const tableData = (cases ?? []).map((c) => {
    const emp = (c as unknown as Record<string, unknown>).employees as Record<
      string,
      unknown
    > | null;
    const dept = (c as unknown as Record<string, unknown>).departments as Record<
      string,
      unknown
    > | null;
    return {
      id: c.id,
      caseNumber: c.case_number,
      employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
      department: (dept?.name as string) ?? "-",
      rootCause: (c.root_cause_category ?? "-").replace("_", " "),
      priority: c.priority ?? "medium",
      status: c.status ?? "open",
      date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "-",
    };
  });

  return (
    <div>
      <PageHeader
        title="Case Management"
        titleAr="إدارة الحالات"
        description="Track and manage performance cases from diagnostics to resolution"
        descriptionAr="تتبع وإدارة حالات الأداء من التشخيص إلى الحل"
        currentLang={l}
      />

      <DataTable
        columns={[
          {
            key: "caseNumber",
            label: t("Case #", "رقم الحالة"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <span className="font-mono text-xs font-medium">{row.caseNumber}</span>
              </div>
            ),
          },
          { key: "employee", label: t("Employee", "الموظف"), sortable: true },
          { key: "department", label: t("Department", "الإدارة") },
          {
            key: "rootCause",
            label: t("Root Cause", "السبب الجذري"),
            render: (row) => <span className="text-xs capitalize">{row.rootCause}</span>,
          },
          {
            key: "priority",
            label: t("Priority", "الأولوية"),
            render: (row) => (
              <StatusBadge
                status={
                  row.priority === "critical"
                    ? "red"
                    : row.priority === "high"
                      ? "orange"
                      : row.priority === "medium"
                        ? "yellow"
                        : "green"
                }
                label={row.priority}
              />
            ),
          },
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
          { key: "date", label: t("Created", "الإنشاء"), sortable: true },
          {
            key: "id",
            label: "",
            render: (row) => (
              <div className="flex items-center gap-1">
                {row.status === "open" && (
                  <button
                    onClick={() =>
                      updateStatus.mutate({
                        id: row.id,
                        status: "under_investigation",
                      })
                    }
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                  >
                    {t("Investigate", "تحقيق")}
                  </button>
                )}
                {row.status === "monitoring" && (
                  <button
                    onClick={() => updateStatus.mutate({ id: row.id, status: "resolved" })}
                    className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                  >
                    {t("Resolve", "حل")}
                  </button>
                )}
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
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "No cases yet. Cases are auto-created when diagnostic reports are approved.",
              "لا توجد حالات بعد. يتم إنشاء الحالات تلقائياً عند اعتماد تقارير التشخيص.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
