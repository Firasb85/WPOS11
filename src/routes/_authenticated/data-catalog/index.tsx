import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card,CardHeader,CardTitle } from '~/components/wpos/Card';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { BookOpen,Database,User,RefreshCw,BarChart3,Search } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/data-catalog/')({ component: DataCatalogPage });
function DataCatalogPage() {
  const l='ar';
  const entries=[{code:'DC-EMP',nE:'Employee Master',nA:'بيانات الموظفين الأساسية',type:'master_data',src:'HR System',owner:'HR Dept',qs:95,rs:'Daily',st:true},{code:'DC-KPI',nE:'KPI Repository',nA:'مستودع المؤشرات',type:'metrics',src:'WPOS',owner:'Operations',qs:90,rs:'Real-time',st:true},{code:'DC-PROC',nE:'Process Library',nA:'مكتبة العمليات',type:'process',src:'WPOS',owner:'Operations',qs:88,rs:'On change',st:true},{code:'DC-EVI',nE:'Evidence Store',nA:'مخزن الأدلة',type:'evidence',src:'WPOS + Systems',owner:'Quality',qs:85,rs:'Real-time',st:true},{code:'DC-DIAG',nE:'Diagnostic Reports',nA:'تقارير التشخيص',type:'analytics',src:'WPOS Engine',owner:'Analytics',qs:82,rs:'On demand',st:true}];
  return (<div>
    <PageHeader title="Enterprise Data Catalog" titleAr="كتالوج البيانات المؤسسي" description="Metadata repository for all WPOS data entities" descriptionAr="مستودع البيانات الوصفية لجميع كيانات بيانات WPOS" currentLang={l} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="text-center"><Database className="w-5 h-5 text-blue-600 mx-auto mb-2"/><p className="text-2xl font-bold">5</p><p className="text-xs text-gray-500">{l==='ar'?'كيانات':'Entities'}</p></Card>
      <Card className="text-center"><BarChart3 className="w-5 h-5 text-green-600 mx-auto mb-2"/><p className="text-2xl font-bold">88%</p><p className="text-xs text-gray-500">{l==='ar'?'متوسط الجودة':'Avg Quality'}</p></Card>
      <Card className="text-center"><RefreshCw className="w-5 h-5 text-purple-600 mx-auto mb-2"/><p className="text-2xl font-bold">3</p><p className="text-xs text-gray-500">{l==='ar'?'مصادر':'Sources'}</p></Card>
      <Card className="text-center"><Search className="w-5 h-5 text-orange-600 mx-auto mb-2"/><p className="text-2xl font-bold">5</p><p className="text-xs text-gray-500">{l==='ar'?'ملاك':'Owners'}</p></Card>
    </div>
    <Card><table className="w-full"><thead><tr className="border-b border-gray-200"><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">{l==='ar'?'الكيان':'Entity'}</th><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">{l==='ar'?'النوع':'Type'}</th><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">{l==='ar'?'المصدر':'Source'}</th><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">{l==='ar'?'المالك':'Owner'}</th><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">{l==='ar'?'الجودة':'Quality'}</th><th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">{l==='ar'?'التحديث':'Refresh'}</th></tr></thead>
      <tbody className="divide-y divide-gray-200">{entries.map((e,i)=><tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3"><div><p className="text-sm font-medium">{l==='ar'?e.nA:e.nE}</p><p className="text-xs text-gray-400 font-mono">{e.code}</p></div></td><td className="px-4 py-3 text-sm capitalize">{e.type.replace('_',' ')}</td><td className="px-4 py-3 text-sm">{e.src}</td><td className="px-4 py-3 text-sm">{e.owner}</td><td className="px-4 py-3 text-center"><div className="inline-flex items-center gap-1.5"><div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${e.qs>=90?'bg-green-500':e.qs>=80?'bg-yellow-500':'bg-red-500'}`} style={{width:`${e.qs}%`}}/></div><span className="text-xs font-medium">{e.qs}%</span></div></td><td className="px-4 py-3 text-sm text-gray-500">{e.rs}</td></tr>)}</tbody></table></Card>
  </div>);
}
