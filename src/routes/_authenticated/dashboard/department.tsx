import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatsCard } from "~/components/wpos/StatsCard";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";
export const Route = createFileRoute("/_authenticated/dashboard/department")({
  component: DepartmentDashboardPage,
});
function DepartmentDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Department Dashboard"
        description="Monitor department performance and KPIs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Dept Employees" value="45" change={2} icon={<Users />} status="good" />
        <StatsCard
          title="Dept Performance"
          value="84%"
          change={-3.5}
          icon={<TrendingUp />}
          status="warning"
        />
        <StatsCard
          title="Open Diagnostics"
          value="3"
          change={50}
          icon={<AlertTriangle />}
          status="critical"
        />
        <StatsCard title="Avg Response" value="2.4h" change={-12} icon={<Clock />} status="good" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department KPIs</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { kpi: "Team Productivity", target: 85, actual: 79, status: "yellow" },
              { kpi: "Quality Score", target: 98, actual: 95, status: "green" },
              { kpi: "Attendance Rate", target: 97, actual: 93, status: "yellow" },
            ].map((k, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{k.kpi}</p>
                  <p className="text-xs text-gray-500">
                    Target: {k.target} | Actual: {k.actual}
                  </p>
                </div>
                <StatusBadge status={k.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Diagnostics</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { emp: "Sarah Ahmed", issue: "Quality decline", date: "2026-06-04" },
              { emp: "Mohammed Ali", issue: "Low productivity", date: "2026-06-03" },
            ].map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{d.emp}</p>
                  <p className="text-xs text-gray-500">{d.issue}</p>
                </div>
                <span className="text-xs text-gray-400">{d.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
