import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEvidence } from "@/hooks/useDiagnosticWorkflow";
import { Plus, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/evidence/")({
  component: EvidenceListPage,
});

function EvidenceListPage() {
  const { t, lang: l } = useLanguage();
  const { data: evidence, isLoading } = useEvidence();

  const typeColors: Record<string, string> = {
    quantitative: "blue",
    qualitative: "purple",
    behavioral: "green",
    system_generated: "gray",
    contextual: "orange",
    temporal: "cyan",
  };

  const tableData = (evidence ?? []).map((ev) => {
    const emp = (ev as Record<string, unknown>).employees as Record<string, unknown> | null;
    return {
      id: ev.id,
      employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
      type: ev.evidence_type,
      source: ev.source,
      reliability: ev.reliability ?? "medium",
      description:
        (ev.description ?? "").slice(0, 80) + ((ev.description ?? "").length > 80 ? "..." : ""),
      date: ev.source_date ? new Date(ev.source_date).toLocaleDateString() : "-",
    };
  });

  return (
    <div>
      <PageHeader
        title="Evidence Library"
        titleAr="مكتبة الأدلة"
        description="All collected evidence items"
        descriptionAr="جميع عناصر الأدلة المجمعة"
        currentLang={l}
        actions={
          <Link
            to="/evidence/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Submit Evidence", "تقديم دليل")}
          </Link>
        }
      />
      <DataTable
        columns={[
          { key: "employee", label: t("Employee", "الموظف"), sortable: true },
          {
            key: "type",
            label: t("Type", "النوع"),
            render: (row) => (
              <StatusBadge
                status={typeColors[row.type] ?? "gray"}
                label={row.type.replace("_", " ")}
              />
            ),
          },
          { key: "source", label: t("Source", "المصدر") },
          {
            key: "reliability",
            label: t("Reliability", "الموثوقية"),
            render: (row) => (
              <StatusBadge
                status={
                  row.reliability === "high"
                    ? "green"
                    : row.reliability === "medium"
                      ? "yellow"
                      : "red"
                }
                label={row.reliability}
              />
            ),
          },
          { key: "description", label: t("Description", "الوصف") },
          { key: "date", label: t("Date", "التاريخ"), sortable: true },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />
      {!isLoading && tableData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("No evidence collected yet.", "لا توجد أدلة مجمعة بعد.")}</p>
          <Link
            to="/evidence/new"
            className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm no-underline"
          >
            {t("Submit Evidence", "تقديم دليل")}
          </Link>
        </div>
      )}
    </div>
  );
}
