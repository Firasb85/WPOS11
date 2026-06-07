import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, Building } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/organization/companies')({ component: CompaniesPage });
function CompaniesPage() {
  const data = [{ id: '1', name: 'Acme Corporation', legalName: 'Acme Corp Ltd', city: 'Riyadh', isActive: true }, { id: '2', name: 'TechVision Inc', legalName: 'TechVision Inc', city: 'Jeddah', isActive: true }];
  return (
    <div><PageHeader title="Companies" description="Manage companies" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Company</button>} />
      <DataTable columns={[{ key: 'name', label: 'Name', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'legalName', label: 'Legal Name' }, { key: 'city', label: 'City' }, { key: 'isActive', label: 'Status', render: (i: any) => <StatusBadge status={i.isActive ? 'active' : 'inactive'} /> }]} data={data} />
    </div>
  );
}
