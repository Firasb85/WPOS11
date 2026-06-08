import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useJobGrades, useCreateJobGrade, useDeleteJobGrade } from "@/hooks/useJobs";
import { Plus, Layers, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/jobs/grades")({ component: JobGradesPage });

function JobGradesPage() {
  const { t, lang: l } = useLanguage();
  const { data: grades, isLoading } = useJobGrades();
  const createMutation = useCreateJobGrade();
  const deleteMutation = useDeleteJobGrade();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", level: "1", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({ ...formData, level: Number(formData.level) });
    setFormData({ name: "", code: "", level: "1", description: "" });
    setShowForm(false);
  };

  const tableData = (grades ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    code: g.code ?? "-",
    level: String(g.level),
    description: g.description ?? "-",
  }));

  return (
    <div>
      <PageHeader
        title="Job Grades"
        titleAr="المستويات الوظيفية"
        description="Manage job grade levels"
        descriptionAr="إدارة مستويات الوظائف"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Grade", "إضافة مستوى")}
          </button>
        }
      />
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {t("Code", "الرمز")}
              </label>
              <input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Level", "المستوى")} *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Description", "الوصف")}
              </label>
              <input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div className="md:col-span-4 flex gap-2 justify-end">
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
            label: t("Name", "الاسم"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          { key: "level", label: t("Level", "المستوى"), sortable: true },
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
