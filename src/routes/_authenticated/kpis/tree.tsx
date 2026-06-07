import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { KpiTreeView } from '~/components/wpos/visualizations/KpiTreeView';
import { StatsCard } from '~/components/wpos/StatsCard';
import { Share2, TrendingUp, GitBranch, Layers } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/kpis/tree')({ component: KpiTreePage });

function KpiTreePage() {
  const l = 'ar';
  const tree = {
    kpi: { id: 'root', name: l === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', code: 'REV-001', currentValue: 14200000, targetValue: 15000000, status: 'yellow' },
    impactWeight: 1,
    children: [
      { kpi: { id: 'c1', name: l === 'ar' ? 'حجم المبيعات' : 'Sales Volume', code: 'SLS-001', currentValue: 2850, targetValue: 3000, status: 'yellow' }, impactWeight: 1, children: [
        { kpi: { id: 'c1a', name: l === 'ar' ? 'العملاء النشطون' : 'Active Customers', code: 'CUS-001', currentValue: 1240, targetValue: 1300, status: 'yellow' }, impactWeight: 0.8, children: [
          { kpi: { id: 'c1a1', name: l === 'ar' ? 'العملاء الجدد' : 'New Customers', code: 'CUS-002', currentValue: 185, targetValue: 200, status: 'yellow' }, impactWeight: 0.6, children: [] },
          { kpi: { id: 'c1a2', name: l === 'ar' ? 'معدل الاحتفاظ' : 'Retention Rate', code: 'CUS-003', currentValue: 94, targetValue: 95, status: 'green' }, impactWeight: 0.4, children: [] },
        ]},
        { kpi: { id: 'c1b', name: l === 'ar' ? 'متوسط قيمة الصفقة' : 'Avg Deal Size', code: 'SLS-002', currentValue: 4850, targetValue: 5000, status: 'green' }, impactWeight: 0.5, children: [] },
      ]},
      { kpi: { id: 'c2', name: l === 'ar' ? 'ربحية المنتج' : 'Product Profitability', code: 'PRF-001', currentValue: 22.5, targetValue: 25, status: 'yellow' }, impactWeight: 0.7, children: [
        { kpi: { id: 'c2a', name: l === 'ar' ? 'تكلفة الإنتاج' : 'Production Cost', code: 'CST-001', currentValue: 145, targetValue: 140, status: 'red' }, impactWeight: 0.6, children: [] },
        { kpi: { id: 'c2b', name: l === 'ar' ? 'هامش الربح' : 'Profit Margin', code: 'PRF-002', currentValue: 18.2, targetValue: 20, status: 'yellow' }, impactWeight: 0.4, children: [] },
      ]},
      { kpi: { id: 'c3', name: l === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction', code: 'CSAT', currentValue: 82, targetValue: 95, status: 'red' }, impactWeight: 0.5, children: [
        { kpi: { id: 'c3a', name: l === 'ar' ? 'جودة الخدمة' : 'Service Quality', code: 'SVC-001', currentValue: 85, targetValue: 95, status: 'red' }, impactWeight: 0.5, children: [] },
      ]},
    ],
  };

  return (<div>
    <PageHeader title="KPI Tree Architecture" titleAr="هيكل شجرة المؤشرات" description="Visualize KPI dependencies" descriptionAr="تصور تبعيات المؤشرات" currentLang={l} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatsCard title="Root KPIs" titleAr="مؤشرات جذرية" value="3" icon={<GitBranch />} currentLang={l} />
      <StatsCard title="Dependencies" titleAr="التبعيات" value="5" icon={<Share2 />} currentLang={l} />
      <StatsCard title="Depth Level" titleAr="عمق الشجرة" value="3" icon={<Layers />} currentLang={l} />
      <StatsCard title="Impact Score" titleAr="درجة التأثير" value="84%" change={-2.1} icon={<TrendingUp />} status="warning" currentLang={l} />
    </div>
    <Card><CardHeader><CardTitle>{l === 'ar' ? 'شجرة تبعيات المؤشرات' : 'KPI Dependency Tree'}</CardTitle></CardHeader>
    <KpiTreeView tree={tree} currentLang={l} /></Card>
  </div>);
}
