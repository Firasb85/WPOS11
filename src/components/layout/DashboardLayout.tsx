import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { initTheme, getResolvedTheme, getStoredTheme } from "@/lib/stores/theme";

const SIDEBAR_KEY = "wpos_sidebar_open";

export function DashboardLayout() {
  const { isRTL } = useLanguage();

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
        <main className="p-4 lg:p-5 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
