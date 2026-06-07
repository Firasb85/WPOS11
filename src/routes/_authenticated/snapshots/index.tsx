import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, Camera, TrendingUp, TrendingDown, Minus } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/snapshots/')({ component: SnapshotsPage });
function SnapshotsPage() {
  const data = [
    { id: '1', employee: 'Ahmad Khalid', kpi: 'Production Efficiency', target: 90, actual: 78, gap: -12, gapPct: -13.3, status: 'red' as const, period: '2026-05', trend: 'declining' },
    { id: '2', employee: 'Layla Ibrahim', kpi: 'Customer Satisfaction', target: 95, actual: 88, gap: -7, gapPct: -7.4, status: 'yellow' as const, period: '2026-05', trend: 'stable' },
    { id: '3', employee: 'Ahmad Khalid', kpi: 'Quality Score', target: 98, actual: 96, gap: -2, gapPct: -2.0, status: 'green' as const, period: '2026-05', trend: 'improving' },
    { id: '4', employee: 'Omar Hassan', kpi: 'Attendance Rate', target: 97, actual: 95, gap: -2, gapPct: -2.1, status: 'green' as const, period: '2026-05', trend: 'stable' },
  ];
  const trendIcon = (t: string) => t === 'improving' ? <TrendingUp className="w-4 h-4 text-green-500" /> : t === 'declining' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-gray-400" />;
  return (
    <div><PageHeader title="Performance Snapshots" description="Record and view actual performance" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Record Snapshot</button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[{ label: 'Total', count: 24 }, { label: 'Good', count: 12, color: 'text-green-600' }, { label: 'Warning', count: 8, color: 'text-yellow-600' }, { label: 'Critical', count: 4, color: 'text-red-600' }].map(s => (
          <div key={s.label} className="p-4 bg-white dark:bg-gray-900 rounded-xl border"><div className="flex items-center gap-3"><Camera className="w-5 h-5 text-blue-600" /><div><p className="text-xs text-gray-500">{s.label}</p><p className={`text-xl font-bold ${s.color || 'text-gray-900'}`}>{s.count}</p></div></div></div>
        ))}
      </div>
      <DataTable columns={[
        { key: 'employee', label: 'Employee', sortable: true, render: (i: any) => <span className="font-medium">{i.employee}</span> },
        { key: 'kpi', label: 'KPI' }, { key: 'target', label: 'Target' }, { key: 'actual', label: 'Actual' },
        { key: 'gap', label: 'Gap', render: (i: any) => <span className={i.gap < 0 ? 'text-red-600' : 'text-green-600'}>{i.gap}</span> },
        { key: 'gapPct', label: 'Gap %' }, { key: 'status', label: 'Status', render: (i: any) => <StatusBadge status={i.status} /> },
        { key: 'trend', label: 'Trend', render: (i: any) => trendIcon(i.trend) },
        { key: 'period', label: 'Period' },
      ]} data={data} />
    </div>
  );
}
