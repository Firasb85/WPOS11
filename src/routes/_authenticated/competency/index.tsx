import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCompetencies, useCreateCompetency, useDeleteCompetency } from "@/hooks/useCompetencies";
import { Plus, Brain, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/competency/")({
  component: CompetencyLibraryPage,
});

function CompetencyLibraryPage() {
  const { t, lang: l } = useLanguage();
  const { data: competencies, isLoading } = useCompetencies();
  const createMutation = useCreateCompetency();
  const deleteMutation = useDeleteCompetency();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    competency_code: "",
    competency_name_en: "",
    competency_name_ar: "",
    category: "skill",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    setFormData({
      competency_code: "",
      competency_name_en: "",
      competency_name_ar: "",
      category: "skill",
      description: "",
    });
    setShowForm(false);
  };

  const tableData = (competencies ?? []).map((c) => ({
    id: c.id,
    code: c.competency_code,
    name: l === "ar" ? c.competency_name_ar : c.competency_name_en,
    category: c.category,
    status: c.status ?? "active",
    description: (c.description ?? "-").slice(0, 60),
  }));

  return (
    <div>
      <PageHeader
        title="Competency Library"
        titleAr="مكتبة الكفاءات"
        description="Define and manage organizational competencies"
        descriptionAr="تعريف وإدارة كفاءات المؤسسة"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Competency", "إضافة كفاءة")}
          </button>
        }
      />
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Code", "الرمز")} *
              </label>
              <input
                required
                value={formData.competency_code}
                onChange={(e) => setFormData({ ...formData, competency_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                placeholder="COMP-001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name (EN)", "الاسم (EN)")} *
              </label>
              <input
                required
                value={formData.competency_name_en}
                onChange={(e) => setFormData({ ...formData, competency_name_en: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Name (AR)", "الاسم (AR)")} *
              </label>
              <input
                required
                dir="rtl"
                value={formData.competency_name_ar}
                onChange={(e) => setFormData({ ...formData, competency_name_ar: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Category", "الفئة")}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="skill">{t("Skill", "مهارة")}</option>
                <option value="knowledge">{t("Knowledge", "معرفة")}</option>
                <option value="behavior">{t("Behavior", "سلوك")}</option>
                <option value="attitude">{t("Attitude", "موقف")}</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Description", "الوصف")}
              </label>
              <input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
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
            key: "code",
            label: t("Code", "الرمز"),
            render: (row) => <span className="font-mono text-xs">{row.code}</span>,
          },
          {
            key: "name",
            label: t("Competency", "الكفاءة"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          {
            key: "category",
            label: t("Category", "الفئة"),
            render: (row) => (
              <StatusBadge
                status={
                  row.category === "skill"
                    ? "blue"
                    : row.category === "knowledge"
                      ? "green"
                      : row.category === "behavior"
                        ? "orange"
                        : "purple"
                }
                label={row.category}
              />
            ),
          },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => (
              <StatusBadge status={row.status === "active" ? "green" : "gray"} label={row.status} />
            ),
          },
          { key: "description", label: t("Description", "الوصف") },
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
