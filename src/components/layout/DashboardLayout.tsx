import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";

const DARK_KEY = "wpos_dark_mode";
const SIDEBAR_KEY = "wpos_sidebar_open";

export function DashboardLayout() {
  const { isRTL } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return window.localStorage.getItem(SIDEBAR_KEY) !== "false"; } catch { return true; }
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem(DARK_KEY) === "true"; } catch { return false; }
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try { window.localStorage.setItem(DARK_KEY, String(isDark)); } catch {}
  }, [isDark]);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      <div className={`transition-all duration-200 ease-out ${sidebarMargin}`}>
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-5 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
