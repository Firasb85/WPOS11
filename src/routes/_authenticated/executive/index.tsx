import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card,CardHeader,CardTitle } from '~/components/wpos/Card';
import { StatsCard } from '~/components/wpos/StatsCard';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { BarChart3,TrendingUp,AlertTriangle,Building2,Target,Activity,ArrowUp,ArrowDown,Minus } from 'lucide-react';
export const Route = createFileRoute('/_authenticated/executive/')({ component: ExecutivePage });
function ExecutivePage() {
  const l='ar';
  const rootCauses=[{cat:'skill_gap',la:'Skill Gap',laA:'فجوة مهارية',c:12,p:28},{cat:'process_issue',la:'Process Issue',laA:'مشكلة إجرائية',c:10,p:23},{cat:'knowledge_gap',la:'Knowledge Gap',laA:'فجوة معرفية',c:7,p:16},{cat:'tool_issue',la:'Tool Issue',laA:'مشكلة أدوات',c:5,p:12},{cat:'motivation',la:'Motivation',laA:'تحفيز',c:4,p:9},{cat:'leadership',la:'Leadership',laA:'قيادة',c:2,p:5}];
  const interventions=[{n:'One-on-One Coaching',nA:'تدريب فردي',sr:92,ca:15},{n:'System Upgrade',nA:'ترقية النظام',sr:95,ca:3},{n:'Career Mentoring',nA:'إرشاد وظيفي',sr:88,ca:10},{n:'Technical Training',nA:'تدريب تقني',sr:85,ca:12},{n:'Process Redesign',nA:'إعادة تصميم',sr:72,ca:5}];
  const recovery=[{m:'Jan',r:5,t:12,rt:42},{m:'Feb',r:6,t:14,rt:43},{m:'Mar',r:8,t:15,rt:53},{m:'Apr',r:7,t:13,rt:54},{m:'May',r:10,t:14,rt:71},{m:'Jun',r:9,t:11,rt:82}];
  return (<div>
    <PageHeader title="Executive Analytics" titleAr="تحليلات تنفيذية" description="Organization-wide performance intelligence" descriptionAr="ذكاء أداء على مستوى المؤسسة" currentLang={l} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatsCard title="Active Cases" titleAr="حالات نشطة" value="9" icon={<Activity />} currentLang={l} />
      <StatsCard title="Recovery Rate" titleAr="معدل التعافي" value="82%" change={11} icon={<TrendingUp />} status="good" currentLang={l} />
      <StatsCard title="Depts at Risk" titleAr="إدارات معرضة" value="2" icon={<Building2 />} status="critical" currentLang={l} />
      <StatsCard title="Top Root Cause" titleAr="السبب الأعلى" value={l==='ar'?'فجوة مهارية':'Skill Gap'} icon={<Target />} currentLang={l} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card><CardHeader><CardTitle><AlertTriangle className="w-4 h-4 inline mr-1" />{l==='ar'?'الأسباب الجذرية':'Root Causes'}</CardTitle></CardHeader>
        <div className="space-y-2">{rootCauses.map((rc,i)=><div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"><span className="text-xs text-gray-400 w-5">{i+1}</span>
          <div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{l==='ar'?rc.laA:rc.la}</span><span className="text-sm font-bold">{rc.c} ({rc.p}%)</span></div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width:`${rc.p}%`}}/></div></div></div>)}</div>
      </Card>
      <Card><CardHeader><CardTitle><Target className="w-4 h-4 inline mr-1" />{l==='ar'?'التدخلات الأكثر فعالية':'Most Effective Interventions'}</CardTitle></CardHeader>
        <div className="space-y-2">{interventions.map((iv,i)=><div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <span className="text-sm font-medium">{l==='ar'?iv.nA:iv.n}</span><div className="flex items-center gap-2"><span className="text-lg font-bold text-green-600">{iv.sr}%</span><span className="text-xs text-gray-400">{iv.ca}c</span></div></div>)}</div>
      </Card>
      <Card><CardHeader><CardTitle><TrendingUp className="w-4 h-4 inline mr-1" />{l==='ar'?'معدلات التعافي':'Recovery Rates'}</CardTitle></CardHeader>
        <div className="space-y-2">{recovery.map((r,i)=><div key={i} className="flex items-center gap-3"><span className="text-xs text-gray-500 w-8">{r.m}</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600" style={{width:`${r.rt}%`}}/></div>
          <span className="text-sm font-bold w-14 text-right">{r.rt}%</span><span className="text-xs text-gray-400">({r.r}/{r.t})</span></div>)}</div>
      </Card>
    </div>
  </div>);
}
