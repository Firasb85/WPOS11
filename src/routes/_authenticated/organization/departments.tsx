import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import {
  useDepartments,
  useBranches,
  useCreateDepartment,
  useDeleteDepartment,
} from "@/hooks/useOrganization";
import { Plus, Building, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/departments")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { t, lang: l } = useLanguage();
  const { data: departments, isLoading } = useDepartments();
  const { data: branches } = useBranches();
  const createMutation = useCreateDepartment();
  const deleteMutation = useDeleteDepartment();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    branch_id: "",
    code: "",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    setFormData({ name: "", branch_id: "", code: "", description: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("Delete this department?", "حذف هذه الإدارة؟"))) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const tableData = (departments ?? []).map((d) => {
    const branch = (d as Record<string, unknown>).branches as Record<string, unknown> | null;
    const company = branch?.companies as Record<string, unknown> | null;
    return {
      id: d.id,
      name: d.name,
      code: d.code ?? "-",
      branch: (branch?.name as string) ?? "-",
      company: (company?.name as string) ?? "-",
      description: d.description ?? "-",
      status: d.is_active ? "active" : "inactive",
    };
  });

  return (
    <div>
      <PageHeader
        title="Departments"
        titleAr="الإدارات"
        description="Manage organizational departments"
        descriptionAr="إدارة إدارات المؤسسة"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Department", "إضافة إدارة")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New Department", "إدارة جديدة")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Branch", "الفرع")} *
              </label>
              <select
                required
                value={formData.branch_id}
                onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("Select branch", "اختر الفرع")}</option>
                {(branches ?? []).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
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
            <div className="md:col-span-2 flex gap-2 justify-end">
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
                {createMutation.isPending
                  ? t("Creating...", "جاري الإنشاء...")
                  : t("Create", "إنشاء")}
              </button>
            </div>
          </form>
        </Card>
      )}

      <DataTable
        columns={[
          {
            key: "name",
            label: t("Department", "الإدارة"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          { key: "branch", label: t("Branch", "الفرع") },
          { key: "company", label: t("Company", "الشركة") },
          {
            key: "status",
            label: t("Status", "الحالة"),
            render: (row) => (
              <StatusBadge status={row.status === "active" ? "green" : "red"} label={row.status} />
            ),
          },
          {
            key: "id",
            label: "",
            render: (row) => (
              <button
                onClick={() => handleDelete(row.id)}
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

      {!isLoading && tableData.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("No departments yet.", "لا توجد إدارات بعد.")}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Department", "إضافة إدارة")}
          </button>
        </div>
      )}
    </div>
  );
}
