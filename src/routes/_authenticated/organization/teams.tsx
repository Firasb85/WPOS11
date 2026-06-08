import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useTeams, useDepartments, useCreateTeam, useDeleteTeam } from "@/hooks/useOrganization";
import { Plus, Users, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/teams")({
  component: TeamsPage,
});

function TeamsPage() {
  const { t, lang: l } = useLanguage();
  const { data: teams, isLoading } = useTeams();
  const { data: departments } = useDepartments();
  const createMutation = useCreateTeam();
  const deleteMutation = useDeleteTeam();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    code: "",
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
    setFormData({ name: "", department_id: "", code: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("Delete this team?", "حذف هذا الفريق؟"))) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error("Failed to delete: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const tableData = (teams ?? []).map((tm) => {
    const dept = (tm as Record<string, unknown>).departments as Record<string, unknown> | null;
    const branch = dept?.branches as Record<string, unknown> | null;
    return {
      id: tm.id,
      name: tm.name,
      code: tm.code ?? "-",
      department: (dept?.name as string) ?? "-",
      branch: (branch?.name as string) ?? "-",
      status: tm.is_active ? "active" : "inactive",
    };
  });

  return (
    <div>
      <PageHeader
        title="Teams"
        titleAr="الفرق"
        description="Manage organizational teams"
        descriptionAr="إدارة فرق المؤسسة"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Team", "إضافة فريق")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New Team", "فريق جديد")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Department", "الإدارة")} *
              </label>
              <select
                required
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("Select department", "اختر الإدارة")}</option>
                {(departments ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
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
            label: t("Team", "الفريق"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          { key: "code", label: t("Code", "الرمز") },
          { key: "department", label: t("Department", "الإدارة") },
          { key: "branch", label: t("Branch", "الفرع") },
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
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("No teams yet.", "لا توجد فرق بعد.")}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Team", "إضافة فريق")}
          </button>
        </div>
      )}
    </div>
  );
}
