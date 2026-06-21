import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/security/')({
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-gray-500">Security settings and access control</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" /> API Keys
              </CardTitle>
            </CardHeader>
            <div className="p-6">
              <p className="text-sm text-gray-600">Manage API access keys for integrations.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Generate New Key</button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Password Policy
              </CardTitle>
            </CardHeader>
            <div className="p-6 text-sm space-y-2">
              <div>✓ Minimum 8 characters</div>
              <div>✓ Require uppercase &amp; number</div>
              <div>✓ Password expires every 90 days</div>
              <button className="mt-4 px-4 py-2 border rounded-lg text-sm">Update Policy</button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Role Permissions
              </CardTitle>
            </CardHeader>
            <div className="p-6">
              <p className="text-sm text-gray-600">Configure role-based access control.</p>
              <button className="mt-4 px-4 py-2 border rounded-lg text-sm">Manage Roles</button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Security Alerts
              </CardTitle>
            </CardHeader>
            <div className="p-6 text-sm text-gray-600">
              No recent security alerts.
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}