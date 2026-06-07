import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { Search, TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics/")({
  component: AnalyticsIndexPage,
});

function AnalyticsIndexPage() {
  const sections = [
    {
      href: "/analytics/root-cause",
      icon: Search,
      label: "Root Cause Analysis",
      labelAr: "تحليل الأسباب الجذرية",
      desc: "Identify and track performance root causes",
      descAr: "تحديد وتتبع الأسباب الجذرية للأداء",
      count: 43,
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      href: "/analytics/competency-trends",
      icon: TrendingUp,
      label: "Competency Trends",
      labelAr: "اتجاهات الكفاءات",
      desc: "Track competency evolution over time",
      descAr: "تتبع تطور الكفاءات بمرور الوقت",
      count: null,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/analytics/evidence-quality",
      icon: Shield,
      label: "Evidence Quality",
      labelAr: "جودة الأدلة",
      desc: "Assess quality and reliability of evidence",
      descAr: "تقييم جودة وموثوقية الأدلة",
      count: null,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
  ];

  const stats = [
    { label: "Root Causes", labelAr: "الأسباب الجذرية", value: "43" },
    { label: "Avg Score", labelAr: "متوسط الدرجة", value: "72%" },
    { label: "Improving", labelAr: "تتحسن", value: "18" },
    { label: "At Risk", labelAr: "في خطر", value: "7" },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        titleAr="التحليلات"
        description="Deep analytics and intelligence across your workforce"
        descriptionAr="تحليلات عميقة واستخبارات شاملة لقوى العمل"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
