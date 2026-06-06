import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, UserCircle } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/organization/employees')({ component: EmployeesPage });
function EmployeesPage() {
  const data = [
    { id: '1', code: 'EMP001', firstName: 'Ahmad', lastName: 'Khalid', job: 'Senior Analyst', dept: 'Operations', team: 'Alpha', status: 'active' },
    { id: '2', code: 'EMP002', firstName: 'Layla', lastName: 'Ibrahim', job: 'Analyst', dept: 'Operations', team: 'Beta', status: 'active' },
    { id: '3', code: 'EMP003', firstName: 'Omar', lastName: 'Hassan', job: 'Junior Analyst', dept: 'Operations', team: 'Alpha', status: 'probation' },
  ];
  return (
    <div><PageHeader title="Employees" description="Manage employees" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Employee</button>} />
      <DataTable columns={[
        { key: 'code', label: 'Code', render: (i: any) => <span className="font-mono text-xs text-gray-500">{i.code}</span> },
        { key: 'name', label: 'Name', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><UserCircle className="w-8 h-8 text-gray-400" /><span className="font-medium">{i.firstName} {i.lastName}</span></div> },
        { key: 'job', label: 'Position' },
        { key: 'dept', label: 'Department' },
        { key: 'team', label: 'Team' },
        { key: 'status', label: 'Status', render: (i: any) => <StatusBadge status={i.status} /> },
      ]} data={data} />
    </div>
  );
}
