import { createFileRoute } from "@tanstack/react-router";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { Shield, Plus, Check, Lock } from "lucide-react";
import { useState } from "react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useRoles, usePermissions } from "@/hooks/useAdmin";
export const Route = createFileRoute("/_authenticated/admin/roles")({
  component: RoleManagementPage,
});
function RoleManagementPage() {
  const { data: rolesData, isLoading: _rolesLoading } = useRoles();
  const { data: permsData } = usePermissions();
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const [selected, setSelected] = useState("super_admin");
  const roles: { [k: string]: any }[] = [];
  const modules: { [k: string]: any }[] = [];
  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader
          title="Role Management"
          description="Manage roles and permissions"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            {roles.map((r) => (
              <div
                key={r.id}
                className={`p-3 rounded-lg border cursor-pointer ${selected === r.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
                onClick={() => setSelected(r.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield
                    className={`w-4 h-4 ${selected === r.id ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm font-medium">{r.name}</span>
                  {r.isSystem && <Lock className="w-3 h-3 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-500">{r.count} users</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Permissions - {roles.find((r) => r.id === selected)?.name}</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                        Module
                      </th>
                      {["View", "Create", "Edit", "Delete", "Review", "Approve", "Export"].map(
                        (p) => (
                          <th
                            key={p}
                            className="px-3 py-3 text-xs font-semibold text-gray-500 text-center"
                          >
                            {p}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {modules.map((m) => (
                      <tr key={m.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                        {["view", "create", "edit", "delete", "review", "approve", "export"].map(
                          (p) => (
                            <td key={p} className="px-3 py-3 text-center">
                              {m.perms.includes(p) ? (
                                selected === "super_admin" ? (
                                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <div className="flex justify-center">
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer hover:border-blue-500" />
                                  </div>
                                )
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
