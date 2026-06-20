import { useState, useEffect, useCallback } from "react";
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
  Search,
  BookOpen,
  TrendingUp,
  ClipboardList,
  Layout,
  Link2,
  Sparkles,
  Workflow,
  FlaskConical,
} from "lucide-react";
import { navigation, type SecureNavItem, type Role } from "@/lib/wpos/constants/navigation";
import { APP_NAME } from "@/lib/constants";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/routes/_authenticated";
import { isModuleVisible } from "@/lib/stores/module-visibility";
import { useOrgTier, isAdvancedVisible, type OrgTier } from "@/lib/stores/organization-tier";
import { isFeatureEnabled } from "@/lib/security/feature-flags";

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
  Search,
  BookOpen,
  TrendingUp,
  ClipboardList,
  Layout,
  Link2,
  Sparkles,
  Workflow,
  FlaskConical,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
}

/* ── Role-based + admin-controlled + tier-based filtering ─────────── */

function isAllowed(item: SecureNavItem, userRole: Role, advancedVisible: boolean): boolean {
  if (item.allowedRoles && item.allowedRoles.length > 0) {
    if (!item.allowedRoles.includes(userRole)) return false;
  }
  if (item.moduleKey && !isModuleVisible(item.moduleKey)) return false;
  if (item.section === "advanced" && !advancedVisible) return false;
  return true;
}

function filterNav(items: SecureNavItem[], userRole: Role, advancedVisible: boolean): SecureNavItem[] {
  const out: SecureNavItem[] = [];
  for (const item of items) {
    if (!isAllowed(item, userRole, advancedVisible)) continue;
    if (item.children && item.children.length > 0) {
      const kids = filterNav(item.children, userRole, advancedVisible);
      if (kids.length > 0) out.push({ ...item, children: kids });
    } else {
      out.push(item);
    }
  }
  return out;
}

/* ── Tier chip — small badge showing the current org plan ── */

const TIER_STYLES: Record<OrgTier, { bg: string; text: string; icon: string }> = {
  pilot:       { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300", icon: "🧪" },
  starter:     { bg: "bg-gray-100 dark:bg-gray-800",       text: "text-gray-700 dark:text-gray-300",     icon: "•" },
  professional:{ bg: "bg-blue-100 dark:bg-blue-900/40",    text: "text-blue-800 dark:text-blue-300",     icon: "★" },
  enterprise:  { bg: "bg-purple-100 dark:bg-purple-900/40",text: "text-purple-800 dark:text-purple-300", icon: "◆" },
  unlimited:   { bg: "bg-indigo-100 dark:bg-indigo-900/40",text: "text-indigo-800 dark:text-indigo-300", icon: "✦" },
};

function TierChip({ tier }: { tier: OrgTier }) {
  const s = TIER_STYLES[tier] ?? TIER_STYLES.pilot;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}
      title={`Current plan: ${tier}`}
    >
      <span aria-hidden="true">{s.icon}</span>
      {tier}
    </span>
  );
}

/* ── Sidebar Component ───────────────────────────────── */

export function Sidebar({ isOpen, onToggle, isDark }: SidebarProps) {
  const location = useLocation();
  const { lang, t, isRTL } = useLanguage();
  const { role, signOut } = useAuth();

  /* Cast role to our Role type — useAuth returns string */
  const userRole: Role = (
    ["ADMIN", "CEO", "MANAGER", "USER"].includes(role) ? role : "USER"
  ) as Role;

  /* Org tier + Advanced flag determine whether Advanced modules are visible */
  const { current: orgTier } = useOrgTier();
  const advancedFlag = isFeatureEnabled("advanced_modules", userRole);
  const advancedVisible = isAdvancedVisible(orgTier, advancedFlag);

  /* Filter navigation based on role + module visibility + tier */
  const visibleNav = filterNav(navigation, userRole, advancedVisible);

  /* Re-render when admin toggles module visibility or org tier changes */
  const [, setTick] = useState(0);
  const onVisChange = useCallback(() => setTick((n) => n + 1), []);
  useEffect(() => {
    window.addEventListener("wpos:module-visibility-changed", onVisChange);
    window.addEventListener("wpos:org-tier-changed", onVisChange);
    return () => {
      window.removeEventListener("wpos:module-visibility-changed", onVisChange);
      window.removeEventListener("wpos:org-tier-changed", onVisChange);
    };
  }, [onVisChange]);

  /* Auto-expand sections with active children */
  const getInitialExpanded = (): string[] => {
    const result: string[] = ["/dashboard"];
    for (const item of visibleNav) {
      if (item.children) {
        const childActive = item.children.some(
          (c) => location.pathname === c.href || location.pathname.startsWith(c.href + "/"),
        );
        if (childActive && !result.includes(item.href)) result.push(item.href);
      }
    }
    return result;
  };

  const [expanded, setExpanded] = useState<string[]>(getInitialExpanded);
  const toggle = (href: string) =>
    setExpanded((p) => (p.includes(href) ? p.filter((i) => i !== href) : [...p, href]));

  const isActive = (item: SecureNavItem): boolean => {
    if (location.pathname === item.href || location.pathname.startsWith(item.href + "/"))
      return true;
    if (item.children) return item.children.some((c) => isActive(c));
    return false;
  };

  const renderItem = (item: SecureNavItem, depth = 0) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const hasKids = (item.children?.length ?? 0) > 0;
    const active = isActive(item);
    const open = expanded.includes(item.href);
    const label = lang === "ar" ? item.labelAr : item.label;
    const tooltip = !isOpen ? label : undefined;

    // Active item: subtle bg + left-bar accent (instead of full blue fill).
    // Matches the visual language used elsewhere (diagnostic cards, hypothesis
    // left-stripe accents) for consistency across the app.
    const baseCls =
      "relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] cursor-pointer transition-all no-underline";
    const inactiveCls =
      "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white";
    const activeCls =
      "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold";
    const parentActiveCls =
      "text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-white/5";

    let cls: string;
    if (active && depth === 0) {
      cls = `${baseCls} ${activeCls}`;
    } else if (active) {
      cls = `${baseCls} ${activeCls}`;
    } else if (hasKids && depth === 0) {
      cls = `${baseCls} ${parentActiveCls}`;
    } else {
      cls = `${baseCls} ${inactiveCls}`;
    }

    const inner = (
      <>
        <Icon className="w-4 h-4 flex-shrink-0" />
        {isOpen && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            {hasKids && (
              <ChevronDown
                className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </>
        )}
      </>
    );

    const baseStyle = { paddingLeft: `${depth * 12 + 12}px` };

    return (
      <div key={item.href + "-" + item.label}>
        {hasKids ? (
          <button
            type="button"
            className={`${cls} w-full`}
            style={baseStyle}
            onClick={(e) => {
              e.preventDefault();
              toggle(item.href);
            }}
            aria-expanded={open}
            title={tooltip}
          >
            {/* Left-bar accent for active top-level items */}
            {active && depth === 0 && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-blue-600 dark:bg-blue-400"
              />
            )}
            {inner}
          </button>
        ) : (
          <Link
            to={item.href}
            className={cls}
            style={baseStyle}
            title={tooltip}
          >
            {/* Left-bar accent for active top-level items */}
            {active && depth === 0 && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-blue-600 dark:bg-blue-400"
              />
            )}
            {inner}
          </Link>
        )}
        {hasKids && open && isOpen && (
          <div className="mt-0.5">{item.children!.map((c) => renderItem(c, depth + 1))}</div>
        )}
      </div>
    );
  };

  const badge: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    CEO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    USER: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
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
        className={`fixed top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} z-50 flex flex-col bg-white dark:bg-[#0d1117] border-r border-gray-200 dark:border-[#1b2230] transition-all duration-300 ${isOpen ? "w-60" : "w-0 lg:w-[52px]"} overflow-hidden lg:overflow-visible`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-gray-200 dark:border-[#1b2230]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700 dark:from-indigo-400 dark:via-blue-500 dark:to-blue-600">
            <svg viewBox="0 0 40 40" className="w-6 h-6" aria-label="WPOS">
              <path
                d="M9 11 L14.5 28 L20 17 L25.5 28 L31 11"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {isOpen && (
            <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">
              {APP_NAME}
            </span>
          )}
          {isOpen && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 lg:hidden ml-auto"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`hidden lg:flex absolute top-4 ${isRTL ? "-left-3" : "-right-3"} w-6 h-6 bg-white dark:bg-[#161d27] border border-gray-200 dark:border-[#1b2230] rounded-full items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 z-10`}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        {/* Role + tier badges */}
        {isOpen && (
          <div className="px-4 py-2.5 border-b border-gray-200 dark:border-[#1b2230] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badge[userRole] || badge.USER}`}
              >
                {userRole}
              </span>
              <TierChip tier={orgTier.tier} />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
              {visibleNav.length} modules
            </span>
          </div>
        )}

        {/* Navigation — FILTERED BY ROLE + TIER */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {(() => {
            const coreItems = visibleNav.filter((i) => i.section !== "advanced");
            const advItems = visibleNav.filter((i) => i.section === "advanced");
            return (
              <>
                {coreItems.length > 0 && (
                  <>
                    {isOpen && (
                      <div className="px-3 pt-1 pb-1.5 flex items-center gap-1.5">
                        <Workflow className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {lang === "ar" ? "سير العمل الأساسي" : "Core Workflow"}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                          · {coreItems.length}
                        </span>
                      </div>
                    )}
                    <div className="space-y-0.5">{coreItems.map((item) => renderItem(item))}</div>
                  </>
                )}
                {advItems.length > 0 && (
                  <>
                    {isOpen && (
                      <div className="px-3 pt-4 pb-1.5 flex items-center gap-1.5 mt-2 border-t border-gray-100 dark:border-[#1b2230]">
                        <FlaskConical className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {lang === "ar" ? "متقدم" : "Advanced"}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                          · {advItems.length}
                        </span>
                      </div>
                    )}
                    <div className="space-y-0.5">{advItems.map((item) => renderItem(item))}</div>
                  </>
                )}
              </>
            );
          })()}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-[#1b2230] p-3">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("Sign Out", "تسجيل الخروج")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
