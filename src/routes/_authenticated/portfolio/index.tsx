import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { StatusBadge } from "~/components/wpos/StatusBadge";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { FolderOpen, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portfolio/")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t, lang: l } = useLanguage();

  const portfolios = [
    {
      id: "1",
      code: "PRG-001",
      nameEn: "Digital Transformation",
      nameAr: "التحول الرقمي",
      type: "program",
      status: "active",
      progress: 65,
      budget: 2500000,
      owner: "Ahmad Ali",
    },
    {
      id: "2",
      code: "PRJ-001",
      nameEn: "HR System Upgrade",
      nameAr: "ترقية نظام الموارد البشرية",
      type: "project",
      status: "active",
      progress: 40,
      budget: 500000,
      owner: "Nora Al-Faisal",
    },
    {
      id: "3",
      code: "PRJ-002",
      nameEn: "Process Automation",
      nameAr: "أتمتة العمليات",
      type: "project",
      status: "planning",
      progress: 10,
      budget: 750000,
      owner: "Khalid Al-Saud",
    },
    {
      id: "4",
      code: "PRG-002",
      nameEn: "Talent Development",
      nameAr: "تطوير المواهب",
      type: "program",
      status: "active",
      progress: 55,
      budget: 1200000,
      owner: "Layla Ibrahim",
    },
    {
      id: "5",
      code: "PRJ-003",
      nameEn: "Data Analytics Platform",
      nameAr: "منصة تحليل البيانات",
      type: "project",
      status: "completed",
      progress: 100,
      budget: 350000,
      owner: "Omar Hassan",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Portfolio Management"
        titleAr="إدارة الحافظة"
        description="Track programs, projects, and strategic initiatives"
        descriptionAr="تتبع البرامج والمشاريع والمبادرات الاستراتيجية"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-gray-500">{t("Total Items", "إجمالي العناصر")}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">3</p>
          <p className="text-xs text-gray-500">{t("Active", "نشطة")}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">54%</p>
          <p className="text-xs text-gray-500">{t("Avg Progress", "متوسط التقدم")}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {portfolios.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center gap-4">
              <FolderOpen className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{l === "ar" ? p.nameAr : p.nameEn}</h3>
                  <span className="text-xs font-mono text-gray-400">{p.code}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs capitalize ${p.type === "program" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {p.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {t("Owner", "المالك")}: {p.owner}
                  </span>
                  <span>
                    {t("Budget", "الميزانية")}: ${(p.budget / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{t("Progress", "التقدم")}</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
                <StatusBadge
                  status={
                    p.status === "completed" ? "green" : p.status === "active" ? "yellow" : "gray"
                  }
                  label={p.status}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
