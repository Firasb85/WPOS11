import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { Save, X } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/snapshots/new')({ component: NewSnapshotPage });
function NewSnapshotPage() {
  return (
    <div><PageHeader title="Record Snapshot" description="Record actual performance results" />
      <div className="max-w-2xl">
        <Card>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5">Employee *</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm"><option>Select employee</option><option>Ahmad Khalid</option><option>Layla Ibrahim</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5">KPI *</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm"><option>Select KPI</option><option>Production Efficiency</option><option>Customer Satisfaction</option></select></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Period *</label><input type="month" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" /></div><div><label className="block text-sm font-medium mb-1.5">Target *</label><input type="number" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" /></div></div>
            <div><label className="block text-sm font-medium mb-1.5">Actual *</label><input type="number" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Notes</label><textarea className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm min-h-[80px]" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t"><button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"><X className="w-4 h-4" />Cancel</button><button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><Save className="w-4 h-4" />Save Snapshot</button></div>
        </Card>
      </div>
    </div>
  );
}
