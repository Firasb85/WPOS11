import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { Users, Shield, ScrollText, Settings, Key } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdministrationIndexPage,
});

function AdministrationIndexPage() {
  const sections = [
    {
      href: "/admin/users",
      icon: Users,
      label: "User Management",
      labelAr: "إدارة المستخدمين",
      desc: "Manage system users and access",
      descAr: "إدارة مستخدمي النظام والوصول",
      count: 12,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/admin/roles",
      icon: Shield,
      label: "Role Management",
      labelAr: "إدارة الأدوار",
      desc: "Define roles and permissions",
      descAr: "تعريف الأدوار والصلاحيات",
      count: 7,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/admin/audit",
      icon: ScrollText,
      label: "Audit Logs",
      labelAr: "سجلات التدقيق",
      desc: "System activity and audit trail",
      descAr: "نشاط النظام وسجل التدقيق",
      count: null,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "System Settings",
      labelAr: "إعدادات النظام",
      desc: "Configure system preferences",
      descAr: "تكوين تفضيلات النظام",
      count: null,
      color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    },
    {
      href: "/admin/security",
      icon: Shield,
      label: "Security",
      labelAr: "الأمان",
      desc: "Security policies and controls",
      descAr: "سياسات وضوابط الأمان",
      count: null,
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      href: "/api-keys",
      icon: Key,
      label: "API Keys",
      labelAr: "مفاتيح API",
      desc: "Manage API access tokens",
      descAr: "إدارة مفاتيح الوصول إلى API",
      count: 3,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  const stats = [
    { label: "Total Users", labelAr: "المستخدمون", value: "12" },
    { label: "Active Roles", labelAr: "الأدوار النشطة", value: "7" },
    { label: "API Keys", labelAr: "مفاتيح API", value: "3" },
    { label: "Audit Events Today", labelAr: "أحداث اليوم", value: "84" },
  ];

  return (
    <div>
      <PageHeader
        title="Administration"
        titleAr="الإدارة"
        description="System administration and configuration"
        descriptionAr="إدارة وتكوين النظام"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
