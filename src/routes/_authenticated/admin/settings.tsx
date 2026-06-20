import { createFileRoute } from "@tanstack/react-router";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { Save, Clock, ShieldCheck } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useOrgTier, type OrgTier } from "@/lib/stores/organization-tier";
import { isFeatureEnabled } from "@/lib/security/feature-flags";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });
function SettingsPage() {
  const { t } = useLanguage();
  const { data: _metrics, isLoading: _metricsLoading } = useCeoDashboard();
  const { current: orgTier, setTier } = useOrgTier();
  const advancedFlag = isFeatureEnabled("advanced_modules", "ADMIN");

  const handleTierChange = (tier: OrgTier) => {
    setTier(tier);
    toast.success(t(`Plan updated to ${tier}.`, `تم تحديث الخطة إلى ${tier}.`));
  };

  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader title={t("System Settings", "إعدادات النظام")} description="Configure system preferences" />

        {/* ── Plan / Org Tier ── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <ShieldCheck className="w-4 h-4 inline mr-2" />
              {t("Plan & Scope", "الخطة والنطاق")}
            </CardTitle>
          </CardHeader>
          <p className="text-xs text-gray-500 mb-4">
            {t(
              "Pilot orgs run on the Core workflow only, scoped to one department, with a 90-day evaluation window.",
              "تعمل المنظمات التجريبية على سير العمل الأساسي فقط، مع نطاق إدارة واحدة، ونافذة تقييم 90 يوماً.",
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("Plan Tier", "مستوى الخطة")}
              </label>
              <select
                value={orgTier.tier}
                onChange={(e) => handleTierChange(e.target.value as OrgTier)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white dark:bg-gray-900"
              >
                <option value="pilot">{t("Pilot", "تجريبي")}</option>
                <option value="starter">{t("Starter", "مبتدئ")}</option>
                <option value="professional">{t("Professional", "محترف")}</option>
                <option value="enterprise">{t("Enterprise", "مؤسسي")}</option>
                <option value="unlimited">{t("Unlimited", "غير محدود")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("Scope Department", "نطاق الإدارة")}
              </label>
              <input
                value={orgTier.scopeDepartmentId ?? ""}
                onChange={(e) => {
                  // Local-only — production wires to companies.scope_department_id.
                  toast.info(t("Saved locally (preview mode).", "تم الحفظ محلياً (وضع المعاينة)."));
                }}
                placeholder={t("e.g. dept-customer-success", "مثال: إدارة-خدمة-العملاء")}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                disabled={!orgTier.isPilot}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                {t(
                  "Pilot orgs are scoped to a single department.",
                  "المنظمات التجريبية محصورة بإدارة واحدة.",
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <Clock className="w-3.5 h-3.5 inline me-1" />
                {t("Pilot Expiry", "انتهاء التجربة")}
              </label>
              <input
                type="date"
                value={
                  orgTier.pilotExpiresAt
                    ? new Date(orgTier.pilotExpiresAt).toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) => {
                  toast.info(t("Saved locally (preview mode).", "تم الحفظ محلياً (وضع المعاينة)."));
                }}
                disabled={!orgTier.isPilot}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
              {orgTier.pilotDaysRemaining != null && (
                <p className="text-[10px] text-gray-400 mt-1">
                  {t(
                    `${orgTier.pilotDaysRemaining} days remaining`,
                    `${orgTier.pilotDaysRemaining} يوم متبقي`,
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={advancedFlag}
                disabled={orgTier.isPilot}
                onChange={() => toast.info(
                  t(
                    "Use the database or feature-flag config to flip Advanced on for non-Pilot tiers.",
                    "استخدم قاعدة البيانات أو إعدادات feature flag لتفعيل المتقدم للأدوات غير التجريبية.",
                  ),
                )}
              />
              <div>
                <p className="text-sm font-medium">
                  {t("Show Advanced modules", "إظهار الوحدات المتقدمة")}
                </p>
                <p className="text-xs text-gray-500">
                  {t(
                    orgTier.isPilot
                      ? "Disabled — Pilot orgs cannot enable Advanced modules."
                      : "Off by default. Enable to expose Job Architecture, Digital Twin, etc.",
                    orgTier.isPilot
                      ? "معطل — لا تستطيع المنظمات التجريبية تفعيل الوحدات المتقدمة."
                      : "معطل افتراضياً. فعّل لإظهار هيكل الوظائف والتوأم الرقمي وغيرها.",
                  )}
                </p>
              </div>
            </label>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">System Name</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="WPOS - Workforce Performance Operating System"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">System Email</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="admin@wpos.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Language</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="ar"
                >
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Theme</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="light"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Confidence Threshold</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="70"
                >
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Max Hypotheses</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="3"
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Evidence Reliability Min</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="medium"
                >
                  <option value="low">{t("Low", "منخفض")}</option>
                  <option value="medium">{t("Medium", "متوسط")}</option>
                  <option value="high">{t("High", "مرتفع")}</option>
                </select>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {["Email Notifications", "Critical KPI Alerts", "Report Review Notifications"].map(
                (n) => (
                  <div key={n} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{n}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ),
              )}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Password Policy</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="strong"
                >
                  <option value="standard">Standard</option>
                  <option value="strong">Strong</option>
                  <option value="very_strong">Very Strong</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Session Duration</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="24"
                >
                  <option value="8">8 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="72">72 Hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Factor Auth</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </PermissionGuard>
  );
}
