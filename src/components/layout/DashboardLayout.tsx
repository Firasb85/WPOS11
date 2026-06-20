import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { initTheme, getResolvedTheme, getStoredTheme } from "@/lib/stores/theme";
import { useOrgTier } from "@/lib/stores/organization-tier";
import { Clock } from "lucide-react";

const SIDEBAR_KEY = "wpos_sidebar_open";

export function DashboardLayout() {
  const { isRTL, lang, t } = useLanguage();
  const { current: orgTier } = useOrgTier();

  // Initialize theme on mount
  useEffect(() => { initTheme(); }, []);

  // Track dark mode for sidebar prop
  const [isDark, setIsDark] = useState(() => getResolvedTheme() === "dark");
  const onThemeChanged = useCallback(() => {
    setIsDark(getResolvedTheme(getStoredTheme()) === "dark");
  }, []);
  useEffect(() => {
    window.addEventListener("wpos:theme-changed", onThemeChanged);
    return () => window.removeEventListener("wpos:theme-changed", onThemeChanged);
  }, [onThemeChanged]);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return window.localStorage.getItem(SIDEBAR_KEY) !== "false"; } catch { return true; }
  });
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try { window.localStorage.setItem(SIDEBAR_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarMargin = sidebarOpen
    ? isRTL ? "lg:mr-60" : "lg:ml-60"
    : isRTL ? "lg:mr-[52px]" : "lg:ml-[52px]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090d14] transition-colors duration-200" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isDark={isDark} />
      <div className={`transition-all duration-200 ease-out ${sidebarMargin}`}>
        <Header onMenuToggle={toggleSidebar} />

        {/* Pilot-tier banner — visible whenever the org is on Pilot,
            with a stronger callout when expiry is within 14 days. */}
        {orgTier.isPilot && (
          <div
            className={`mx-4 lg:mx-5 mt-4 rounded-lg border px-4 py-2.5 flex items-center gap-3 text-sm ${
              orgTier.pilotExpiringSoon
                ? "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200"
                : "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
            }`}
            role="status"
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold">
                {t("Pilot Plan", "خطة تجريبية")}
              </span>
              {orgTier.pilotDaysRemaining != null && (
                <span className="ms-2 text-xs opacity-80">
                  {t(
                    `${orgTier.pilotDaysRemaining} days remaining`,
                    `${orgTier.pilotDaysRemaining} يوم متبقي`,
                  )}
                </span>
              )}
              {orgTier.pilotExpiringSoon && (
                <span className="ms-2 text-xs font-medium">
                  {t("— contact your account manager to upgrade.", "— تواصل مع مدير حسابك للترقية.")}
                </span>
              )}
            </div>
            {orgTier.scopeDepartmentId && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/60 dark:bg-black/30">
                {t(
                  `Scope: 1 department`,
                  `النطاق: إدارة واحدة`,
                )}
              </span>
            )}
          </div>
        )}

        <main className="p-4 lg:p-5 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
