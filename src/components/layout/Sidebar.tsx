import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Building2, Briefcase, GitMerge, Gauge, Camera,
  ClipboardCheck, Stethoscope, FileBarChart, Settings, ChevronDown,
  ChevronLeft, ChevronRight, X, Building, GitBranch, Users, UserCircle,
  GitFork, FolderTree, Layers, FileText, Library, ListOrdered, Tags,
  List, PlusCircle, Upload, FileSearch, Download, Shield, ScrollText,
  BarChart3, LogOut, Moon, Sun, Brain, Activity, CreditCard, Zap, Cpu,
  Play, AlertTriangle, Share2, Grid3x3, Monitor, Target, FolderOpen,
  Database, Bell, Award, Clock, Key, Bot, Search, BookOpen, TrendingUp,
  ClipboardList, Layout,
} from "lucide-react";
import { navigation } from "../../lib/constants/navigation";
import type { SecureNavItem, Role } from "../../lib/wpos/constants/navigation";
import { APP_NAME } from "../../lib/constants";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { isModuleVisible } from "@/lib/stores/module-visibility";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Building2, Briefcase, GitMerge, Gauge, Camera,
  ClipboardCheck, Stethoscope, FileBarChart, Settings, Building,
  GitBranch, Users, UserCircle, GitFork, FolderTree, Layers, FileText,
  Library, ListOrdered, Tags, List, PlusCircle, Upload, FileSearch,
  Download, Shield, ScrollText, BarChart3, Brain, Activity, CreditCard,
  Zap, Cpu, Play, AlertTriangle, Share2, Grid3x3, Monitor, Target,
  FolderOpen, Database, Bell, Award, Clock, Key, Bot, Search, BookOpen,
  TrendingUp, ClipboardList, Layout,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

/* ── Filtering logic ─────────────────────────────────── */

/**
 * Returns true if the nav item should be visible for this role.
 *   1. Check allowedRoles (role-based)
 *   2. Check moduleKey  (admin-controlled visibility)
 */
function isItemAllowed(item: SecureNavItem, role: Role): boolean {
  // Role check
  if (item.allowedRoles && item.allowedRoles.length > 0) {
    if (!item.allowedRoles.includes(role)) return false;
  }
  // Module visibility check (admin toggle)
  if (item.moduleKey && !isModuleVisible(item.moduleKey)) return false;
  return true;
}

/**
 * Recursively filter nav items for the current role + module visibility.
 * A parent is shown only if it has at least one visible child (or no children).
 */
function filterNavItems(items: SecureNavItem[], role: Role): SecureNavItem[] {
  const result: SecureNavItem[] = [];
  for (const item of items) {
    if (!isItemAllowed(item, role)) continue;

    if (item.children && item.children.length > 0) {
      const filteredChildren = filterNavItems(item.children, role);
      if (filteredChildren.length > 0) {
        result.push({ ...item, children: filteredChildren });
      }
      // If a parent has children but none are visible, skip the parent
    } else {
      result.push(item);
    }
  }
  return result;
}

/* ── Component ───────────────────────────────────────── */

export function Sidebar({ isOpen, onToggle, isDark, onThemeToggle }: SidebarProps) {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const { role, signOut } = useAuth();

  // Filter navigation for the current user's role
  const visibleNav = filterNavItems(navigation as SecureNavItem[], role as Role);

  // Re-render when admin changes module visibility
  const [, setTick] = useState(0);
  const onVisChange = useCallback(() => setTick((n) => n + 1), []);
  useEffect(() => {
    window.addEventListener("wpos:module-visibility-changed", onVisChange);
    return () => window.removeEventListener("wpos:module-visibility-changed", onVisChange);
  }, [onVisChange]);

  // Auto-expand parent sections whose children match the current path
  const getInitialExpanded = (): string[] => {
    const result: string[] = [];
    for (const item of visibleNav) {
      if (item.children) {
        const childActive = item.children.some(
          (child) =>
            location.pathname === child.href ||
            location.pathname.startsWith(child.href + "/"),
        );
        if (childActive) result.push(item.href);
      }
    }
    // Always expand Dashboards by default
    if (!result.includes("/dashboard")) result.push("/dashboard");
    return result;
  };

  const [expanded, setExpanded] = useState<string[]>(getInitialExpanded);
  const toggle = (href: string) =>
    setExpanded((p) =>
      p.includes(href) ? p.filter((i) => i !== href) : [...p, href],
    );

  const isItemActive = (item: SecureNavItem): boolean => {
    if (
      location.pathname === item.href ||
      location.pathname.startsWith(item.href + "/")
    )
      return true;
    if (item.children)
      return item.children.some((child) => isItemActive(child));
    return false;
  };

  const renderItem = (item: SecureNavItem, depth = 0) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const active = isItemActive(item);
    const isExpanded = expanded.includes(item.href);
    const label = lang === "ar" ? item.labelAr : item.label;

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        toggle(item.href);
      }
    };

    const sharedClasses = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all no-underline ${
      active
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }`;

    return (
      <div key={item.href + item.label}>
        {hasChildren ? (
          <button
            type="button"
            className={`${sharedClasses} w-full`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
            onClick={handleClick}
            aria-expanded={isExpanded}
          >
            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {isOpen && (
              <>
                <span className="flex-1 truncate text-left">{label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        ) : (
          <Link
            to={item.href}
            className={sharedClasses}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {isOpen && <span className="flex-1 truncate">{label}</span>}
          </Link>
        )}
        {hasChildren && isExpanded && isOpen && (
          <div className="mt-0.5">
            {item.children!.map((c) => renderItem(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Role badge colors
  const roleBadge: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    CEO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    USER: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          role="presentation"
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 lg:w-16"
        } overflow-hidden lg:overflow-visible`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">WP</span>
          </div>
          {isOpen && (
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              {APP_NAME}
            </span>
          )}
          {isOpen && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden ml-auto"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 z-10"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        {/* Role badge */}
        {isOpen && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[role] || roleBadge.USER}`}
            >
              {role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {visibleNav.map((item) => renderItem(item))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
            <button
              onClick={onThemeToggle}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {isDark
                ? t("Light Mode", "الوضع الفاتح")
                : t("Dark Mode", "الوضع الداكن")}
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
            >
              <LogOut className="w-4 h-4" />
              {t("Logout", "تسجيل الخروج")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
