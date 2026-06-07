import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  GitMerge,
  Gauge,
  Camera,
  ClipboardCheck,
  Stethoscope,
  FileBarChart,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  GitBranch,
  Users,
  UserCircle,
  GitFork,
  FolderTree,
  Layers,
  FileText,
  Library,
  ListOrdered,
  Tags,
  List,
  PlusCircle,
  Upload,
  FileSearch,
  Download,
  Shield,
  ScrollText,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Brain,
  Activity,
  CreditCard,
  Zap,
  Cpu,
  Play,
  AlertTriangle,
  Share2,
  Grid3x3,
  Monitor,
  Target,
  FolderOpen,
  Database,
  Bell,
  Award,
  Clock,
  Key,
  Bot,
  Search,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { navigation } from "../../lib/constants/navigation";
import { APP_NAME } from "../../lib/constants";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import type { NavItem } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Briefcase,
  GitMerge,
  Gauge,
  Camera,
  ClipboardCheck,
  Stethoscope,
  FileBarChart,
  Settings,
  Building,
  GitBranch,
  Users,
  UserCircle,
  GitFork,
  FolderTree,
  Layers,
  FileText,
  Library,
  ListOrdered,
  Tags,
  List,
  PlusCircle,
  Upload,
  FileSearch,
  Download,
  Shield,
  ScrollText,
  BarChart3,
  Brain,
  Activity,
  CreditCard,
  Zap,
  Cpu,
  Play,
  AlertTriangle,
  Share2,
  Grid3x3,
  Monitor,
  Target,
  FolderOpen,
  Database,
  Bell,
  Award,
  Clock,
  Key,
  Bot,
  Search,
  BookOpen,
  TrendingUp,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle, isDark, onThemeToggle }: SidebarProps) {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState<string[]>(["/dashboard"]);
  const toggle = (href: string) =>
    setExpanded((p) => (p.includes(href) ? p.filter((i) => i !== href) : [...p, href]));

  const renderItem = (item: NavItem, depth = 0) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const active = location.pathname.startsWith(item.href);
    const isExpanded = expanded.includes(item.href);
    const label = lang === "ar" ? item.labelAr : item.label;

    return (
      <div key={item.href}>
        <Link
          to={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all no-underline ${
            active
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => hasChildren && toggle(item.href)}
          aria-current={active ? "page" : undefined}
        >
          <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          {isOpen && (
            <>
              <span className="flex-1 truncate">{label}</span>
              {hasChildren && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </Link>
        {hasChildren && isExpanded && isOpen && (
          <div className="mt-0.5">
            {item.children!.map((c: NavItem) => renderItem(c, depth + 1))}
          </div>
        )}
      </div>
    );
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isOpen ? "w-64" : "w-0 lg:w-16"} overflow-hidden lg:overflow-visible`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">WP</span>
          </div>
          {isOpen && (
            <span className="font-bold text-gray-900 dark:text-white text-lg">{APP_NAME}</span>
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
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {navigation.map((item) => renderItem(item))}
        </nav>
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
            <button
              onClick={onThemeToggle}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? t("Light Mode", "الوضع الفاتح") : t("Dark Mode", "الوضع الداكن")}
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
              <LogOut className="w-4 h-4" />
              {t("Logout", "تسجيل الخروج")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
