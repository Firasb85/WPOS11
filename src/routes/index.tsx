import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { APP_NAME, APP_NAME_FULL } from "@/lib/constants";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Brain,
  GitMerge,
  Gauge,
  BarChart3,
  Users,
  FileBarChart,
  Settings,
  Activity,
  Stethoscope,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { t, lang } = useLanguage();

  const quickAccess = [
    {
      title: t("CEO Dashboard", "لوحة الرئيس التنفيذي"),
      href: "/dashboard/ceo",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: t("Department Dashboard", "لوحة الإدارة"),
      href: "/dashboard/department",
      icon: Building2,
      color: "bg-green-500",
    },
    {
      title: t("Supervisor Dashboard", "لوحة المشرف"),
      href: "/dashboard/supervisor",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: t("Diagnostics", "التشخيصات"),
      href: "/diagnostics",
      icon: Stethoscope,
      color: "bg-red-500",
    },
    {
      title: t("KPIs", "مؤشرات الأداء"),
      href: "/kpis/library",
      icon: Gauge,
      color: "bg-orange-500",
    },
    {
      title: t("Analytics", "التحليلات"),
      href: "/analytics",
      icon: Activity,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("Welcome to", "مرحباً بك في")} {APP_NAME}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t(APP_NAME_FULL, "نظام إدارة أداء القوى العاملة")}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t("Quick Access", "الوصول السريع")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow no-underline"
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("System Overview", "نظرة عامة على النظام")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                {t("Total Employees", "إجمالي الموظفين")}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">1,234</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                {t("Active KPIs", "المؤشرات النشطة")}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">89</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                {t("Open Cases", "الحالات المفتوحة")}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">23</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-400">
                {t("System Health", "صحة النظام")}
              </span>
              <span className="font-semibold text-green-600">98%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("Recent Activity", "النشاط الأخير")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  New diagnostic report created
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  KPI target achieved: Customer Satisfaction
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  Performance review scheduled
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
