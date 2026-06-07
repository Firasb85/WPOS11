import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, Building2 } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/organization/departments')({ component: DepartmentsPage });
function DepartmentsPage() {
  const data = [{ id: '1', name: 'Operations', branch: 'Riyadh HQ', manager: 'Khalid Al-Saud', isActive: true }, { id: '2', name: 'Human Resources', branch: 'Riyadh HQ', manager: 'Nora Al-Faisal', isActive: true }, { id: '3', name: 'Finance', branch: 'Jeddah Branch', manager: 'Fahad Al-Otaibi', isActive: true }];
  return (
    <div><PageHeader title="Departments" description="Manage departments" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Department</button>} />
      <DataTable columns={[{ key: 'name', label: 'Name', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'branch', label: 'Branch' }, { key: 'manager', label: 'Manager' }, { key: 'isActive', label: 'Status', render: (i: any) => <StatusBadge status={i.isActive ? 'active' : 'inactive'} /> }]} data={data} />
    </div>
  );
}
