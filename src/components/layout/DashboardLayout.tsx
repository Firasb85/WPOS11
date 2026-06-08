import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const DARK_KEY = "wpos_dark_mode";
const SIDEBAR_KEY = "wpos_sidebar_open";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.localStorage.getItem(SIDEBAR_KEY) !== "false";
    } catch {
      return true;
    }
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(DARK_KEY) === "true";
    } catch {
      return false;
    }
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      window.localStorage.setItem(DARK_KEY, String(isDark));
    } catch {
      /* noop */
    }
  }, [isDark]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // Auto-close on mobile after navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
      />
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}
      >
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
