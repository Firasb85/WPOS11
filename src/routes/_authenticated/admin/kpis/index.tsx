import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card } from '~/components/wpos/Card';
import { Target, Plus, Download } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/kpis/')({
  component: KPILibraryPage,
});

function KPILibraryPage() {
  const kpis = [
    { id: '1', name: 'Sales Revenue', category: 'Sales', target: 500000, unit: 'SAR', status: 'active' },
    { id: '2', name: 'Customer Retention', category: 'Customer', target: 85, unit: '%', status: 'active' },
    { id: '3', name: 'Employee Satisfaction', category: 'HR', target: 4.5, unit: '/5', status: 'active' },
    { id: '4', name: 'On-time Delivery', category: 'Operations', target: 95, unit: '%', status: 'active' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">KPI Library</h1>
            <p className="text-gray-500">Manage organization-wide performance indicators</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Add KPI
            </button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">KPI Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Target</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{kpi.name}</td>
                    <td className="p-4 text-gray-600">{kpi.category}</td>
                    <td className="p-4 font-mono">{kpi.target} {kpi.unit}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">Active</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
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