import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { DataTable } from "~/components/wpos/DataTable";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";
export const Route = createFileRoute("/_authenticated/dashboard/supervisor")({
  component: SupervisorDashboardPage,
});
function SupervisorDashboardPage() {
  const team = [
    {
      id: "1",
      name: "Ahmad Khalid",
      role: "Senior Analyst",
      status: "green" as const,
      review: false,
    },
    { id: "2", name: "Layla Ibrahim", role: "Analyst", status: "yellow" as const, review: true },
    { id: "3", name: "Omar Hassan", role: "Junior Analyst", status: "red" as const, review: true },
  ];
  return (
    <div>
      <PageHeader title="Supervisor Dashboard" description="Manage your team performance" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Team Members" value="8" icon={<Users />} />
        <StatsCard
          title="Team Performance"
          value="79%"
          change={-2.5}
          icon={<TrendingUp />}
          status="warning"
        />
        <StatsCard
          title="Need Review"
          value="2"
          change={100}
          icon={<AlertTriangle />}
          status="critical"
        />
        <StatsCard title="Recent Reports" value="5" icon={<Clock />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <DataTable
          columns={[
            {
              key: "name",
              label: "Name",
              sortable: true,
              render: (i) => <span className="font-medium">{i.name}</span>,
            },
            { key: "role", label: "Role" },
            { key: "status", label: "Status", render: (i) => <StatusBadge status={i.status} /> },
            {
              key: "review",
              label: "Needs Review",
              render: (i) =>
                i.review ? (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-400">No</span>
                ),
            },
          ]}
          data={team}
        />
      </Card>
    </div>
  );
}
