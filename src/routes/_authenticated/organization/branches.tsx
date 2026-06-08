import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import {
  useBranches,
  useCompanies,
  useCreateBranch,
  useDeleteBranch,
} from "@/hooks/useOrganization";
import { Plus, GitBranch, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/branches")({
  component: BranchesPage,
});

function BranchesPage() {
  const { t, lang: l } = useLanguage();
  const { data: branches, isLoading } = useBranches();
  const { data: companies } = useCompanies();
  const createMutation = useCreateBranch();
  const deleteMutation = useDeleteBranch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    code: "",
    city: "",
    email: "",
    phone: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Created successfully");
    } catch (err) {
      toast.error("Failed to create: " + (err instanceof Error ? err.message : "Unknown error"));
      return;
    }
    setFormData({ name: "", company_id: "", code: "", city: "", email: "", phone: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("Delete this branch?", "حذف هذا الفرع؟"))) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error("Failed to delete: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const tableData = (branches ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    code: b.code ?? "-",
    company: (b as Record<string, unknown>).companies
      ? (((b as Record<string, unknown>).companies as Record<string, unknown>)?.name ?? "-")
      : "-",
    city: b.city ?? "-",
    email: b.email ?? "-",
    status: b.is_active ? "active" : "inactive",
  }));

  return (
    <div>
      <PageHeader
        title="Branches"
        titleAr="الفروع"
        description="Manage organizational branches"
        descriptionAr="إدارة فروع المؤسسة"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Branch", "إضافة فرع")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New Branch", "فرع جديد")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Company", "الشركة")} *
              </label>
              <select
                required
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("Select company", "اختر الشركة")}</option>
                {(companies ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                {t("City", "المدينة")}
              </label>
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
            label: t("Branch", "الفرع"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          { key: "company", label: t("Company", "الشركة") },
          { key: "city", label: t("City", "المدينة") },
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
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("No branches yet.", "لا توجد فروع بعد.")}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Branch", "إضافة فرع")}
          </button>
        </div>
      )}
    </div>
  );
}
