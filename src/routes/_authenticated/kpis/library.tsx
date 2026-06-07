import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { DataTable } from '~/components/wpos/DataTable';
import { Plus, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
export const Route = createFileRoute('/_authenticated/kpis/library')({ component: KpiLibraryPage });
function KpiLibraryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const kpis = [
    { id: '1', name: 'Customer Satisfaction', code: 'CSAT', category: 'Customer', target: 95, unit: '%', freq: 'monthly', higher: true, warning: 10, critical: 20, owner: 'Khalid' },
    { id: '2', name: 'Production Efficiency', code: 'PE', category: 'Efficiency', target: 90, unit: '%', freq: 'weekly', higher: true, warning: 10, critical: 15, owner: 'Ahmad' },
    { id: '3', name: 'Error Rate', code: 'ERR', category: 'Quality', target: 1, unit: '%', freq: 'monthly', higher: false, warning: 0.5, critical: 1, owner: 'Ahmad' },
  ];
  const sel = kpis.find(k => k.id === selected);
  return (
    <div><PageHeader title="KPI Library" description="Manage KPIs" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add KPI</button>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><DataTable columns={[{ key: 'name', label: 'KPI', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'code', label: 'Code' }, { key: 'target', label: 'Target', render: (i: any) => `${i.target}${i.unit}` }]} data={kpis} onRowClick={(i) => setSelected(i.id)} /></div>
        <div className="lg:col-span-2">
          {sel ? <div className="space-y-4">
            <Card><CardHeader><CardTitle>{sel.name}</CardTitle></CardHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">Code</p><p className="text-sm font-medium font-mono">{sel.code}</p></div>
                <div><p className="text-xs text-gray-500">Category</p><p className="text-sm font-medium">{sel.category}</p></div>
                <div><p className="text-xs text-gray-500">Unit</p><p className="text-sm font-medium">{sel.unit}</p></div>
                <div><p className="text-xs text-gray-500">Target</p><p className="text-sm font-medium">{sel.target}{sel.unit}</p></div>
                <div><p className="text-xs text-gray-500">Frequency</p><p className="text-sm font-medium capitalize">{sel.freq}</p></div>
                <div><p className="text-xs text-gray-500">Direction</p><p className="text-sm font-medium flex items-center gap-1">{sel.higher ? <><TrendingUp className="w-4 h-4 text-green-500" /> Higher Better</> : <><TrendingDown className="w-4 h-4 text-red-500" /> Lower Better</>}</p></div>
              </div>
            </Card>
            <Card><CardHeader><CardTitle>Thresholds</CardTitle></CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"><p className="text-sm font-medium text-yellow-800">Warning</p><p className="text-2xl font-bold text-yellow-600 mt-1">{sel.warning}{sel.unit}</p></div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200"><p className="text-sm font-medium text-red-800">Critical</p><p className="text-2xl font-bold text-red-600 mt-1">{sel.critical}{sel.unit}</p></div>
              </div>
            </Card>
          </div> : <div className="flex items-center justify-center h-64 text-gray-400"><p>Select a KPI to view details</p></div>}
        </div>
      </div>
    </div>
  );
}
