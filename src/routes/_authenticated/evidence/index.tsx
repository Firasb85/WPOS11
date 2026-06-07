import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, TrendingUp, FileText, UserCheck, Eye, AlertTriangle } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/evidence/')({ component: EvidencePage });
function EvidencePage() {
  const data = [
    { id: '1', employee: 'Ahmad Khalid', type: 'quantitative', source: 'KPI Report', date: '2026-06-01', reliability: 'high' as const },
    { id: '2', employee: 'Layla Ibrahim', type: 'qualitative', source: 'Supervisor Obs.', date: '2026-05-28', reliability: 'high' as const },
    { id: '3', employee: 'Omar Hassan', type: 'system_generated', source: 'Attendance System', date: '2026-05-30', reliability: 'high' as const },
    { id: '4', employee: 'Nadia Karim', type: 'contextual', source: 'Project Report', date: '2026-05-20', reliability: 'medium' as const },
  ];
  const typeIcons: Record<string, any> = { quantitative: <TrendingUp className="w-4 h-4" />, qualitative: <FileText className="w-4 h-4" />, behavioral: <UserCheck className="w-4 h-4" />, system_generated: <Eye className="w-4 h-4" />, contextual: <AlertTriangle className="w-4 h-4" /> };
  const typeColors: Record<string, string> = { quantitative: 'bg-blue-100 text-blue-700', qualitative: 'bg-purple-100 text-purple-700', behavioral: 'bg-green-100 text-green-700', system_generated: 'bg-orange-100 text-orange-700', contextual: 'bg-pink-100 text-pink-700' };
  return (
    <div><PageHeader title="Evidence Library" description="Store and manage performance evidence" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Submit Evidence</button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total', count: 24 }, { label: 'High Reliability', count: 18, color: 'text-green-600' }, { label: 'Quantitative', count: 10, color: 'text-blue-600' }].map(s => (
          <div key={s.label} className="p-4 bg-white dark:bg-gray-900 rounded-xl border text-center"><p className={`text-2xl font-bold ${s.color || 'text-gray-900'}`}>{s.count}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></div>
        ))}
      </div>
      <DataTable columns={[
        { key: 'employee', label: 'Employee', sortable: true, render: (i: any) => <span className="font-medium">{i.employee}</span> },
        { key: 'type', label: 'Type', render: (i: any) => <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColors[i.type]}`}>{typeIcons[i.type]}{i.type.replace('_', ' ')}</span> },
        { key: 'source', label: 'Source' }, { key: 'date', label: 'Date' },
        { key: 'reliability', label: 'Reliability', render: (i: any) => <StatusBadge status={i.reliability === 'high' ? 'green' : i.reliability === 'medium' ? 'yellow' : 'red'} label={i.reliability} /> },
      ]} data={data} />
    </div>
  );
}
