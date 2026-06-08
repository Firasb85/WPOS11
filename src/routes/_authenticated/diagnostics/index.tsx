import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { MaturityBadge } from "~/components/wpos/MaturityBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useDiagnostics, useDeleteDiagnostic } from "@/hooks/useDiagnosticWorkflow";
import { GuidedDiagnosticWizard } from "@/components/diagnostics/GuidedDiagnosticWizard";
import { exportDiagnosticsPDF, type DiagnosticExportData } from "@/lib/export/pdf";
import { toast } from "sonner";
import {
  Plus,
  Stethoscope,
  Trash2,
  Eye,
  Sparkles,
  FileDown,
  CheckSquare,
  Square,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/diagnostics/")({
  component: DiagnosticsListPage,
});

function DiagnosticsListPage() {
  const { t, lang: l } = useLanguage();
  const { data: diagnostics, isLoading } = useDiagnostics();
  const deleteMutation = useDeleteDiagnostic();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const statusColors: Record<string, string> = {
    draft: "yellow",
    evidence_collection: "blue",
    under_review: "orange",
    approved: "green",
    rejected: "red",
    final: "green",
  };

  const items = (diagnostics ?? []).map((d) => {
    const emp = (d as Record<string, unknown>).employees as Record<string, unknown> | null;
    const dept = (d as Record<string, unknown>).departments as Record<string, unknown> | null;
    const hyps = ((d as Record<string, unknown>).diagnostic_hypotheses ?? []) as Array<
      Record<string, unknown>
    >;
    return {
      id: d.id,
      title: d.title,
      employee: emp ? `${emp.first_name} ${emp.last_name}` : "-",
      department: (dept?.name as string) ?? "-",
      status: d.status ?? "draft",
      maturity: d.maturity_level ?? 1,
      confidence: d.confidence_score ?? 0,
      date: d.created_at ? new Date(d.created_at).toLocaleDateString() : "-",
      summary: d.performance_summary ?? "",
      hypotheses: hyps
        .sort((a, b) => ((a.rank_order as number) ?? 99) - ((b.rank_order as number) ?? 99))
        .map((h) => ({
          rank: (h.rank_order as number) ?? 0,
          category: (h.category as string) ?? "",
          hypothesis: (h.hypothesis as string) ?? "",
          confidence: (h.confidence_score as number) ?? 0,
        })),
    };
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleBulkExport = () => {
    const selected = items.filter((i) => selectedIds.has(i.id));
    if (selected.length === 0) {
      toast.error(
        t("Select at least one report to export", "اختر تقريراً واحداً على الأقل للتصدير"),
      );
      return;
    }
    const exportData: DiagnosticExportData[] = selected.map((r) => ({
      title: r.title,
      employee: r.employee,
      department: r.department,
      status: r.status,
      maturity: r.maturity,
      confidence: r.confidence,
      date: r.date,
      summary: r.summary,
      hypotheses: r.hypotheses,
    }));
    exportDiagnosticsPDF(exportData);
    toast.success(
      t(
        `Exporting ${selected.length} report(s) as PDF`,
        `جاري تصدير ${selected.length} تقرير(تقارير) كـ PDF`,
      ),
    );
  };

  return (
    <div>
      <PageHeader
        title="Diagnostic Reports"
        titleAr="تقارير التشخيص"
        description="Performance diagnostic investigations and hypotheses"
        descriptionAr="التحقيقات التشخيصية للأداء والفرضيات"
        currentLang={l}
        actions={
          <div className="flex gap-2">
            <Link
              to="/diagnostics/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 no-underline"
            >
              <Plus className="w-4 h-4" />
              {t("New Diagnostic", "تشخيص جديد")}
            </Link>
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4" />
              {t("Guided Wizard", "المعالج الموجه")}
            </button>
          </div>
        }
      />

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedIds.size} {t("selected", "محدد")}
          </span>
          <button
            onClick={handleBulkExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
          >
            <FileDown className="w-3.5 h-3.5" />
            {t("Export PDF", "تصدير PDF")}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-blue-600 hover:underline ml-auto"
          >
            {t("Clear", "مسح")}
          </button>
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">{t("Loading...", "جاري التحميل...")}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 p-6">
            <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {t("No diagnostic reports yet.", "لا توجد تقارير تشخيصية بعد.")}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} aria-label="Select all">
                    {selectedIds.size === items.length && items.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Title", "العنوان")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Employee", "الموظف")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Status", "الحالة")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Maturity", "النضج")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Confidence", "الثقة")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {t("Date", "التاريخ")}
                </th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selectedIds.has(row.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                >
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(row.id)} aria-label={`Select ${row.title}`}>
                      {selectedIds.has(row.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium truncate max-w-[200px]">{row.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.employee}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={statusColors[row.status] ?? "gray"}
                      label={row.status.replace("_", " ")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <MaturityBadge
                      level={row.maturity as 1 | 2 | 3 | 4 | 5}
                      size="sm"
                      currentLang={l}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{row.confidence}%</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to="/diagnostics/report/$id"
                        params={{ id: row.id }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <GuidedDiagnosticWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </div>
  );
}
