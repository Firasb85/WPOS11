import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Plus, GitBranch } from "lucide-react";
export const Route = createFileRoute("/_authenticated/organization/branches")({
  component: BranchesPage,
});
function BranchesPage() {
  const data = [
    { id: "1", name: "Riyadh HQ", company: "Acme Corp", city: "Riyadh", isActive: true },
    { id: "2", name: "Jeddah Branch", company: "Acme Corp", city: "Jeddah", isActive: true },
  ];
  return (
    <div>
      <PageHeader
        title="Branches"
        description="Manage branches"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Branch
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
                <GitBranch className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{i.name}</span>
              </div>
            ),
          },
          { key: "company", label: "Company" },
          { key: "city", label: "City" },
          {
            key: "isActive",
            label: "Status",
            render: (i) => <StatusBadge status={i.isActive ? "active" : "inactive"} />,
          },
        ]}
        data={data}
      />
    </div>
  );
}
