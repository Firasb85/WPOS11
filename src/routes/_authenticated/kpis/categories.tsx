import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { Plus, Tags } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/kpis/categories')({ component: KpiCategoriesPage });
function KpiCategoriesPage() {
  const data = [{ id: '1', name: 'Productivity', code: 'PROD', desc: 'Productivity metrics' }, { id: '2', name: 'Quality', code: 'QUAL', desc: 'Quality metrics' }, { id: '3', name: 'Efficiency', code: 'EFF', desc: 'Efficiency metrics' }, { id: '4', name: 'Customer', code: 'CUST', desc: 'Customer metrics' }, { id: '5', name: 'Financial', code: 'FIN', desc: 'Financial metrics' }];
  return (
    <div><PageHeader title="KPI Categories" description="Manage KPI categories" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Category</button>} />
      <DataTable columns={[{ key: 'name', label: 'Category', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Tags className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'code', label: 'Code', render: (i: any) => <span className="font-mono text-xs text-gray-500">{i.code}</span> }, { key: 'desc', label: 'Description' }]} data={data} />
    </div>
  );
}
