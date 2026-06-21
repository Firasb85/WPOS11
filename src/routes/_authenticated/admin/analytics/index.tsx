import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/analytics/')({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">System-wide performance insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Diagnostics</p>
                <p className="text-3xl font-bold">1,284</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Resolution Time</p>
                <p className="text-3xl font-bold">14d</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-3xl font-bold">87</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">System Uptime</p>
                <p className="text-3xl font-bold">99.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostics Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <div className="p-6 h-64 flex items-center justify-center text-gray-400">
              [Chart: Diagnostics created over time]
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Root Cause Distribution</CardTitle>
            </CardHeader>
            <div className="p-6 h-64 flex items-center justify-center text-gray-400">
              [Chart: Pie chart of root causes]
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}