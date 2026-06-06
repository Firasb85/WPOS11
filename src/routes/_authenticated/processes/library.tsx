import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, GitMerge, AlertTriangle, UserCircle } from 'lucide-react';
import { useState } from 'react';
export const Route = createFileRoute('/_authenticated/processes/library')({ component: ProcessLibraryPage });
function ProcessLibraryPage() {
  const [selected, setSelected] = useState<string | null>('1');
  const processes = [
    { id: '1', name: 'Employee Onboarding', code: 'HR-ONB-001', owner: 'Nora Al-Faisal', dept: 'HR', risk: 'medium', criticality: 'high',
      steps: [{ step: 1, name: 'Document Collection', duration: '2h', tools: ['HR System'], errors: ['Missing docs'] }, { step: 2, name: 'Account Setup', duration: '4h', tools: ['AD'], errors: ['Duplicates'] }, { step: 3, name: 'Orientation', duration: '1d', tools: ['Materials'], errors: ['Scheduling'] }] },
    { id: '2', name: 'Quarterly Review', code: 'HR-PRF-002', owner: 'Khalid Al-Saud', dept: 'Operations', risk: 'low', criticality: 'medium',
      steps: [{ step: 1, name: 'Collect KPI Data', duration: '3d', tools: ['WPOS'], errors: ['Inconsistency'] }] },
    { id: '3', name: 'Invoice Processing', code: 'FIN-INV-001', owner: 'Fahad Al-Otaibi', dept: 'Finance', risk: 'high', criticality: 'critical',
      steps: [{ step: 1, name: 'Invoice Receipt', duration: '1h', tools: ['Email'], errors: ['Lost'] }, { step: 2, name: 'Verification', duration: '2h', tools: ['ERP'], errors: ['Mismatch'] }] },
  ];
  const sel = processes.find(p => p.id === selected);
  return (
    <div><PageHeader title="Process Library" description="Manage business processes" actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />Add Process</button>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">{[...processes].reverse().map(p => (
          <div key={p.id} className={`p-4 rounded-xl border cursor-pointer ${selected === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`} onClick={() => setSelected(p.id)}>
            <div className="flex items-center gap-2 mb-1"><GitMerge className="w-4 h-4 text-blue-600" /><h3 className="font-medium text-sm">{p.name}</h3></div>
            <p className="text-xs text-gray-500 font-mono mb-2">{p.code}</p>
            <p className="text-xs text-gray-500 mb-2"><UserCircle className="w-3 h-3 inline mr-1" />{p.owner}</p>
            <div className="flex gap-2"><StatusBadge status={p.risk === 'critical' ? 'red' : p.risk === 'high' ? 'yellow' : 'green'} size="sm" label={p.risk} /><StatusBadge status={p.criticality === 'critical' ? 'red' : 'yellow'} size="sm" label={p.criticality} /></div>
          </div>
        ))}</div>
        <div className="lg:col-span-2">
          {sel ? <Card><CardHeader><CardTitle>Process Steps</CardTitle></CardHeader>
            <div className="space-y-4">{sel.steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-sm font-bold text-blue-600">{s.step}</span></div>
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2"><h4 className="font-medium text-sm">{s.name}</h4><span className="text-xs text-gray-400">{s.duration}</span></div>
                  <div className="mb-2"><p className="text-xs text-gray-500 mb-1">Tools:</p><div className="flex flex-wrap gap-1">{s.tools.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}</div></div>
                  <div><p className="text-xs text-red-500 mb-1"><AlertTriangle className="w-3 h-3 inline mr-0.5" />Errors:</p><div className="flex flex-wrap gap-1">{s.errors.map(e => <span key={e} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs">{e}</span>)}</div></div>
                </div>
              </div>
            ))}</Card> : <div className="flex items-center justify-center h-64 text-gray-400"><p>Select a process to view details</p></div>}
        </div>
      </div>
    </div>
  );
}
