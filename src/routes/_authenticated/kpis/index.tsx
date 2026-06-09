import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { Tags, Gauge, Share2 } from "lucide-react";
import { useKpiCategories, useKpis } from "@/hooks/useKpis";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";

export const Route = createFileRoute("/_authenticated/kpis/")({ component: KpisIndexPage });

function KpisIndexPage() {
  const { t } = useLanguage();
  const { data: _categories, isLoading: _categoriesLoading } = useKpiCategories();
  const { data: _kpis } = useKpis();
  const sections = [
    {
      href: "/kpis/categories",
      icon: Tags,
      label: "KPI Categories",
      labelAr: "فئات المؤشرات",
      desc: "Organize KPIs by category",
      descAr: "تنظيم المؤشرات حسب الفئة",
      count: 5,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/kpis/library",
      icon: Gauge,
      label: "KPI Library",
      labelAr: "مكتبة المؤشرات",
      desc: "All performance indicators",
      descAr: "جميع مؤشرات الأداء",
      count: 64,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/kpis/tree",
      icon: Share2,
      label: "KPI Tree",
      labelAr: "شجرة المؤشرات",
      desc: "Hierarchical KPI breakdown",
      descAr: "تفصيل هرمي للمؤشرات",
      count: null,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      href: "/kpis/dependency",
      icon: Share2,
      label: "KPI Dependency",
      labelAr: "تبعية المؤشرات",
      desc: "KPI interdependency map",
      descAr: "خريطة اعتماديات المؤشرات",
      count: null,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ];

  const stats = [
    { label: "Total KPIs", labelAr: "إجمالي المؤشرات", value: "64" },
    { label: "Categories", labelAr: "الفئات", value: "5" },
    { label: "On Target", labelAr: "على الهدف", value: "48" },
    { label: "At Risk", labelAr: "في خطر", value: "16" },
  ];

  return (
    <div>
      <PageHeader
        title="KPIs"
        titleAr="مؤشرات الأداء"
        description="Key Performance Indicator management and tracking"
        descriptionAr="إدارة ومتابعة مؤشرات الأداء الرئيسية"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-400">{s.labelAr}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ href, icon: Icon, label, labelAr, desc, descAr, count, color }) => (
          <Link key={href} to={href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
                    {count !== null && (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {count}
                      </span>
                    )}
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
