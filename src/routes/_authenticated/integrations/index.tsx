import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import {
  Link2, CheckCircle, XCircle, RefreshCw, Settings, ArrowRight,
  Database, Cloud, Shield, Clock, Users, Loader2, AlertTriangle,
  FileText, Download, Upload, Activity,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/integrations/")(
  { component: IntegrationsPage },
);

interface HRSystem {
  id: string;
  name: string;
  nameAr: string;
  logo: string;
  description: string;
  descriptionAr: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  modules: { name: string; nameAr: string; enabled: boolean }[];
  config: { baseUrl: string; apiKey: string; syncInterval: string };
}

function IntegrationsPage() {
  const { t, lang, isRTL } = useLanguage();
  const { role } = useAuth();
  const isAdmin = role === "ADMIN";

  const [systems, setSystems] = useState<HRSystem[]>([
    {
      id: "sap",
      name: "SAP SuccessFactors",
      nameAr: "ساب SuccessFactors",
      logo: "SAP",
      description: "Enterprise HCM suite — employee master data, org structure, payroll, and performance management",
      descriptionAr: "مجموعة إدارة رأس المال البشري — بيانات الموظفين والهيكل التنظيمي والرواتب وإدارة الأداء",
      status: "disconnected",
      modules: [
        { name: "Employee Central", nameAr: "مركز الموظفين", enabled: true },
        { name: "Org Structure", nameAr: "الهيكل التنظيمي", enabled: true },
        { name: "Performance & Goals", nameAr: "الأداء والأهداف", enabled: true },
        { name: "Compensation", nameAr: "التعويضات", enabled: false },
        { name: "Learning", nameAr: "التعلم", enabled: false },
        { name: "Recruiting", nameAr: "التوظيف", enabled: false },
      ],
      config: { baseUrl: "", apiKey: "", syncInterval: "daily" },
    },
    {
      id: "oracle",
      name: "Oracle HCM Cloud",
      nameAr: "أوراكل HCM السحابي",
      logo: "ORC",
      description: "Complete HR solution — workforce management, talent, payroll, and workforce analytics",
      descriptionAr: "حل موارد بشرية متكامل — إدارة القوى العاملة والمواهب والرواتب وتحليلات القوى العاملة",
      status: "disconnected",
      modules: [
        { name: "Core HR", nameAr: "الموارد البشرية الأساسية", enabled: true },
        { name: "Workforce Management", nameAr: "إدارة القوى العاملة", enabled: true },
        { name: "Talent Management", nameAr: "إدارة المواهب", enabled: true },
        { name: "Payroll", nameAr: "الرواتب", enabled: false },
        { name: "Benefits", nameAr: "المزايا", enabled: false },
        { name: "Analytics", nameAr: "التحليلات", enabled: true },
      ],
      config: { baseUrl: "", apiKey: "", syncInterval: "daily" },
    },
  ]);

  const [configOpen, setConfigOpen] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = async (systemId: string) => {
    const sys = systems.find((s) => s.id === systemId);
    if (!sys) return;
    if (!sys.config.baseUrl || !sys.config.apiKey) {
      toast.error(t("Please enter Base URL and API Key first", "يرجى إدخال عنوان URL ومفتاح API أولاً"));
      return;
    }

    setSyncing(systemId);
    // Simulate connection test
    await new Promise((r) => setTimeout(r, 2000));

    setSystems((prev) =>
      prev.map((s) =>
        s.id === systemId
          ? { ...s, status: "connected", lastSync: new Date().toISOString() }
          : s,
      ),
    );
    setSyncing(null);
    toast.success(t(`Connected to ${sys.name}`, `تم الاتصال بـ ${sys.nameAr}`));
  };

  const handleDisconnect = (systemId: string) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === systemId ? { ...s, status: "disconnected", lastSync: undefined } : s,
      ),
    );
    toast.success(t("Disconnected", "تم قطع الاتصال"));
  };

  const handleSync = async (systemId: string) => {
    setSyncing(systemId);
    await new Promise((r) => setTimeout(r, 3000));
    setSystems((prev) =>
      prev.map((s) =>
        s.id === systemId ? { ...s, lastSync: new Date().toISOString() } : s,
      ),
    );
    setSyncing(null);
    toast.success(t("Sync completed", "تم المزامنة بنجاح"));
  };

  const toggleModule = (systemId: string, moduleIdx: number) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === systemId
          ? {
              ...s,
              modules: s.modules.map((m, i) =>
                i === moduleIdx ? { ...m, enabled: !m.enabled } : m,
              ),
            }
          : s,
      ),
    );
  };

  const statusIcon = (status: string) => {
    if (status === "connected") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "error") return <AlertTriangle className="w-5 h-5 text-red-500" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const statusLabel = (status: string) => {
    if (status === "connected") return t("Connected", "متصل");
    if (status === "error") return t("Error", "خطأ");
    return t("Disconnected", "غير متصل");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader
        title="HR System Integrations"
        titleAr="تكامل أنظمة الموارد البشرية"
        description="Connect WPOS to your enterprise HR systems for seamless data sync"
        descriptionAr="اربط WPOS بأنظمة الموارد البشرية لمزامنة البيانات بسلاسة"
        currentLang={lang}
      />

      {/* Integration Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <Link2 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{systems.length}</p>
          <p className="text-xs text-gray-500">{t("Available Systems", "الأنظمة المتاحة")}</p>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{systems.filter((s) => s.status === "connected").length}</p>
          <p className="text-xs text-gray-500">{t("Connected", "متصل")}</p>
        </Card>
        <Card className="p-4 text-center">
          <Database className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{systems.reduce((sum, s) => sum + s.modules.filter((m) => m.enabled).length, 0)}</p>
          <p className="text-xs text-gray-500">{t("Active Modules", "الوحدات النشطة")}</p>
        </Card>
        <Card className="p-4 text-center">
          <Shield className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">OAuth 2.0</p>
          <p className="text-xs text-gray-500">{t("Auth Protocol", "بروتوكول المصادقة")}</p>
        </Card>
      </div>

      {/* Integration Data Flow */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("Data Flow Architecture", "هندسة تدفق البيانات")}</CardTitle>
        </CardHeader>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: <Users className="w-4 h-4" />, label: t("HR System", "نظام HR"), sublabel: "SAP / Oracle" },
              { icon: <ArrowRight className="w-4 h-4 text-blue-500" />, label: "", sublabel: "" },
              { icon: <Cloud className="w-4 h-4" />, label: t("API Gateway", "بوابة API"), sublabel: "REST / OData" },
              { icon: <ArrowRight className="w-4 h-4 text-blue-500" />, label: "", sublabel: "" },
              { icon: <Shield className="w-4 h-4" />, label: t("Transform", "تحويل"), sublabel: "ETL Layer" },
              { icon: <ArrowRight className="w-4 h-4 text-blue-500" />, label: "", sublabel: "" },
              { icon: <Database className="w-4 h-4" />, label: "WPOS", sublabel: "Supabase" },
            ].map((step, i) => (
              <div key={i} className={`flex flex-col items-center ${step.label ? "bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 min-w-[100px]" : ""}`}>
                {step.icon}
                {step.label && <span className="font-medium mt-1">{step.label}</span>}
                {step.sublabel && <span className="text-xs text-gray-400">{step.sublabel}</span>}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* HR System Cards */}
      <div className="space-y-6">
        {systems.map((sys) => (
          <Card key={sys.id}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${sys.id === "sap" ? "bg-blue-700" : "bg-red-600"}`}>
                    {sys.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lang === "ar" ? sys.nameAr : sys.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{lang === "ar" ? sys.descriptionAr : sys.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(sys.status)}
                  <span className={`text-sm font-medium ${sys.status === "connected" ? "text-green-600" : sys.status === "error" ? "text-red-600" : "text-gray-400"}`}>
                    {statusLabel(sys.status)}
                  </span>
                </div>
              </div>

              {/* Last Sync */}
              {sys.lastSync && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <Clock className="w-3 h-3" />
                  {t("Last synced:", "آخر مزامنة:")} {new Date(sys.lastSync).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}
                </div>
              )}

              {/* Modules */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("Modules", "الوحدات")}</p>
                <div className="flex flex-wrap gap-2">
                  {sys.modules.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => isAdmin && toggleModule(sys.id, i)}
                      disabled={!isAdmin}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${m.enabled ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-400" : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400"} ${isAdmin ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                      aria-label={`Toggle ${m.name}`}
                    >
                      {lang === "ar" ? m.nameAr : m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Config (expandable, admin only) */}
              {isAdmin && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <button
                    onClick={() => setConfigOpen(configOpen === sys.id ? null : sys.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    aria-label="Toggle configuration"
                  >
                    <Settings className="w-4 h-4" />
                    {t("Configuration", "الإعدادات")}
                  </button>

                  {configOpen === sys.id && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t("Base URL", "عنوان URL الأساسي")}</label>
                        <input
                          value={sys.config.baseUrl}
                          onChange={(e) => setSystems((prev) => prev.map((s) => s.id === sys.id ? { ...s, config: { ...s.config, baseUrl: e.target.value } } : s))}
                          placeholder={sys.id === "sap" ? "https://api.successfactors.com/odata/v2" : "https://your-instance.oraclecloud.com/hcmRestApi/resources"}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t("API Key / OAuth Token", "مفتاح API / رمز OAuth")}</label>
                        <input
                          type="password"
                          value={sys.config.apiKey}
                          onChange={(e) => setSystems((prev) => prev.map((s) => s.id === sys.id ? { ...s, config: { ...s.config, apiKey: e.target.value } } : s))}
                          placeholder="••••••••••••••••"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t("Sync Interval", "فترة المزامنة")}</label>
                        <select
                          value={sys.config.syncInterval}
                          onChange={(e) => setSystems((prev) => prev.map((s) => s.id === sys.id ? { ...s, config: { ...s.config, syncInterval: e.target.value } } : s))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="realtime">{t("Real-time", "فوري")}</option>
                          <option value="hourly">{t("Hourly", "كل ساعة")}</option>
                          <option value="daily">{t("Daily", "يومي")}</option>
                          <option value="weekly">{t("Weekly", "أسبوعي")}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    {sys.status === "connected" ? (
                      <>
                        <button onClick={() => handleSync(sys.id)} disabled={syncing === sys.id} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                          {syncing === sys.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          {t("Sync Now", "مزامنة الآن")}
                        </button>
                        <button onClick={() => handleDisconnect(sys.id)} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          {t("Disconnect", "قطع الاتصال")}
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleConnect(sys.id)} disabled={syncing === sys.id} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                        {syncing === sys.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                        {t("Connect", "اتصال")}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Supported Data Types */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("Supported Data Types", "أنواع البيانات المدعومة")}</CardTitle>
        </CardHeader>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users className="w-5 h-5 text-blue-600" />, name: t("Employees", "الموظفين"), desc: t("Master data, profiles", "البيانات الأساسية، الملفات") },
            { icon: <Activity className="w-5 h-5 text-green-600" />, name: t("Performance", "الأداء"), desc: t("Goals, reviews, KPIs", "الأهداف، المراجعات، المؤشرات") },
            { icon: <FileText className="w-5 h-5 text-purple-600" />, name: t("Org Structure", "الهيكل التنظيمي"), desc: t("Departments, teams, hierarchy", "الإدارات، الفرق، التسلسل") },
            { icon: <Download className="w-5 h-5 text-orange-600" />, name: t("Competencies", "الكفاءات"), desc: t("Skills, certifications", "المهارات، الشهادات") },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="mx-auto mb-2 w-fit">{item.icon}</div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
