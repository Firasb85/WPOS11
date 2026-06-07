import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useKpis, useKpiCategories, useCreateKpi, useDeleteKpi } from "@/hooks/useKpis";
import { Plus, Gauge, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/kpis/library")({
  component: KpiLibraryPage,
});

function KpiLibraryPage() {
  const { t, lang: l } = useLanguage();
  const { data: kpis, isLoading } = useKpis();
  const { data: categories } = useKpiCategories();
  const createMutation = useCreateKpi();
  const deleteMutation = useDeleteKpi();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category_id: "",
    unit: "",
    target_value: "",
    measurement_frequency: "monthly",
    is_higher_better: true,
    warning_threshold: "",
    critical_threshold: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      name: formData.name,
      code: formData.code,
      category_id: formData.category_id || null,
      unit: formData.unit || null,
      target_value: formData.target_value ? Number(formData.target_value) : null,
      measurement_frequency: formData.measurement_frequency,
      is_higher_better: formData.is_higher_better,
      warning_threshold: formData.warning_threshold ? Number(formData.warning_threshold) : null,
      critical_threshold: formData.critical_threshold ? Number(formData.critical_threshold) : null,
    });
    setFormData({
      name: "",
      code: "",
      category_id: "",
      unit: "",
      target_value: "",
      measurement_frequency: "monthly",
      is_higher_better: true,
      warning_threshold: "",
      critical_threshold: "",
    });
    setShowForm(false);
  };

  const tableData = (kpis ?? []).map((k) => {
    const cat = (k as Record<string, unknown>).kpi_categories as Record<string, unknown> | null;
    return {
      id: k.id,
      name: k.name,
      code: k.code ?? "-",
      category: (cat?.name as string) ?? "-",
      target: k.target_value != null ? `${k.target_value} ${k.unit ?? ""}` : "-",
      frequency: k.measurement_frequency ?? "-",
      direction: k.is_higher_better ? "↑ Higher is better" : "↓ Lower is better",
    };
  });

  return (
    <div>
      <PageHeader
        title="KPI Library"
        titleAr="مكتبة المؤشرات"
        description="Define and manage key performance indicators"
        descriptionAr="تعريف وإدارة مؤشرات الأداء الرئيسية"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add KPI", "إضافة مؤشر")}
          </button>
        }
      />
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New KPI", "مؤشر جديد")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name", "الاسم")} *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Code", "الرمز")} *
              </label>
              <input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Category", "الفئة")}
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("Select", "اختر")}</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Target Value", "القيمة المستهدفة")}
              </label>
              <input
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Unit", "الوحدة")}
              </label>
              <input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="%, hrs, count..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Frequency", "التكرار")}
              </label>
              <select
                value={formData.measurement_frequency}
                onChange={(e) =>
                  setFormData({ ...formData, measurement_frequency: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {t("Cancel", "إلغاء")}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {createMutation.isPending ? t("Creating...", "جاري...") : t("Create", "إنشاء")}
              </button>
            </div>
          </form>
        </Card>
      )}
      <DataTable
        columns={[
          {
            key: "name",
            label: t("KPI", "المؤشر"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="font-medium">{row.name}</span>
                  <p className="text-xs text-gray-400 font-mono">{row.code}</p>
                </div>
              </div>
            ),
          },
          { key: "category", label: t("Category", "الفئة") },
          { key: "target", label: t("Target", "الهدف") },
          { key: "frequency", label: t("Frequency", "التكرار") },
          {
            key: "direction",
            label: t("Direction", "الاتجاه"),
            render: (row) => <span className="text-xs">{row.direction}</span>,
          },
          {
            key: "id",
            label: "",
            render: (row) => (
              <button
                onClick={() => deleteMutation.mutate(row.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={tableData}
        isLoading={isLoading}
        searchable
      />
    </div>
  );
}
