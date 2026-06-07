import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Zap, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";

export const Route = createFileRoute("/_authenticated/onboarding/")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { t, lang: l } = useLanguage();
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();

  const steps = [
    {
      step: 1,
      titleEn: "Organization Setup",
      titleAr: "إعداد المنظمة",
      descEn: "Add your company, branches, and departments",
      descAr: "أضف شركتك وفروعها وإداراتها",
      done: true,
    },
    {
      step: 2,
      titleEn: "Job Architecture",
      titleAr: "هيكل الوظائف",
      descEn: "Define job families, grades, and profiles",
      descAr: "حدد مجموعات ومستويات وملفات الوظائف",
      done: true,
    },
    {
      step: 3,
      titleEn: "Employee Import",
      titleAr: "استيراد الموظفين",
      descEn: "Import or add your workforce data",
      descAr: "استورد أو أضف بيانات القوى العاملة",
      done: false,
    },
    {
      step: 4,
      titleEn: "Competency Framework",
      titleAr: "إطار الكفاءات",
      descEn: "Set up competency models and levels",
      descAr: "إعداد نماذج ومستويات الكفاءات",
      done: false,
    },
    {
      step: 5,
      titleEn: "KPI Configuration",
      titleAr: "تكوين المؤشرات",
      descEn: "Configure your key performance indicators",
      descAr: "كوّن مؤشرات الأداء الرئيسية",
      done: false,
    },
    {
      step: 6,
      titleEn: "Process Mapping",
      titleAr: "رسم العمليات",
      descEn: "Map your business processes and steps",
      descAr: "ارسم عمليات العمل وخطواتها",
      done: false,
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div>
      <PageHeader
        title="System Onboarding"
        titleAr="إعداد النظام"
        description="Complete these steps to get WPOS fully configured"
        descriptionAr="أكمل هذه الخطوات لتكوين WPOS بالكامل"
        currentLang={l}
      />

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{t("Setup Progress", "تقدم الإعداد")}</h3>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completed} {t("of", "من")} {steps.length} {t("steps completed", "خطوات مكتملة")}
        </p>
      </Card>

      <div className="space-y-3">
        {steps.map((step) => (
          <Card key={step.step} className={step.done ? "opacity-75" : ""}>
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-green-100" : "bg-gray-100"}`}
              >
                {step.done ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-sm font-bold text-gray-500">{step.step}</span>
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-sm font-medium ${step.done ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}
                >
                  {l === "ar" ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-xs text-gray-500">{l === "ar" ? step.descAr : step.descEn}</p>
              </div>
              {!step.done && (
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">
                  {t("Start", "ابدأ")} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
