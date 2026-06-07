import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, Briefcase } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/jobs/list')({ component: JobsListPage });
function JobsListPage() {
  const data = [
    { id: '1', title: 'Senior Operations Analyst', employee: 'Ahmad Khalid', dept: 'Operations', status: 'active' },
    { id: '2', title: 'Operations Analyst', employee: 'Layla Ibrahim', dept: 'Operations', status: 'active' },
    { id: '3', title: 'Junior Analyst', employee: 'Omar Hassan', dept: 'Operations', status: 'active' },
  ];
  return (
    <div><PageHeader title="Jobs" description="Manage job positions" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Job</button>} />
      <DataTable columns={[{ key: 'title', label: 'Title', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.title}</span></div> }, { key: 'employee', label: 'Employee' }, { key: 'dept', label: 'Department' }, { key: 'status', label: 'Status', render: (i: any) => <StatusBadge status={i.status} /> }]} data={data} />
    </div>
  );
}
