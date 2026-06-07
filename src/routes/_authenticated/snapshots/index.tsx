import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useSnapshots } from "@/hooks/useKpis";
import { Plus, Camera } from "lucide-react";

export const Route = createFileRoute("/_authenticated/snapshots/")({
  component: SnapshotsPage,
});

function SnapshotsPage() {
  const { t, lang: l } = useLanguage();
  const { data: snapshots, isLoading } = useSnapshots();

  const tableData = (snapshots ?? []).map((s) => {
    const emp = (s as Record<string, unknown>).employees as Record<string, unknown> | null;
    const kpi = (s as Record<string, unknown>).kpis as Record<string, unknown> | null;
    return {
      id: s.id,
      employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
      kpi: kpi ? `${kpi.name} (${kpi.code})` : "-",
      period: s.period ?? "-",
      target: s.target_value != null ? String(s.target_value) : "-",
      actual: s.actual_value != null ? String(s.actual_value) : "-",
      gap: s.gap_value != null ? String(s.gap_value) : "-",
      gapPct: s.gap_percentage != null ? `${Number(s.gap_percentage).toFixed(1)}%` : "-",
      status: s.status ?? "green",
    };
  });

  return (
    <div>
      <PageHeader
        title="Performance Snapshots"
        titleAr="لقطات الأداء"
        description="KPI measurements and gap tracking"
        descriptionAr="قياسات مؤشرات الأداء وتتبع الفجوات"
        currentLang={l}
        actions={
          <Link
            to="/snapshots/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 no-underline"
          >
            <Plus className="w-4 h-4" />
            {t("Record Snapshot", "تسجيل لقطة")}
          </Link>
        }
      />
      <DataTable
        columns={[
          { key: "employee", label: t("Employee", "الموظف"), sortable: true },
          { key: "kpi", label: t("KPI", "المؤشر"), sortable: true },
          { key: "period", label: t("Period", "الفترة"), sortable: true },
          { key: "target", label: t("Target", "الهدف") },
          { key: "actual", label: t("Actual", "الفعلي") },
          {
            key: "gap",
            label: t("Gap", "الفجوة"),
            render: (row) => (
              <span
                className={`font-medium ${Number(row.gap) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {row.gap}
              </span>
            ),
          },
          {
            key: "gapPct",
            label: t("Gap %", "% الفجوة"),
            render: (row) => (
              <span
                className={`font-medium ${parseFloat(row.gapPct) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {row.gapPct}
              </span>
            ),
          },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => <StatusBadge status={row.status} label={row.status} />,
          },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />
      {!isLoading && tableData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "No snapshots yet. Record your first performance measurement.",
              "لا توجد لقطات بعد. سجّل أول قياس أداء.",
            )}
          </p>
          <Link
            to="/snapshots/new"
            className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm no-underline"
          >
            {t("Record Snapshot", "تسجيل لقطة")}
          </Link>
        </div>
      )}
    </div>
  );
}
