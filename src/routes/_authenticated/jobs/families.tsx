import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useJobFamilies, useCreateJobFamily, useDeleteJobFamily } from "@/hooks/useJobs";
import { Plus, FolderTree, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/jobs/families")({
  component: JobFamiliesPage,
});

function JobFamiliesPage() {
  const { t, lang: l } = useLanguage();
  const { data: families, isLoading } = useJobFamilies();
  const createMutation = useCreateJobFamily();
  const deleteMutation = useDeleteJobFamily();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Created successfully");
    } catch (err) {
      toast.error("Failed to create: " + (err instanceof Error ? err.message : "Unknown error"));
      return;
    }
    setFormData({ name: "", code: "", description: "" });
    setShowForm(false);
  };

  const tableData = (families ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    code: f.code ?? "-",
    description: f.description ?? "-",
  }));

  return (
    <div>
      <PageHeader
        title="Job Families"
        titleAr="مجموعات الوظائف"
        description="Manage job family groupings"
        descriptionAr="إدارة تصنيفات الوظائف"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Family", "إضافة مجموعة")}
          </button>
        }
      />
      {showForm && (
        <Card className="mb-6">
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
            key: "name",
            label: t("Name", "الاسم"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
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
