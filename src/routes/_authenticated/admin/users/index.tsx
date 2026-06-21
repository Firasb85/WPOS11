import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card } from '~/components/wpos/Card';
import { useLanguage } from '@/lib/wpos/context/LanguageContext';
import { Users, Plus, Download, Upload } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: UserManagementPage,
});

function UserManagementPage() {
  const { t } = useLanguage();

  // Mock data — will be replaced with real hook later
  const users = [
    { id: '1', name: 'Ahmed Hassan', email: 'ahmed@wpos.com', role: 'MANAGER', status: 'active', department: 'Sales' },
    { id: '2', name: 'Fatima Al-Khater', email: 'fatima@wpos.com', role: 'USER', status: 'active', department: 'Operations' },
    { id: '3', name: 'Omar Khalid', email: 'omar@wpos.com', role: 'ADMIN', status: 'active', department: 'IT' },
    { id: '4', name: 'Sara Al-Mansouri', email: 'sara@wpos.com', role: 'USER', status: 'inactive', department: 'HR' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500 mt-1">Manage users, roles, and permissions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div>
              <p className="text-sm text-gray-500">Managers</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'MANAGER').length}</p>
            </div>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-500">User</th>
                  <th className="text-left p-4 font-medium text-gray-500">Role</th>
                  <th className="text-left p-4 font-medium text-gray-500">Department</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.department}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button className="ml-3 text-red-600 hover:underline text-sm">Delete</button>
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