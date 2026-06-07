import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, Users } from "lucide-react";
export const Route = createFileRoute("/_authenticated/organization/teams")({
  component: TeamsPage,
});
function TeamsPage() {
  const data = [
    {
      id: "1",
      name: "Alpha Team",
      dept: "Operations",
      leader: "Ahmad Khalid",
      members: 8,
      active: true,
    },
    {
      id: "2",
      name: "Beta Team",
      dept: "Operations",
      leader: "Layla Ibrahim",
      members: 6,
      active: true,
    },
  ];
  return (
    <div>
      <PageHeader
        title="Teams"
        description="Manage teams"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Team
          </button>
        }
      />
      <DataTable
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (i) => (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{i.name}</span>
              </div>
            ),
          },
          { key: "dept", label: "Department" },
          { key: "leader", label: "Leader" },
          { key: "members", label: "Members" },
          {
            key: "active",
            label: "Status",
            render: (i) => <StatusBadge status={i.active ? "active" : "inactive"} />,
          },
        ]}
        data={data}
      />
    </div>
  );
}
