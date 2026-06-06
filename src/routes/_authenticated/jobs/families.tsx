import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { Plus, FolderTree } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/jobs/families')({ component: JobFamiliesPage });
function JobFamiliesPage() {
  const data = [{ id: '1', name: 'Engineering', code: 'ENG', desc: 'Engineering roles' }, { id: '2', name: 'Finance & Accounting', code: 'FIN', desc: 'Finance roles' }, { id: '3', name: 'Human Resources', code: 'HR', desc: 'HR roles' }];
  return (
    <div><PageHeader title="Job Families" description="Manage job families" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Family</button>} />
      <DataTable columns={[{ key: 'name', label: 'Family', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><FolderTree className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'code', label: 'Code', render: (i: any) => <span className="font-mono text-xs text-gray-500">{i.code}</span> }, { key: 'desc', label: 'Description' }]} data={data} />
    </div>
  );
}
