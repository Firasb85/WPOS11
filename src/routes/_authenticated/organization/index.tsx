import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { Building, GitBranch, Building2, Users, UserCircle, GitFork } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/")({
  component: OrganizationIndexPage,
});

function OrganizationIndexPage() {
  const sections = [
    {
      href: "/organization/companies",
      icon: Building,
      label: "Companies",
      labelAr: "الشركات",
      desc: "Manage registered companies",
      descAr: "إدارة الشركات المسجلة",
      count: 2,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/organization/branches",
      icon: GitBranch,
      label: "Branches",
      labelAr: "الفروع",
      desc: "Manage company branches",
      descAr: "إدارة فروع الشركات",
      count: 5,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/organization/departments",
      icon: Building2,
      label: "Departments",
      labelAr: "الإدارات",
      desc: "Organizational departments",
      descAr: "الإدارات التنظيمية",
      count: 12,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      href: "/organization/teams",
      icon: Users,
      label: "Teams",
      labelAr: "الفرق",
      desc: "Teams and work groups",
      descAr: "الفرق ومجموعات العمل",
      count: 24,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      href: "/organization/employees",
      icon: UserCircle,
      label: "Employees",
      labelAr: "الموظفين",
      desc: "Employee directory",
      descAr: "دليل الموظفين",
      count: 148,
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      href: "/organization/hierarchy",
      icon: GitFork,
      label: "Hierarchy View",
      labelAr: "عرض التسلسل الهرمي",
      desc: "Org chart & reporting lines",
      descAr: "الهيكل التنظيمي وخطوط الإبلاغ",
      count: null,
      color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Organization"
        titleAr="الهيكل التنظيمي"
        description="Manage your organizational structure"
        descriptionAr="إدارة الهيكل التنظيمي للمؤسسة"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, icon: Icon, label, labelAr, desc, descAr, count, color }) => (
          <Link key={href} to={href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
                    {count !== null && (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{descAr}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
