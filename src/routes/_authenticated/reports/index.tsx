import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Link } from "@tanstack/react-router";
import { FileSearch, FileBarChart, Download } from "lucide-react";
import { useDiagnosticMetrics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/_authenticated/reports/")({ component: ReportsIndexPage });

function ReportsIndexPage() {
  const { data: diagMetrics, isLoading: _diagMetricsLoading } = useDiagnosticMetrics();
  const sections = [
    {
      href: "/reports/diagnostics",
      icon: FileSearch,
      label: "Diagnostic Reports",
      labelAr: "تقارير التشخيص",
      desc: "Performance diagnostic summaries",
      descAr: "ملخصات تشخيص الأداء",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/reports/enterprise",
      icon: FileBarChart,
      label: "Enterprise Reports",
      labelAr: "تقارير مؤسسية",
      desc: "Organization-wide performance reports",
      descAr: "تقارير الأداء على مستوى المؤسسة",
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/reports/export",
      icon: Download,
      label: "Export Reports",
      labelAr: "تصدير التقارير",
      desc: "Export to PDF, Excel, or print",
      descAr: "تصدير إلى PDF أو Excel أو طباعة",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  const recentReports = [
    {
      title: "Q2 2026 Performance Summary",
      type: "Enterprise",
      date: "2026-06-01",
      status: "Ready",
    },
    {
      title: "Engineering Dept Diagnostic",
      type: "Diagnostic",
      date: "2026-05-28",
      status: "Ready",
    },
    { title: "HR Competency Gap Report", type: "Diagnostic", date: "2026-05-20", status: "Draft" },
    { title: "May KPI Scorecard", type: "Enterprise", date: "2026-06-05", status: "Ready" },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        titleAr="التقارير"
        description="Generate and manage performance reports"
        descriptionAr="إنشاء وإدارة تقارير الأداء"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {sections.map(({ href, icon: Icon, label, labelAr, desc, descAr, color }) => (
          <Link key={href} to={href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {label}
                  </h3>
                  <p className="text-xs text-gray-500">{desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{descAr}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h3>
        <div className="space-y-2">
          {recentReports.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileBarChart className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{r.title}</p>
                  <p className="text-xs text-gray-500">
                    {r.type} · {r.date}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === "Ready" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
