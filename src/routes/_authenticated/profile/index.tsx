import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  User, Mail, Phone, Shield, Globe, Moon, Sun, Key,
  Camera, Save, Loader2, Clock, Calendar,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile/")(
  { component: ProfilePage },
);

function ProfilePage() {
  const { t, lang, setLang, isRTL } = useLanguage();
  const { user, role } = useAuth();

  const meta = user?.user_metadata ?? {};
  const [firstName, setFirstName] = useState(meta.first_name || "");
  const [lastName, setLastName] = useState(meta.last_name || "");
  const [phone, setPhone] = useState(meta.phone || "");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName, phone },
      });
      if (error) throw error;
      toast.success(t("Profile updated successfully", "تم تحديث الملف الشخصي بنجاح"));
    } catch {
      toast.error(t("Failed to update profile", "فشل تحديث الملف الشخصي"));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error(t("Password must be at least 8 characters", "يجب أن تكون كلمة المرور 8 أحرف على الأقل"));
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success(t("Password changed successfully", "تم تغيير كلمة المرور بنجاح"));
      setNewPassword("");
    } catch {
      toast.error(t("Failed to change password", "فشل تغيير كلمة المرور"));
    } finally {
      setChangingPassword(false);
    }
  };

  const roleBadge: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    CEO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    USER: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader
        title="My Profile"
        titleAr="ملفي الشخصي"
        description="Manage your account settings and preferences"
        descriptionAr="إدارة إعدادات حسابك وتفضيلاتك"
        currentLang={lang}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="p-6 text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${roleBadge[role] || roleBadge.USER}`}>
              {role}
            </span>

            <div className="mt-6 space-y-3 text-sm text-left">
              <div className="flex items-center gap-3 text-gray-500">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{t("Member since", "عضو منذ")}</p>
                  <p className="text-gray-700 dark:text-gray-300">{createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{t("Last sign in", "آخر تسجيل دخول")}</p>
                  <p className="text-gray-700 dark:text-gray-300">{lastSignIn}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Personal Information", "المعلومات الشخصية")}</CardTitle>
            </CardHeader>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("First Name", "الاسم الأول")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("Last Name", "اسم العائلة")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("Email", "البريد الإلكتروني")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={user?.email || ""} disabled className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("Phone", "الهاتف")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("+966 5x xxx xxxx", "+966 5x xxx xxxx")} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t("Save Changes", "حفظ التغييرات")}
              </button>
            </div>
          </Card>

          {/* Language Preference */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Language & Appearance", "اللغة والمظهر")}</CardTitle>
            </CardHeader>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLang("en")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${lang === "en" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700" : "border-gray-300 dark:border-gray-700 text-gray-600 hover:bg-gray-50"}`}
                >
                  <Globe className="w-4 h-4" /> English
                </button>
                <button
                  onClick={() => setLang("ar")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${lang === "ar" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700" : "border-gray-300 dark:border-gray-700 text-gray-600 hover:bg-gray-50"}`}
                >
                  <Globe className="w-4 h-4" /> العربية
                </button>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Change Password", "تغيير كلمة المرور")}</CardTitle>
            </CardHeader>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("New Password", "كلمة المرور الجديدة")}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={8} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1">{t("Minimum 8 characters", "8 أحرف كحد أدنى")}</p>
              </div>
              <button onClick={handleChangePassword} disabled={changingPassword || newPassword.length < 8} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {t("Update Password", "تحديث كلمة المرور")}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
