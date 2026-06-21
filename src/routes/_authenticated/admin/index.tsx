import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { useLanguage } from '@/lib/wpos/context/LanguageContext';
import {
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { t } = useLanguage();

  const stats = {
    totalUsers: 124,
    activeDiagnostics: 18,
    pendingApprovals: 7,
    systemHealth: 98,
  };

  const recentActivity = [
    { id: 1, action: 'Diagnostic approved', user: 'Sarah M.', time: '2m ago' },
    { id: 2, action: 'New user registered', user: 'Omar K.', time: '15m ago' },
    { id: 3, action: 'KPI updated', user: 'Fatima A.', time: '1h ago' },
    { id: 4, action: 'Report exported', user: 'Ahmed H.', time: '3h ago' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            System overview and quick actions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Diagnostics</p>
                <p className="text-3xl font-bold mt-1">{stats.activeDiagnostics}</p>
              </div>
              <Target className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold mt-1 text-amber-600">{stats.pendingApprovals}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">System Health</p>
                <p className="text-3xl font-bold mt-1 text-emerald-600">{stats.systemHealth}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <Users className="w-5 h-5 mb-2" />
              <div className="font-medium">Add New User</div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <Target className="w-5 h-5 mb-2" />
              <div className="font-medium">Create KPI</div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <AlertTriangle className="w-5 h-5 mb-2" />
              <div className="font-medium">Review Pending</div>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <BarChart3 className="w-5 h-5 mb-2" />
              <div className="font-medium">View Reports</div>
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{item.action}</div>
                    <div className="text-xs text-gray-500">{item.user}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Response Time</span>
                <span className="font-mono text-sm">124ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Background Jobs</span>
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">4 running</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}