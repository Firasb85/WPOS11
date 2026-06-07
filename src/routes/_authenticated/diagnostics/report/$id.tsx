import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card,CardHeader,CardTitle } from '~/components/wpos/Card';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { MaturityBadge } from '~/components/wpos/MaturityBadge';
import { FormSelect,FormTextarea } from '~/components/wpos/FormInput';
import { useState } from 'react';
import { Stethoscope,FileSearch,AlertTriangle,CheckCircle,XCircle,ArrowRight,Lightbulb,GitBranch,UserCheck,Clock,ThumbsUp,ThumbsDown,Edit3,Save,Download } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/diagnostics/report/$id')({ component: DiagnosticReportDetailPage });

function DiagnosticReportDetailPage() {
  const l='ar';
  const [tab,setTab]=useState<'hypotheses'|'evidence'|'contradictions'|'review'>('hypotheses');
  const [rv,setRv]=useState<Record<string,{d:string;c:string}>>({});

  const report={
    title:'Ahmad Khalid — Production Efficiency Decline',
    titleAr:'أحمد خالد — انخفاض كفاءة الإنتاج',
    employee:'Ahmad Khalid', employeeAr:'أحمد خالد',
    department:'Operations', deptAr:'العمليات', date:'2026-06-04',
    status:'draft' as const, maturity:4, confidence:82, evidenceScore:78, evidenceStrengthIndex:73,
    summary:'Production efficiency dropped from 85% to 78% over 30 days. Quality metrics remain stable at 94%.',
    summaryAr:'انخفضت كفاءة الإنتاج من 85٪ إلى 78٪ خلال 30 يوماً. بقيت الجودة مستقرة عند 94٪.',
    hyps:[
      {id:'h1',rank:1,label:'Diagnostic Insight',cat:'skill_gap',catAr:'فجوة مهارية',txt:'Employee lacks required proficiency in Data Analysis (Level 2/4)',txtAr:'يفتقر الموظف إلى الكفاءة المطلوبة في تحليل البيانات',conf:84,evid:['Production efficiency dropped 7%','No training in 6 months','Errors up 40%'],contra:['Quality stable at 94%','3+ years experience'],acts:['Schedule Data Analysis training','Pair with Senior Analyst','Reassess in 90 days'],rsn:'The competency gap correlates with declining production metrics.'},
      {id:'h2',rank:2,label:'Evidence-Based Observation',cat:'process_issue',catAr:'مشكلة إجرائية',txt:'New workflow may have created bottlenecks',txtAr:'سير العمل الجديد قد خلق اختناقات',conf:68,evid:['Process change coincided with drop','Similar in 2 other team members'],contra:['Others adapted successfully'],acts:['Review new workflow','Conduct time-motion analysis'],rsn:'Timing aligns but individual variation suggests multiple factors.'},
    ],
    contras:[
      {d:l==='ar'?'جودة عالية (94٪) + كفاءة منخفضة (78٪)':'High Quality (94%) + Low Efficiency (78%)',s:'high',e:l==='ar'?'يشير إلى اختناق إجرائي وليس فجوة':'Process bottleneck, not skill gap'},
      {d:l==='ar'?'خبرة 3+ سنوات + أداء متراجع':'3+ years exp + declining perf',s:'high',e:l==='ar'?'عوامل بيئية أو إجرائية':'Environmental/process factors'},
    ],
    evidItems:[
      {src:'KPI Report May 2026',t:'quantitative',rl:92,v:true,desc:'Production efficiency: 78% (target 90%)'},
      {src:'Training Records',t:'system_generated',rl:95,v:true,desc:'Last training: Nov 2025'},
      {src:'Supervisor Review',t:'qualitative',rl:60,v:false,desc:'Increased error rate noted'},
      {src:'Quality Audit Q2',t:'quantitative',rl:88,v:true,desc:'Quality score: 94% — stable'},
    ],
  };

  const catLabels:Record<string,{en:string;ar:string}>={skill_gap:{en:'Skill Gap',ar:'فجوة مهارية'},process_issue:{en:'Process Issue',ar:'مشكلة إجرائية'},knowledge_gap:{en:'Knowledge Gap',ar:'فجوة معرفية'},tool_issue:{en:'Tool Issue',ar:'مشكلة أدوات'},motivation_issue:{en:'Motivation',ar:'تحفيز'}};
  const tabs=[{id:'hypotheses' as const,la:'Hypotheses',laAr:'الفرضيات',ic:Lightbulb},{id:'evidence' as const,la:'Evidence',laAr:'الأدلة',ic:FileSearch},{id:'contradictions' as const,la:'Contradictions',laAr:'التناقضات',ic:GitBranch},{id:'review' as const,la:'Manager Review',laAr:'مراجعة المدير',ic:UserCheck}];

  const handleD=(hid:string,d:string)=>{setRv(p=>({...p,[hid]:{...p[hid]||{c:''},d}}));};
  const handleC=(hid:string,c:string)=>{setRv(p=>({...p,[hid]:{...p[hid]||{d:''},c}}));};

  return (<div>
    <PageHeader title={l==='ar'?report.titleAr:report.title} titleAr={report.titleAr} description={`${l==='ar'?'تقرير تشخيصي':'Diagnostic Report'} — ${report.date}`} currentLang={l}
      actions={<div className="flex items-center gap-2"><button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"><Download className="w-4 h-4" /><span>PDF</span></button><button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><Save className="w-4 h-4" /><span>{l==='ar'?'حفظ':'Save'}</span></button></div>}
    />

    <Card className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <div><h2 className="text-lg font-semibold mb-1">{l==='ar'?report.employeeAr:report.employee}</h2><p className="text-sm text-gray-500">{l==='ar'?report.deptAr:report.department} · {report.date}</p></div>
        <div className="flex items-center gap-2"><MaturityBadge level={report.maturity} size="sm" currentLang={l} /><StatusBadge status={report.status} /><div className="text-right"><p className="text-2xl font-bold text-blue-600">{report.confidence}%</p><p className="text-xs text-gray-500">{l==='ar'?'ثقة':'Confidence'}</p></div></div>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-2 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div><p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">{l==='ar'?'تنبيه: تقرير تشخيصي استشاري':'Notice: Advisory diagnostic report'}</p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">{l==='ar'?'جميع المخرجات هي "رؤى تشخيصية" و"فرضيات". المدير هو المسؤول الوحيد عن القرارات.':'All outputs are "Diagnostic Insights" and "Hypotheses". Managers remain the sole decision makers.'}</p></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{l==='ar'?report.summaryAr:report.summary}</p>
    </Card>

    <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
      {tabs.map(t=>{const IC=t.ic;return(<button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab===t.id?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700'}`}><IC className="w-4 h-4" /><span>{l==='ar'?t.laAr:t.la}</span></button>);})}
    </div>

    {tab==='hypotheses'&&<div className="space-y-4">{report.hyps.map((hyp,i)=><Card key={hyp.id} className="border-l-4" style={{borderLeftColor:i===0?'#2563eb':'#8b5cf6'}}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${hyp.label==='Diagnostic Insight'?'bg-blue-600':hyp.label==='Evidence-Based Observation'?'bg-purple-600':'bg-green-600'}`}>{l==='ar'?(hyp.label==='Diagnostic Insight'?'رؤية تشخيصية':hyp.label==='Evidence-Based Observation'?'ملاحظة':'فرضية'):hyp.label}</span>
          <StatusBadge status={hyp.cat==='skill_gap'?'red':hyp.cat==='process_issue'?'yellow':'green'} size="sm" label={catLabels[hyp.cat]?.[l==='ar'?'ar':'en']||hyp.cat} /><span className="text-xs text-gray-400">#{hyp.rank}</span>
        </div>
        <div className="text-right"><p className="text-2xl font-bold text-blue-600">{hyp.conf}%</p><p className="text-[10px] text-gray-500">{l==='ar'?'ثقة':'Confidence'}</p></div>
      </div>
      <p className="text-sm font-medium mb-4">{l==='ar'?hyp.txtAr:hyp.txt}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><p className="text-xs font-medium text-green-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" />{l==='ar'?'الدعم':'Supporting'}</p><ul className="space-y-1">{hyp.evid.map((e:any,j:number)=><li key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-green-500 mt-0.5">•</span>{e}</li>)}</ul></div>
        {hyp.contra.length>0&&<div><p className="text-xs font-medium text-red-600 flex items-center gap-1 mb-2"><XCircle className="w-3 h-3" />{l==='ar'?'متناقض':'Contradicting'}</p><ul className="space-y-1">{hyp.contra.map((c:any,j:number)=><li key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-red-500 mt-0.5">•</span>{c}</li>)}</ul></div>}
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-3"><p className="text-xs font-medium mb-1"><Lightbulb className="w-3 h-3 inline mr-1" />{l==='ar'?'المنطق':'Reasoning'}</p><p className="text-xs text-gray-600">{hyp.rsn}</p></div>
      <div className="mb-3"><p className="text-xs font-medium text-blue-600 mb-2 flex items-center gap-1"><ArrowRight className="w-3 h-3" />{l==='ar'?'إجراءات التحقق':'Validation'}</p><div className="flex flex-wrap gap-1.5">{hyp.acts.map((a:any,j:number)=><span key={j} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-lg text-xs">{a}</span>)}</div></div>
      <div className="border-t border-gray-200 dark:border-gray-800 pt-3"><p className="text-xs font-medium mb-2"><UserCheck className="w-3 h-3 inline mr-1" />{l==='ar'?'قرار المدير':'Manager Decision'}</p>
        <div className="flex items-center gap-2 mb-2">{['accepted','rejected','modified'].map(d=><button key={d} onClick={()=>handleD(hyp.id,d)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${rv[hyp.id]?.d===d?d==='accepted'?'bg-green-100 border-green-300 text-green-700':d==='rejected'?'bg-red-100 border-red-300 text-red-700':'bg-orange-100 border-orange-300 text-orange-700':'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{d==='accepted'?<ThumbsUp className="w-3 h-3"/>:d==='rejected'?<ThumbsDown className="w-3 h-3"/>:<Edit3 className="w-3 h-3"/>}<span>{l==='ar'?(d==='accepted'?'قبول':d==='rejected'?'رفض':'تعديل'):d}</span></button>)}</div>
        <textarea placeholder={l==='ar'?'أضف تعليق المدير...':'Add manager comments...'} value={rv[hyp.id]?.c||''} onChange={e=>handleC(hyp.id,e.target.value)} dir={l==='ar'?'rtl':'ltr'}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]" />
      </div>
    </Card>)}</div>}

    {tab==='evidence'&&<div className="space-y-3">{report.evidItems.map((ev:any,i:number)=><Card key={i}><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 mb-1"><span className={`px-2 py-0.5 rounded text-xs font-medium ${ev.t==='quantitative'?'bg-green-100 text-green-700':ev.t==='system_generated'?'bg-blue-100 text-blue-700':'bg-purple-100 text-purple-700'}`}>{l==='ar'?(ev.t==='quantitative'?'كمي':ev.t==='system_generated'?'منشأ من النظام':'نوعي'):ev.t.replace('_',' ')}</span><span className="text-xs text-gray-500">{ev.src}</span></div><p className="text-sm text-gray-700 dark:text-gray-300">{ev.desc}</p></div><div className="text-right"><div className="flex items-center gap-2"><div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${ev.rl>=85?'bg-green-500':ev.rl>=60?'bg-yellow-500':'bg-red-500'}`} style={{width:`${ev.rl}%`}}/></div><span className="text-xs font-medium">{ev.rl}%</span></div><p className="text-[10px] text-gray-400 mt-0.5">{ev.v?(l==='ar'?'موثقة':'Verified'):(l==='ar'?'غير موثقة':'Unverified')}</p></div></div></Card>)}<div className="text-xs text-gray-500 text-center pt-2">{report.evidItems.length} {l==='ar'?'عنصر دليل':'evidence items'}</div></div>}

    {tab==='contradictions'&&<div className="space-y-3">{report.contras.length===0?<Card><div className="text-center py-6"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3"/><p className="text-gray-500">{l==='ar'?'لا تناقضات':'No contradictions'}</p></div></Card>:report.contras.map((c:any,i:number)=><Card key={i}><div className="flex items-start gap-3"><div className={`p-2 rounded-lg ${c.s==='high'?'bg-red-100 dark:bg-red-900/20':'bg-yellow-100 dark:bg-yellow-900/20'}`}><GitBranch className={`w-5 h-5 ${c.s==='high'?'text-red-600':'text-yellow-600'}`}/></div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h4 className="text-sm font-medium">{c.d}</h4><StatusBadge status={c.s==='high'?'red':'yellow'} size="sm" label={c.s}/></div><p className="text-xs text-gray-500 italic">{c.e}</p></div></div></Card>)}</div>}

    {tab==='review'&&<div className="space-y-4">
      <Card><CardHeader><CardTitle><UserCheck className="w-4 h-4 inline mr-1" />{l==='ar'?'مراجعة المدير':'Manager Review'}</CardTitle></CardHeader>
        <div className="flex items-center gap-4 mb-4 flex-wrap"><span className="text-xs text-gray-500">{l==='ar'?'الموظف:':'Employee:'}</span><span className="text-sm font-medium">{l==='ar'?report.employeeAr:report.employee}</span><StatusBadge status={report.status}/></div>
        <FormSelect label={l==='ar'?'حالة المراجعة':'Review Status'} labelAr="حالة المراجعة" options={[{value:'pending',label:'Pending',labelAr:'معلق'},{value:'under_review',label:'Under Review',labelAr:'قيد المراجعة'},{value:'reviewed',label:'Reviewed',labelAr:'تمت'},{value:'approved',label:'Approved',labelAr:'معتمد'},{value:'rejected',label:'Rejected',labelAr:'مرفوض'}]} value="under_review" currentLang={l} />
        <FormTextarea label={l==='ar'?'تعليقات المدير العامة':'Overall Comments'} labelAr="تعليقات المدير" placeholder={l==='ar'?'تعليقات عامة على التقرير...':'Overall comments...'} currentLang={l} />
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200"><button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">{l==='ar'?'طلب توضيح':'Clarify'}</button><button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><Save className="w-4 h-4" /><span>{l==='ar'?'إرسال المراجعة':'Submit Review'}</span></button></div>
      </Card>
      <Card><CardHeader><CardTitle><Clock className="w-4 h-4 inline mr-1" />{l==='ar'?'سجل المراجعات':'Review History'}</CardTitle></CardHeader>
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-sm font-bold text-blue-600">SA</span></div><div className="flex-1"><div className="flex items-center justify-between"><p className="text-sm font-medium">System Admin</p><span className="text-xs text-gray-400">2026-06-04 14:30</span></div><p className="text-xs text-gray-500">{l==='ar'?'تم إنشاء التقرير':'Report generated'}</p><StatusBadge status="final" size="sm"/></div></div>
      </Card>
    </div>}
  </div>);
}
