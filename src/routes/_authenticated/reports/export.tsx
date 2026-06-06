import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/reports/export')({ component: ExportPage });
function ExportPage() {
  return (
    <div><PageHeader title="Export Reports" description="Export diagnostic and performance reports" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card><CardHeader><CardTitle>Report Criteria</CardTitle></CardHeader>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5">Report Type</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" defaultValue="diagnostic"><option value="diagnostic">Diagnostic Report</option><option value="performance">Performance Summary</option><option value="kpi">KPI Report</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5">Period</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" defaultValue="2026-06"><option value="2026-06">June 2026</option><option value="2026-Q2">Q2 2026</option></select></div>
            <div><label className="block text-sm font-medium mb-1.5">Department</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" defaultValue="all"><option value="all">All Departments</option><option value="ops">Operations</option><option value="hr">HR</option></select></div>
          </div>
        </Card>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border"><h3 className="text-sm font-semibold mb-3">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"><FileText className="w-8 h-8 text-red-500" /><span className="text-xs font-medium">PDF</span></button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"><FileSpreadsheet className="w-8 h-8 text-green-500" /><span className="text-xs font-medium">Excel</span></button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"><Printer className="w-8 h-8 text-gray-500" /><span className="text-xs font-medium">Print</span></button>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium"><Download className="w-4 h-4" />Export Report</button>
        </div>
      </div>
    </div>
  );
}
