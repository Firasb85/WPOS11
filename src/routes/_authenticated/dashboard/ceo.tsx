import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { StatsCard } from '../../../components/ui/StatsCard';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Users, Building2, TrendingUp, AlertTriangle } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/dashboard/ceo')({ component: CEODashboardPage });
function CEODashboardPage() {
  const statsCards = [
    { title: 'Total Employees', value: '1,247', change: 3.2, icon: <Users />, status: 'good' as const },
    { title: 'Departments', value: '12', change: 0, icon: <Building2 />, status: 'good' as const },
    { title: 'Performance Index', value: '87.5%', change: -2.1, icon: <TrendingUp />, status: 'warning' as const },
    { title: 'Critical KPIs', value: '4', change: 33.3, icon: <AlertTriangle />, status: 'critical' as const },
  ];
  const criticalKPIs = [
    { id: '1', kpi: 'Customer Satisfaction', target: 95, actual: 82, gap: -13, status: 'red' as const, trend: 'declining' },
    { id: '2', kpi: 'Production Efficiency', target: 90, actual: 78, gap: -12, status: 'red' as const, trend: 'declining' },
    { id: '3', kpi: 'On-Time Delivery', target: 98, actual: 91, gap: -7, status: 'yellow' as const, trend: 'stable' },
    { id: '4', kpi: 'Quality Score', target: 99, actual: 96, gap: -3, status: 'yellow' as const, trend: 'improving' },
  ];
  return (
    <div>
      <PageHeader title="CEO Dashboard" description="Organization-wide performance overview" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{statsCards.map((s, i) => <StatsCard key={i} {...s} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Top Risks</CardTitle></CardHeader>
          <div className="space-y-4">
            {[{ risk: 'Customer Satisfaction Drop', level: 'High', dept: 'Operations' }, { risk: 'Production Bottleneck', level: 'Critical', dept: 'Manufacturing' }, { risk: 'Staff Turnover', level: 'Medium', dept: 'HR' }].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div><p className="text-sm font-medium text-gray-900">{r.risk}</p><p className="text-xs text-gray-500">{r.dept}</p></div>
                <StatusBadge status={r.level === 'Critical' ? 'red' : r.level === 'High' ? 'yellow' : 'green'} label={r.level} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>KPI Status Overview</CardTitle></CardHeader>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Good', count: 42, color: 'green' }, { label: 'Warning', count: 18, color: 'yellow' }, { label: 'Critical', count: 4, color: 'red' }].map(s => (
              <div key={s.label} className={`text-center p-4 bg-${s.color}-50 dark:bg-${s.color}-900/20 rounded-lg`}>
                <p className={`text-2xl font-bold text-${s.color}-600`}>{s.count}</p><p className="text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Critical KPIs</h2>
      <DataTable columns={[{ key: 'kpi', label: 'KPI', sortable: true }, { key: 'target', label: 'Target' }, { key: 'actual', label: 'Actual' }, { key: 'gap', label: 'Gap' }, { key: 'status', label: 'Status', render: (i: any) => <StatusBadge status={i.status} /> }, { key: 'trend', label: 'Trend' }]} data={criticalKPIs} />
    </div>
  );
}
