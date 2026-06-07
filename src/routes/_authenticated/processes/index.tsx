import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '~/components/wpos/PageHeader';
import { Card } from '~/components/wpos/Card';
import { Link } from '@tanstack/react-router';
import { Library, ListOrdered, Share2 } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/processes/')({ component: ProcessArchitectureIndexPage });

function ProcessArchitectureIndexPage() {
  const sections = [
    { href: '/processes/library', icon: Library, label: 'Process Library', labelAr: 'مكتبة العمليات', desc: 'All documented business processes', descAr: 'جميع العمليات التجارية الموثقة', count: 42, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    { href: '/processes/steps', icon: ListOrdered, label: 'Process Steps', labelAr: 'خطوات العمليات', desc: 'Step-by-step procedure definitions', descAr: 'تعريفات الإجراءات خطوة بخطوة', count: 186, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
    { href: '/processes/dependencies', icon: Share2, label: 'Dependency Mapping', labelAr: 'خريطة التبعيات', desc: 'Process interdependency analysis', descAr: 'تحليل الاعتماديات بين العمليات', count: 28, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  ];

  const stats = [
    { label: 'Total Processes', labelAr: 'إجمالي العمليات', value: '42' },
    { label: 'Total Steps', labelAr: 'إجمالي الخطوات', value: '186' },
    { label: 'Dependencies', labelAr: 'التبعيات', value: '28' },
    { label: 'Coverage', labelAr: 'التغطية', value: '76%' },
  ];

  return (
    <div>
      <PageHeader title="Process Architecture" titleAr="هيكل العمليات" description="Document and manage your operational process framework" descriptionAr="توثيق وإدارة إطار العمليات التشغيلية" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-400">{s.labelAr}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map(({ href, icon: Icon, label, labelAr, desc, descAr, count, color }) => (
          <Link key={href} to={href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{descAr}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
