import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useEmployeesList } from "@/hooks/useOrganization";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { Users, UserCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { t, lang: l } = useLanguage();
  const { data: employees, isLoading } = useEmployeesList({ pageSize: 100 });

  const tableData = (employees?.data ?? []).map((e) => ({
    id: e.id,
    name: `${e.first_name} ${e.last_name}`,
    email: e.email ?? "-",
    code: e.employee_code ?? "-",
    status: e.is_active ? "active" : "inactive",
  }));

  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader
          title="User Management"
          titleAr="إدارة المستخدمين"
          description="Manage system users and access — live data"
          descriptionAr="إدارة مستخدمي النظام والوصول — بيانات حية"
          currentLang={l}
        />
        <DataTable
          columns={[
            {
              key: "name",
              label: t("Name", "الاسم"),
              sortable: true,
              render: (row) => (
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="font-medium">{row.name}</span>
                    <p className="text-xs text-gray-400">{row.code}</p>
                  </div>
                </div>
              ),
            },
            { key: "email", label: t("Email", "البريد") },
            {
              key: "status",
              label: t("Status", "الحالة"),
              render: (row) => (
                <StatusBadge
                  status={row.status === "active" ? "green" : "red"}
                  label={row.status}
                />
              ),
            },
          ]}
          data={tableData}
          isLoading={isLoading}
          searchable
        />
        {!isLoading && tableData.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t("No users found.", "لا يوجد مستخدمون.")}</p>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
