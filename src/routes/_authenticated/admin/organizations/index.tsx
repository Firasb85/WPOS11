import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { Building2, Plus, Users } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/organizations/')({
  component: OrganizationsPage,
});

function OrganizationsPage() {
  // Mock data
  const organizations = [
    { id: '1', name: 'WPOS Technologies', type: 'Enterprise', users: 87, departments: 12, status: 'active' },
    { id: '2', name: 'WPOS Saudi', type: 'Subsidiary', users: 24, departments: 5, status: 'active' },
    { id: '3', name: 'WPOS Egypt', type: 'Subsidiary', users: 13, departments: 4, status: 'active' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-gray-500 mt-1">Manage companies and subsidiaries</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <Card key={org.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.type}</p>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">Active</span>
              </div>

              <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{org.users} users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{org.departments} depts</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <button className="text-sm text-blue-600 hover:underline">Manage</button>
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}