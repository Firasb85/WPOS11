import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card, CardHeader, CardTitle } from '~/components/wpos/Card';
import { DataTable } from '~/components/wpos/DataTable';
import { StatusBadge } from '~/components/wpos/StatusBadge';
import { Plus, Brain, Layers } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/competency/')({
  component: CompetencyPage,
});

function CompetencyPage() {
  const currentLang = 'ar';
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const competencies = [
    { id: '1', code: 'COM-001', nameEn: 'Effective Communication', nameAr: 'التواصل الفعال', category: 'soft_skills', catAr: 'مهارات شخصية', status: 'active' },
    { id: '2', code: 'COM-002', nameEn: 'Analytical Thinking', nameAr: 'التفكير التحليلي', category: 'cognitive', catAr: 'مهارات معرفية', status: 'active' },
    { id: '3', code: 'COM-003', nameEn: 'Leadership', nameAr: 'القيادة', category: 'managerial', catAr: 'مهارات إدارية', status: 'active' },
    { id: '4', code: 'COM-004', nameEn: 'Technical Proficiency', nameAr: 'المهارات التقنية', category: 'technical', catAr: 'مهارات تقنية', status: 'active' },
    { id: '5', code: 'COM-005', nameEn: 'Time Management', nameAr: 'إدارة الوقت', category: 'soft_skills', catAr: 'مهارات شخصية', status: 'active' },
    { id: '6', code: 'COM-006', nameEn: 'Negotiation', nameAr: 'التفاوض', category: 'soft_skills', catAr: 'مهارات شخصية', status: 'active' },
    { id: '7', code: 'COM-007', nameEn: 'Data Analysis', nameAr: 'تحليل البيانات', category: 'technical', catAr: 'مهارات تقنية', status: 'active' },
  ];
  const selected = competencies.find(c => c.id === selectedComp);

  const columns = [
    { key: 'code', label: 'Code', labelAr: 'الكود', render: (item: any) => <span className="font-mono text-xs text-gray-500">{item.code}</span> },
    { key: 'nameEn', label: 'Competency', labelAr: 'الكفاءة', sortable: true,
      render: (item: any) => <span className="font-medium">{currentLang === 'ar' ? item.nameAr : item.nameEn}</span> },
    { key: 'catAr', label: 'Category', labelAr: 'الفئة' },
    { key: 'status', label: 'Status', labelAr: 'الحالة', render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Competency Architecture" titleAr="هيكل الكفاءات" description="Competency intelligence layer" descriptionAr="طبقة ذكاء الكفاءات" currentLang={currentLang}
        actions={<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /><span>{currentLang === 'ar' ? 'إضافة كفاءة' : 'Add Competency'}</span></button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><div className="text-center"><p className="text-2xl font-bold text-gray-900 dark:text-white">10</p><p className="text-xs text-gray-500 mt-1">{currentLang === 'ar' ? 'إجمالي الكفاءات' : 'Total'}</p></div></Card>
        <Card><div className="text-center"><p className="text-2xl font-bold text-blue-600">5</p><p className="text-xs text-gray-500 mt-1">{currentLang === 'ar' ? 'فئات' : 'Categories'}</p></div></Card>
        <Card><div className="text-center"><p className="text-2xl font-bold text-yellow-600">3</p><p className="text-xs text-gray-500 mt-1">{currentLang === 'ar' ? 'فجوات حرجة' : 'Critical Gaps'}</p></div></Card>
        <Card><div className="text-center"><p className="text-2xl font-bold text-green-600">87%</p><p className="text-xs text-gray-500 mt-1">{currentLang === 'ar' ? 'مؤشر الجاهزية' : 'Readiness'}</p></div></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><DataTable columns={columns} data={competencies} currentLang={currentLang} onRowClick={(item) => setSelectedComp(item.id)} /></div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <Card><CardHeader><CardTitle>{currentLang === 'ar' ? selected.nameAr : selected.nameEn}</CardTitle></CardHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">{currentLang === 'ar' ? 'الكود' : 'Code'}</p><p className="text-sm font-mono font-medium">{selected.code}</p></div>
                  <div><p className="text-xs text-gray-500">{currentLang === 'ar' ? 'الفئة' : 'Category'}</p><p className="text-sm font-medium">{selected.catAr}</p></div>
                </div>
              </Card>
              <Card><CardHeader><CardTitle><Layers className="w-4 h-4 inline mr-1" />{currentLang === 'ar' ? 'مستويات الكفاءة' : 'Proficiency Levels'}</CardTitle></CardHeader>
                {[{l:1,n:'Novice',na:'مبتدئ'},{l:2,n:'Advanced Beginner',na:'مبتدئ متقدم'},{l:3,n:'Competent',na:'كفؤ'},{l:4,n:'Proficient',na:'متمكن'},{l:5,n:'Expert',na:'خبير'}].map(lvl => (
                  <div key={lvl.l} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold">{lvl.l}</div>
                    <span className="text-sm font-medium">{currentLang === 'ar' ? lvl.na : lvl.n}</span>
                  </div>
                ))}
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400"><p>{currentLang === 'ar' ? 'اختر كفاءة لعرض التفاصيل' : 'Select a competency'}</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
