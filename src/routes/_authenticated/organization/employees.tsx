import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import {
  useEmployeesList,
  useTeams,
  useCreateEmployee,
  useDeleteEmployee,
} from "@/hooks/useOrganization";
import { Plus, UserCircle, Trash2, Pencil } from "lucide-react";
import { EditModal } from "@/components/wpos/EditModal";

export const Route = createFileRoute("/_authenticated/organization/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const { t, lang: l } = useLanguage();
  const [filters, setFilters] = useState({ page: 1, pageSize: 20, search: "" });
  const { data, isLoading } = useEmployeesList(filters);
  const { data: teams } = useTeams();
  const createMutation = useCreateEmployee();
  const deleteMutation = useDeleteEmployee();
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Record<string, string> | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_code: "",
    team_id: "",
    employment_status: "active",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      ...formData,
      team_id: formData.team_id || null,
    };
    try {
      await createMutation.mutateAsync(input);
      toast.success("Created successfully");
    } catch (err) {
      toast.error("Failed to create: " + (err instanceof Error ? err.message : "Unknown error"));
      return;
    }
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      employee_code: "",
      team_id: "",
      employment_status: "active",
    });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("Delete this employee?", "حذف هذا الموظف؟"))) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error("Failed to delete: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const handleEdit = async (formData: Record<string, string>) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("employees")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          employment_status: formData.employment_status,
        })
        .eq("id", formData.id);
      if (error) throw error;
      toast.success("Employee updated successfully");
    } catch {
      toast.error("Failed to update employee");
    }
  };

  const employees = data?.data ?? [];
  const total = data?.total ?? 0;

  const tableData = employees.map((emp) => {
    const tm = (emp as Record<string, unknown>).teams as Record<string, unknown> | null;
    const dept = tm?.departments as Record<string, unknown> | null;
    return {
      id: emp.id,
      name: `${emp.first_name} ${emp.last_name}`,
      code: emp.employee_code ?? "-",
      email: emp.email ?? "-",
      phone: emp.phone ?? "-",
      team: (tm?.name as string) ?? "-",
      department: (dept?.name as string) ?? "-",
      status: emp.is_active ? "active" : "inactive",
    };
  });

  return (
    <div>
      <PageHeader
        title="Employees"
        titleAr="الموظفون"
        description="Manage your workforce"
        descriptionAr="إدارة القوى العاملة"
        currentLang={l}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("Add Employee", "إضافة موظف")}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-sm font-semibold mb-4">{t("New Employee", "موظف جديد")}</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("First Name", "الاسم الأول")} *
              </label>
              <input
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Last Name", "الاسم الأخير")} *
              </label>
              <input
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Employee Code", "رمز الموظف")}
              </label>
              <input
                value={formData.employee_code}
                onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Email", "البريد")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Phone", "الهاتف")}
              </label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("Team", "الفريق")}
              </label>
              <select
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">{t("No team", "بدون فريق")}</option>
                {(teams ?? []).map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.name}
                  </option>
                ))}
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
            label: t("Employee", "الموظف"),
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-green-500" />
                <div>
                  <span className="font-medium">{row.name}</span>
                  <p className="text-xs text-gray-400">{row.code}</p>
                </div>
              </div>
            ),
          },
          { key: "email", label: t("Email", "البريد") },
          { key: "phone", label: t("Phone", "الهاتف") },
          { key: "team", label: t("Team", "الفريق") },
          { key: "department", label: t("Department", "الإدارة") },
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
        onSearch={(query) => setFilters({ ...filters, search: query, page: 1 })}
        pagination={{
          total,
          page: filters.page,
          pageSize: filters.pageSize,
          onPageChange: (page) => setFilters({ ...filters, page }),
        }}
      />

      {!isLoading && tableData.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t("No employees yet.", "لا يوجد موظفون بعد.")}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t("Add Employee", "إضافة موظف")}
          </button>
        </div>
      )}
      {/* Edit Modal */}
      <EditModal
        isOpen={!!editEmployee}
        onClose={() => setEditEmployee(null)}
        onSave={handleEdit}
        title="Edit Employee"
        initialData={editEmployee || undefined}
        fields={[
          { key: "first_name", label: "First Name", required: true },
          { key: "last_name", label: "Last Name", required: true },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone", type: "tel" },
          {
            key: "employment_status",
            label: "Status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "on_leave", label: "On Leave" },
              { value: "terminated", label: "Terminated" },
            ],
          },
        ]}
      />
    </div>
  );
}
