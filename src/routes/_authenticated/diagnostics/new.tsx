import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Stethoscope, X } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/diagnostics/new')({ component: NewDiagnosticPage });
function NewDiagnosticPage() {
  return (
    <div><PageHeader title="New Diagnostic Report" description="Generate evidence-based diagnostic" />
      <div className="max-w-2xl"><Card>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Employee *</label><select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"><option>Select employee</option><option>Ahmad Khalid</option><option>Layla Ibrahim</option></select></div>
          <div><label className="block text-sm font-medium mb-1.5">Report Title *</label><input className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm" placeholder="e.g., Efficiency Decline Analysis" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Performance Summary</label><textarea className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm min-h-[100px]" placeholder="Describe the performance situation..." /></div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3"><Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
              <div><p className="text-sm font-medium text-blue-800 mb-1">Diagnostic Engine</p><p className="text-xs text-blue-700">The system will analyze available data and generate hypotheses with confidence scores, supporting/contradicting evidence, and recommended validation actions.</p></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"><X className="w-4 h-4" />Cancel</button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Stethoscope className="w-4 h-4" />Run Diagnostic</button>
        </div>
      </Card></div>
    </div>
  );
}
