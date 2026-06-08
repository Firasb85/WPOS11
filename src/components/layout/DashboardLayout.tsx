import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const DARK_KEY = "wpos_dark_mode";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(DARK_KEY) === "true";
    } catch {
      return false;
    }
  });
  const location = useLocation();

  // Persist dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      window.localStorage.setItem(DARK_KEY, String(isDark));
    } catch {
      // localStorage unavailable
    }
  }, [isDark]);

  // Auto-close sidebar on mobile after navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
      />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
