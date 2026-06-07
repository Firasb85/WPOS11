import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { FormInput, FormSelect } from "~/components/wpos/FormInput";
import { Shield, Save, Lock, Key, Globe, Clock } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/admin/security")({ component: SecurityPage });
function SecurityPage() {
  const { data: metrics } = useCeoDashboard();
  const l = "ar";
  return (
    <div>
      <PageHeader
        title="Enterprise Security"
        titleAr="الأمن المؤسسي"
        description="SSO, MFA, encryption, IP restrictions, and session controls"
        descriptionAr="SSO و MFA والتشفير وتقييد IP وعناصر التحكم في الجلسة"
        currentLang={l}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Lock className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "المصادقة" : "Authentication"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {l === "ar" ? "مصادقة متعددة العوامل (MFA)" : "Multi-Factor Authentication"}
              </span>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {l === "ar" ? "تسجيل الدخول الموحد (SSO)" : "Single Sign-On"}
              </span>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{l === "ar" ? "تشفير البيانات" : "Data Encryption"}</span>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <FormSelect
              label={l === "ar" ? "مهلة الجلسة (دقيقة)" : "Session Timeout (min)"}
              labelAr="مهلة الجلسة"
              options={[
                { value: "30", label: "30 minutes" },
                { value: "60", label: "60 minutes" },
                { value: "120", label: "120 minutes" },
                { value: "240", label: "4 hours" },
              ]}
              value="60"
              currentLang={l}
            />
            <FormSelect
              label={l === "ar" ? "الحد الأقصى لمحاولات الدخول" : "Max Login Attempts"}
              labelAr="محاولات الدخول"
              options={[
                { value: "3", label: "3" },
                { value: "5", label: "5" },
                { value: "10", label: "10" },
              ]}
              value="5"
              currentLang={l}
            />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Globe className="w-4 h-4 inline mr-1" />
              {l === "ar" ? "تقييد IP وضوابط الوصول" : "IP Restrictions & Access"}
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <FormTextarea
              label={l === "ar" ? "قائمة IP المسموح بها" : "Allowed IP Whitelist"}
              labelAr="قائمة IP"
              placeholder={
                l === "ar" ? "أدخل عناوين IP مفصولة بفواصل" : "Enter comma-separated IPs"
              }
              currentLang={l}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {l === "ar" ? "تقييد الوصول حسب IP" : "Restrict by IP"}
              </span>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="w-4 h-4" />
          <span>{l === "ar" ? "حفظ الإعدادات الأمنية" : "Save Security Settings"}</span>
        </button>
      </div>
    </div>
  );
}
function FormTextarea(props: Record<string, string>) {
  return (
    <div className="space-y-1.5">
      {props.label && (
        <label className="block text-sm font-medium text-gray-700">
          {props.currentLang === "ar" && props.labelAr ? props.labelAr : props.label}
        </label>
      )}
      <textarea
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none min-h-[80px]"
        placeholder={props.placeholder || ""}
        {...props}
      />
    </div>
  );
}
