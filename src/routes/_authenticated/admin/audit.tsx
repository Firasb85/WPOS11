import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { UserCircle, Download } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/admin/audit")({ component: AuditLogsPage });
function AuditLogsPage() {
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const logs = [
    {
      id: "1",
      user: "Ahmad Ali",
      action: "Login",
      entity: "Session",
      desc: "User logged in",
      ip: "192.168.1.100",
      time: "2026-06-06 10:30",
    },
    {
      id: "2",
      user: "Nora Al-Faisal",
      action: "Create",
      entity: "Employee",
      desc: "Created employee record",
      ip: "192.168.1.101",
      time: "2026-06-06 09:15",
    },
    {
      id: "3",
      user: "Khalid Al-Saud",
      action: "Update",
      entity: "KPI",
      desc: "Updated KPI target",
      ip: "192.168.1.102",
      time: "2026-06-05 14:30",
    },
    {
      id: "4",
      user: "Ahmad Ali",
      action: "Delete",
      entity: "User",
      desc: "Deleted inactive user",
      ip: "192.168.1.100",
      time: "2026-06-05 11:00",
    },
  ];
  const actionColors: Record<string, string> = {
    Login: "bg-blue-100 text-blue-700",
    Create: "bg-green-100 text-green-700",
    Update: "bg-yellow-100 text-yellow-700",
    Delete: "bg-red-100 text-red-700",
  };
  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Track all system activities"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        }
      />
      <DataTable
        columns={[
          {
            key: "user",
            label: "User",
            sortable: true,
            render: (i) => (
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{i.user}</span>
              </div>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (i) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${actionColors[i.action] || "bg-gray-100"}`}
              >
                {i.action}
              </span>
            ),
          },
          { key: "entity", label: "Entity" },
          { key: "desc", label: "Description" },
          {
            key: "ip",
            label: "IP",
            render: (i) => <span className="font-mono text-xs text-gray-500">{i.ip}</span>,
          },
          { key: "time", label: "Time", sortable: true },
        ]}
        data={logs}
        pageSize={10}
      />
    </div>
  );
}
