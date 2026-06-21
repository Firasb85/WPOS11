import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card } from '~/components/wpos/Card';
import { Building2, Plus, Users } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/departments/')({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const departments = [
    { id: '1', name: 'Sales', org: 'WPOS Technologies', users: 32, manager: 'Ahmed Hassan' },
    { id: '2', name: 'Operations', org: 'WPOS Technologies', users: 28, manager: 'Fatima Al-Khater' },
    { id: '3', name: 'IT', org: 'WPOS Technologies', users: 15, manager: 'Omar Khalid' },
    { id: '4', name: 'HR', org: 'WPOS Saudi', users: 8, manager: 'Sara Al-Mansouri' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-gray-500">Manage department structure and assignments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Organization</th>
                  <th className="text-left p-4">Manager</th>
                  <th className="text-left p-4">Users</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium">{dept.name}</td>
                    <td className="p-4 text-gray-600">{dept.org}</td>
                    <td className="p-4">{dept.manager}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4" /> {dept.users}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:underline text-sm mr-3">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}