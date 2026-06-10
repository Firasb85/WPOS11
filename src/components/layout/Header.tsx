import { Menu, Search, Bell, User, Globe, LogOut, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { ROLE_LABELS } from "@/routes/_authenticated";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    router.navigate({ to: "/login" });
  };

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
    : user?.email?.split("@")[0] || "User";

  const roleLabel = lang === "ar"
    ? (ROLE_LABELS[role]?.ar ?? role)
    : (ROLE_LABELS[role]?.en ?? role);

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    CEO: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    MANAGER: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    USER: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30" role="banner">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors" aria-label="Toggle navigation menu">
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl px-4 py-2.5 w-72 transition-all focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:bg-white dark:focus-within:bg-gray-800">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input id="header-search" type="text" placeholder={t("Search anything…", "ابحث عن أي شيء…")} className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 w-full" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Language toggle */}
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors" aria-label={`Switch to ${lang === "en" ? "Arabic" : "English"}`}>
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-600 dark:text-gray-400 text-xs">{lang === "en" ? "عربي" : "EN"}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* User profile */}
        <button onClick={() => navigate({ to: "/profile" })} className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group" aria-label="User profile">
          <div className="hidden md:block text-end">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{displayName}</p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 ${roleBadgeColor[role] || roleBadgeColor.USER}`}>
              {roleLabel}
            </span>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group" aria-label="Sign out" title={t("Sign out", "تسجيل الخروج")}>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
}
