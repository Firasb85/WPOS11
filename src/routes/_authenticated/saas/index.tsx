import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { CreditCard, Users, HardDrive, CheckCircle, Zap } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";

export const Route = createFileRoute("/_authenticated/saas/")({
  component: SaasPage,
});

function SaasPage() {
  const { t, lang: l } = useLanguage();
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();

  const plans = [
    {
      name: "Starter",
      nameAr: "المبتدئ",
      price: 99,
      users: 25,
      employees: 100,
      storage: 5,
      features: ["Core HR", "Basic KPIs", "Email Support"],
      current: false,
    },
    {
      name: "Professional",
      nameAr: "المحترف",
      price: 299,
      users: 100,
      employees: 500,
      storage: 25,
      features: ["All Starter features", "Diagnostics", "Competency Framework", "Priority Support"],
      current: true,
    },
    {
      name: "Enterprise",
      nameAr: "المؤسسي",
      price: 799,
      users: 500,
      employees: 5000,
      storage: 100,
      features: [
        "All Professional features",
        "Digital Twin",
        "AI Assistant",
        "Custom Integrations",
        "Dedicated Support",
      ],
      current: false,
    },
  ];

  return (
    <div>
      <PageHeader
        title="SaaS Platform"
        titleAr="منصة SaaS"
        description="Manage your subscription and billing"
        descriptionAr="إدارة اشتراكك والفواتير"
        currentLang={l}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <CreditCard className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold">Professional</p>
          <p className="text-xs text-gray-500">{t("Current Plan", "الخطة الحالية")}</p>
        </Card>
        <Card className="text-center">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-lg font-bold">42 / 100</p>
          <p className="text-xs text-gray-500">{t("Users", "المستخدمون")}</p>
        </Card>
        <Card className="text-center">
          <HardDrive className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-lg font-bold">12.5 / 25 GB</p>
          <p className="text-xs text-gray-500">{t("Storage", "التخزين")}</p>
        </Card>
        <Card className="text-center">
          <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-lg font-bold">28</p>
          <p className="text-xs text-gray-500">{t("Days Remaining", "الأيام المتبقية")}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? "ring-2 ring-blue-500" : ""}>
            {plan.current && (
              <div className="text-center mb-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  {t("Current Plan", "الخطة الحالية")}
                </span>
              </div>
            )}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">{l === "ar" ? plan.nameAr : plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 text-sm">/{t("mo", "شهر")}</span>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {plan.users} {t("users", "مستخدم")}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {plan.employees} {t("employees", "موظف")}
              </p>
              <p className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                {plan.storage} GB
              </p>
            </div>
            <div className="space-y-1.5 mb-4">
              {plan.features.map((f) => (
                <p key={f} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {f}
                </p>
              ))}
            </div>
            <button
              className={`w-full py-2 rounded-lg text-sm font-medium ${plan.current ? "bg-gray-100 text-gray-500 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {plan.current ? t("Current", "الحالية") : t("Upgrade", "ترقية")}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
