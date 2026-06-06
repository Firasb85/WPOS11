import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { Plus, Layers } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/jobs/grades')({ component: JobGradesPage });
function JobGradesPage() {
  const data = [{ id: '1', name: 'Executive', code: 'EXEC', level: 1, min: 50000, max: 100000 }, { id: '2', name: 'Director', code: 'DIR', level: 2, min: 30000, max: 50000 }, { id: '3', name: 'Manager', code: 'MGR', level: 3, min: 20000, max: 35000 }, { id: '4', name: 'Senior', code: 'SR', level: 4, min: 12000, max: 22000 }, { id: '5', name: 'Junior', code: 'JR', level: 5, min: 5000, max: 13000 }];
  return (
    <div><PageHeader title="Job Grades" description="Manage job grades" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Grade</button>} />
      <DataTable columns={[{ key: 'name', label: 'Grade', sortable: true, render: (i: any) => <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-gray-400" /><span className="font-medium">{i.name}</span></div> }, { key: 'code', label: 'Code' }, { key: 'level', label: 'Level', sortable: true }, { key: 'min', label: 'Min Salary', render: (i: any) => `$${(i.min).toLocaleString()}` }, { key: 'max', label: 'Max Salary', render: (i: any) => `$${(i.max).toLocaleString()}` }]} data={data} />
    </div>
  );
}
