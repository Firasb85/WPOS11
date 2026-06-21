import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { Card } from '~/components/wpos/Card';
import { FileText, Download } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/audit/')({
  component: AuditLogPage,
});

function AuditLogPage() {
  const logs = [
    { id: '1', action: 'User created', user: 'admin@wpos.com', timestamp: '2026-06-21 14:32', ip: '192.168.1.45' },
    { id: '2', action: 'Diagnostic approved', user: 'manager@wpos.com', timestamp: '2026-06-21 13:15', ip: '192.168.1.67' },
    { id: '3', action: 'KPI updated', user: 'fatima@wpos.com', timestamp: '2026-06-21 11:04', ip: '192.168.1.22' },
    { id: '4', action: 'User role changed', user: 'admin@wpos.com', timestamp: '2026-06-20 16:45', ip: '192.168.1.45' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audit Log</h1>
            <p className="text-gray-500">System activity and security events</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Timestamp</th>
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs text-gray-500">{log.timestamp}</td>
                    <td className="p-4">{log.action}</td>
                    <td className="p-4 text-gray-600">{log.user}</td>
                    <td className="p-4 font-mono text-xs">{log.ip}</td>
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