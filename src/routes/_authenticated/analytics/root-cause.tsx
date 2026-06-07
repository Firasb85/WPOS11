import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { StatsCard } from '~/components/wpos/StatsCard';
import { Search, TrendingUp, AlertTriangle, BarChart3, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/analyrics/root-cause')({ component: RootCauseAnalysisPage });

function RootCauseAnalysisPage() {
  const l = 'ar';
  const rootCauses = [
    { label: 'Skill Gap', la: 'فجوة مهارية', count: 12, pct: 28, trend: 'increasing', chg: 15 },
    { label: 'Process Issue', la: 'مشكلة إجرائية', count: 10, pct: 23, trend: 'stable', chg: 2 },
    { label: 'Knowledge Gap', la: 'فجوة معرفية', count: 7, pct: 16, trend: 'stable', chg: 1 },
    { label: 'Tool Issue', la: 'مشكلة أدوات', count: 5, pct: 12, trend: 'decreasing', chg: -8 },
    { label: 'Motivation', la: 'تحفيز', count: 4, pct: 9, trend: 'increasing', chg: 10 },
  ];
  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'increasing') return <ArrowUp className="w-3 h-3 text-red-500" />;
    if (trend === 'decreasing') return <ArrowDown className="w-3 h-3 text-green-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };
  return (<div>
    <PageHeader title="Root Cause Analysis" titleAr="تحليل الأسباب الجذرية" description="Track root cause frequencies" descriptionAr="تتبع تكرار الأسباب الجذرية" currentLang={l} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatsCard title="Total" titleAr="الإجمالي" value="43" icon={<Search />} currentLang={l} />
      <StatsCard title="Top Category" titleAr="الفئة الأعلى" value={l === 'ar' ? 'فجوة مهارية' : 'Skill Gap'} icon={<BarChart3 />} currentLang={l} />
      <StatsCard title="Avg per Month" titleAr="المتوسط الشهري" value="7.2" change={2.1} icon={<TrendingUp />} status="warning" currentLang={l} />
      <StatsCard title="Improving" titleAr="تتحسن" value="2" icon={<AlertTriangle />} status="good" currentLang={l} />
    </div>
    <Card><CardHeader><CardTitle>{l === 'ar' ? 'توزيع الأسباب الجذرية' : 'Root Cause Distribution'}</CardTitle></CardHeader>
      <div className="space-y-2">{rootCauses.map((rc, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400 w-5">{i+1}</span>
          <div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{l === 'ar' ? rc.la : rc.label}</span><div className="flex items-center gap-2"><TrendIcon trend={rc.trend} /><span className="text-sm font-bold">{rc.count}</span><span className="text-xs text-gray-400">({rc.pct}%)</span></div></div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${rc.trend === 'increasing' ? 'bg-red-500' : rc.trend === 'decreasing' ? 'bg-green-500' : 'bg-blue-500'}`} style={{width:`${rc.pct}%`}} /></div></div>
          <span className={`text-xs px-1.5 py-0.5 rounded ${rc.chg > 0 ? 'bg-red-100 text-red-700' : rc.chg < 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{rc.chg > 0 ? '+' : ''}{rc.chg}%</span>
        </div>
      ))}</div>
    </Card>
  </div>);
}
