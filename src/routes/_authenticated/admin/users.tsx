import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, Shield, Clock } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/admin/users')({ component: UserManagementPage });
function UserManagementPage() {
  const users = [
    { id: '1', email: 'ahmad@acme.com', firstName: 'Ahmad', lastName: 'Ali', role: 'Super Admin', status: 'active', lastLogin: '2026-06-06 10:30' },
    { id: '2', email: 'khaled@acme.com', firstName: 'Khalid', lastName: 'Al-Saud', role: 'Dept Manager', status: 'active', lastLogin: '2026-06-05 14:15' },
    { id: '3', email: 'nora@acme.com', firstName: 'Nora', lastName: 'Al-Faisal', role: 'HR Director', status: 'active', lastLogin: '2026-06-06 09:00' },
  ];
  return (
    <div><PageHeader title="User Management" description="Manage system users" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add User</button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total Users', count: 12 }, { label: 'Active', count: 12, color: 'text-green-600' }, { label: 'Roles', count: 7, color: 'text-blue-600' }].map(s => (
          <Card key={s.label}><div className="text-center"><p className={`text-2xl font-bold ${s.color || 'text-gray-900'}`}>{s.count}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></div></Card>
        ))}
      </div>
      <DataTable columns={[
        { key: 'name', label: 'User', sortable: true, render: (i: any) => <div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-white text-sm font-medium">{(i.firstName[0]+i.lastName[0])}</span></div><div><p className="text-sm font-medium">{i.firstName} {i.lastName}</p><p className="text-xs text-gray-500">{i.email}</p></div></div> },
        { key: 'role', label: 'Role', render: (i: any) => <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gray-400" /><span>{i.role}</span></div> },
        { key: 'status', label: 'Status', render: (i: any) => <StatusBadge status={i.status} /> },
        { key: 'lastLogin', label: 'Last Login', render: (i: any) => <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /><span className="text-xs text-gray-500">{i.lastLogin}</span></div> },
      ]} data={users} />
    </div>
  );
}
