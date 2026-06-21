import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { Settings, Globe, Bell, Database } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/settings/')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">System configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" /> General
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between"><span>Default Language</span> <span className="font-medium">English</span></div>
              <div className="flex justify-between"><span>Timezone</span> <span className="font-medium">Asia/Riyadh</span></div>
              <button className="mt-2 px-4 py-2 border rounded-lg text-sm">Edit</button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" /> Notifications
              </CardTitle>
            </CardHeader>
            <div className="p-6 text-sm space-y-3">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Email notifications</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Diagnostic alerts</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Weekly reports</label>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" /> Data Retention
              </CardTitle>
            </CardHeader>
            <div className="p-6 text-sm">
              <div>Audit logs retained for: <span className="font-medium">1 year</span></div>
              <div>Diagnostic data retained for: <span className="font-medium">5 years</span></div>
              <button className="mt-4 px-4 py-2 border rounded-lg text-sm">Update Policy</button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> Feature Flags
              </CardTitle>
            </CardHeader>
            <div className="p-6 text-sm space-y-3">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> AI Insights</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Advanced Analytics</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> White-label Mode</label>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}