import { useState, useEffect, useCallback } from "react";
import { Menu, Search, Bell, User, Globe, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { ROLE_LABELS } from "@/routes/_authenticated";
import { getStoredTheme, setTheme, getResolvedTheme, type Theme } from "@/lib/stores/theme";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();

  const [currentTheme, setCurrentTheme] = useState<Theme>(getStoredTheme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Listen for theme changes from other sources
  const onThemeChanged = useCallback(() => setCurrentTheme(getStoredTheme()), []);
  useEffect(() => {
    window.addEventListener("wpos:theme-changed", onThemeChanged);
    return () => window.removeEventListener("wpos:theme-changed", onThemeChanged);
  }, [onThemeChanged]);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
    setShowThemeMenu(false);
  };

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

  const resolved = getResolvedTheme(currentTheme);
  const ThemeIcon = resolved === "dark" ? Moon : Sun;

  const themeOptions: { value: Theme; label: string; labelAr: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", labelAr: "فاتح", icon: Sun },
    { value: "dark", label: "Dark", labelAr: "داكن", icon: Moon },
    { value: "system", label: "System", labelAr: "تلقائي", icon: Monitor },
  ];

  return (
    <header className="h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between px-4 lg:px-5 sticky top-0 z-30" role="banner">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors" aria-label="Toggle menu">
          <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg px-3 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-white dark:focus-within:bg-gray-800">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder={t("Search…", "بحث…")} className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 w-full" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Language */}
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label={t("Switch language", "تبديل اللغة")}>
          <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{lang === "en" ? "عربي" : "EN"}</span>
        </button>

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={t("Toggle theme", "تبديل المظهر")}
          >
            <ThemeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showThemeMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
              <div className="absolute end-0 top-full mt-1 z-50 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = currentTheme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleThemeChange(opt.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      <Icon className="w-4 h-4" />
                      {lang === "ar" ? opt.labelAr : opt.label}
                      {isActive && <span className="ms-auto text-blue-600 dark:text-blue-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label={t("Notifications", "الإشعارات")}>
          <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>

        <div className="w-px h-7 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* User */}
        <button onClick={() => navigate({ to: "/profile" })} className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group" aria-label="Profile">
          <div className="hidden md:block text-end">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{displayName}</p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${roleBadgeColor[role] || roleBadgeColor.USER}`}>
              {roleLabel}
            </span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group" aria-label={t("Sign out", "تسجيل الخروج")}>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
}
