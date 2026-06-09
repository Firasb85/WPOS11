import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { FolderTree, Layers, FileText, Briefcase } from "lucide-react";
import { useJobFamilies, useJobGrades, useJobs } from "@/hooks/useJobs";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobArchitectureIndexPage,
});

function JobArchitectureIndexPage() {
  const { t } = useLanguage();
  const { data: _families, isLoading: _familiesLoading } = useJobFamilies();
  const { data: _grades } = useJobGrades();
  const { data: _jobs } = useJobs();
  const sections = [
    {
      href: "/jobs/families",
      icon: FolderTree,
      label: "Job Families",
      labelAr: "مجموعات الوظائف",
      desc: "Cluster related roles into families",
      descAr: "تجميع الأدوار ذات الصلة في مجموعات",
      count: 8,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/jobs/grades",
      icon: Layers,
      label: "Job Grades",
      labelAr: "المستويات الوظيفية",
      desc: "Define grade bands and pay ranges",
      descAr: "تحديد فئات الدرجات ونطاقات الرواتب",
      count: 12,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/jobs/profiles",
      icon: FileText,
      label: "Job Profiles",
      labelAr: "الملفات الوظيفية",
      desc: "Competency & skill requirements",
      descAr: "متطلبات الكفاءات والمهارات",
      count: 35,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      href: "/jobs/list",
      icon: Briefcase,
      label: "Jobs",
      labelAr: "الوظائف",
      desc: "All defined positions",
      descAr: "جميع المناصب المحددة",
      count: 58,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ];

  const stats = [
    { label: "Total Jobs", labelAr: "إجمالي الوظائف", value: "58" },
    { label: "Job Families", labelAr: "مجموعات الوظائف", value: "8" },
    { label: "Grade Levels", labelAr: "المستويات", value: "12" },
    { label: "Active Profiles", labelAr: "ملفات نشطة", value: "35" },
  ];

  return (
    <div>
      <PageHeader
        title={t("Job Architecture", "هيكل الوظائف")}
        titleAr="هيكل الوظائف"
        description="Design and manage your job classification framework"
        descriptionAr="تصميم وإدارة إطار تصنيف الوظائف"
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
