import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useCeoDashboard } from "@/hooks/useDashboard";
import {
  Settings,
  FileText,
  Share2,
  GitBranch,
  Building2,
  Target,
  FolderOpen,
  BarChart3,
  Database,
  Play,
  Monitor,
  Bell,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/advanced/")({
  component: AdvancedIndexPage,
});

function AdvancedIndexPage() {
  const { lang: l } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();

  const sections = [
    {
      href: "/rules-engine",
      icon: Settings,
      label: "Rules Engine",
      labelAr: "محرك القواعد",
      desc: "Configure business rules and automation logic",
      descAr: "تكوين قواعد العمل ومنطق الأتمتة",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/forms",
      icon: FileText,
      label: "Form Builder",
      labelAr: "منشئ النماذج",
      desc: "Design and manage custom forms",
      descAr: "تصميم وإدارة النماذج المخصصة",
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/lineage",
      icon: Share2,
      label: "Data Lineage",
      labelAr: "نسب البيانات",
      desc: "Track data flow and dependencies",
      descAr: "تتبع تدفق البيانات والتبعيات",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      href: "/workflow-studio",
      icon: GitBranch,
      label: "Workflow Studio",
      labelAr: "استوديو سير العمل",
      desc: "Design and manage workflow automations",
      descAr: "تصميم وإدارة أتمتة سير العمل",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      href: "/digital-twin",
      icon: Building2,
      label: "Digital Twin",
      labelAr: "التوأم الرقمي",
      desc: "Organization digital twin modeling",
      descAr: "نمذجة التوأم الرقمي للمؤسسة",
      color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
    },
    {
      href: "/strategy",
      icon: Target,
      label: "Strategy",
      labelAr: "الاستراتيجية",
      desc: "Strategic planning and balanced scorecard",
      descAr: "التخطيط الاستراتيجي وبطاقة الأداء المتوازن",
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      href: "/portfolio",
      icon: FolderOpen,
      label: "Portfolio",
      labelAr: "الحافظة",
      desc: "Manage project and initiative portfolios",
      descAr: "إدارة حافظات المشاريع والمبادرات",
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    },
    {
      href: "/benchmarks",
      icon: BarChart3,
      label: "Benchmarks",
      labelAr: "المقاييس المرجعية",
      desc: "Industry benchmarking and comparisons",
      descAr: "المقارنة المرجعية مع القطاع",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
    {
      href: "/data-catalog",
      icon: Database,
      label: "Data Catalog",
      labelAr: "كتالوج البيانات",
      desc: "Enterprise data metadata repository",
      descAr: "مستودع البيانات الوصفية المؤسسي",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
    },
    {
      href: "/simulations",
      icon: Play,
      label: "Simulations",
      labelAr: "المحاكاة",
      desc: "Run what-if scenarios and simulations",
      descAr: "تشغيل سيناريوهات ومحاكاة ماذا لو",
      color: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    },
    {
      href: "/command-center",
      icon: Monitor,
      label: "Command Center",
      labelAr: "مركز القيادة",
      desc: "Real-time operational command center",
      descAr: "مركز القيادة التشغيلي الفوري",
      color: "bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400",
    },
    {
      href: "/documents",
      icon: FileText,
      label: "Documents",
      labelAr: "المستندات",
      desc: "Enterprise document management",
      descAr: "إدارة المستندات المؤسسية",
      color: "bg-lime-50 text-lime-600 dark:bg-lime-900/20 dark:text-lime-400",
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
      labelAr: "الإشعارات",
      desc: "Notification templates and settings",
      descAr: "قوالب الإشعارات والإعدادات",
      color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Advanced Tools"
        titleAr="الأدوات المتقدمة"
        description="Enterprise-grade tools for advanced operations, automation, and analytics"
        descriptionAr="أدوات مؤسسية متقدمة للعمليات والأتمتة والتحليلات"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link key={section.href} to={section.href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${section.color}`}
                >
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {l === "ar" ? section.labelAr : section.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {l === "ar" ? section.descAr : section.desc}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
