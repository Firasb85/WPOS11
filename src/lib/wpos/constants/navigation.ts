import type { NavItem } from "../types";

export type Role = "ADMIN" | "MANAGER" | "USER" | "CEO";

export type SecureNavItem = NavItem & {
  allowedRoles?: Role[];
  children?: SecureNavItem[];
  /** Module key used by admin to toggle visibility */
  moduleKey?: string;
};

/**
 * Master navigation tree.
 *
 * Rules:
 *   • If `allowedRoles` is set   → only those roles see the item.
 *   • If `allowedRoles` is absent → all authenticated roles see it.
 *   • Children inherit the MOST restrictive of their own + parent's roles.
 *   • `moduleKey` is used by the admin Module Visibility settings to
 *     dynamically show/hide entire sections for ALL users.
 */
export const navigation: SecureNavItem[] = [
  /* ────────────────── DASHBOARDS ────────────────── */
  {
    label: "Dashboards",
    labelAr: "لوحات القيادة",
    href: "/dashboard",
    icon: "LayoutDashboard",
    module: "dashboard",
    moduleKey: "dashboards",
    children: [
      {
        label: "CEO Dashboard",
        labelAr: "لوحة الرئيس التنفيذي",
        href: "/dashboard/ceo",
        icon: "BarChart3",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO"],
      },
      {
        label: "Department Dashboard",
        labelAr: "لوحة الإدارة",
        href: "/dashboard/department",
        icon: "Building2",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Supervisor Dashboard",
        labelAr: "لوحة المشرف",
        href: "/dashboard/supervisor",
        icon: "Users",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Competency Dashboard",
        labelAr: "لوحة الكفاءات",
        href: "/dashboards/competency",
        icon: "Brain",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Diagnostic Intelligence",
        labelAr: "لوحة ذكاء التشخيص",
        href: "/dashboards/diagnostic-intelligence",
        icon: "Stethoscope",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Process Intelligence",
        labelAr: "لوحة ذكاء العمليات",
        href: "/dashboards/process-intelligence",
        icon: "GitMerge",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Executive Analytics",
        labelAr: "تحليلات تنفيذية",
        href: "/executive",
        icon: "BarChart3",
        module: "dashboard",
        allowedRoles: ["ADMIN", "CEO"],
      },
    ],
  },

  /* ────────────────── ORGANIZATION ────────────────── */
  {
    label: "Organization",
    labelAr: "الهيكل التنظيمي",
    href: "/organization",
    icon: "Building2",
    module: "organization",
    moduleKey: "organization",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Companies",
        labelAr: "الشركات",
        href: "/organization/companies",
        icon: "Building",
        module: "organization",
      },
      {
        label: "Branches",
        labelAr: "الفروع",
        href: "/organization/branches",
        icon: "GitBranch",
        module: "organization",
      },
      {
        label: "Departments",
        labelAr: "الإدارات",
        href: "/organization/departments",
        icon: "Building2",
        module: "organization",
      },
      {
        label: "Teams",
        labelAr: "الفرق",
        href: "/organization/teams",
        icon: "Users",
        module: "organization",
      },
      {
        label: "Employees",
        labelAr: "الموظفين",
        href: "/organization/employees",
        icon: "UserCircle",
        module: "organization",
      },
      {
        label: "Hierarchy View",
        labelAr: "عرض التسلسل الهرمي",
        href: "/organization/hierarchy",
        icon: "GitFork",
        module: "organization",
      },
    ],
  },

  /* ────────────────── JOB ARCHITECTURE ────────────────── */
  {
    label: "Job Architecture",
    labelAr: "هيكل الوظائف",
    href: "/jobs",
    icon: "Briefcase",
    module: "jobs",
    moduleKey: "jobs",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Job Families",
        labelAr: "مجموعات الوظائف",
        href: "/jobs/families",
        icon: "FolderTree",
        module: "jobs",
      },
      {
        label: "Job Grades",
        labelAr: "المستويات الوظيفية",
        href: "/jobs/grades",
        icon: "Layers",
        module: "jobs",
        allowedRoles: ["ADMIN", "CEO", "MANAGER"],
      },
      {
        label: "Job Profiles",
        labelAr: "الملفات الوظيفية",
        href: "/jobs/profiles",
        icon: "FileText",
        module: "jobs",
      },
      { label: "Jobs", labelAr: "الوظائف", href: "/jobs/list", icon: "Briefcase", module: "jobs" },
    ],
  },

  /* ────────────────── COMPETENCY ────────────────── */
  {
    label: "Competency",
    labelAr: "الكفاءات",
    href: "/competency",
    icon: "Brain",
    module: "competency",
    moduleKey: "competency",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Competency Library",
        labelAr: "مكتبة الكفاءات",
        href: "/competency",
        icon: "BookOpen",
        module: "competency",
      },
      {
        label: "Framework",
        labelAr: "الإطار",
        href: "/competency/framework",
        icon: "Layers",
        module: "competency",
      },
      {
        label: "Gap Analysis",
        labelAr: "تحليل الفجوات",
        href: "/competency/gaps",
        icon: "AlertTriangle",
        module: "competency",
      },
    ],
  },

  /* ────────────────── PROCESS ARCHITECTURE ────────────────── */
  {
    label: "Process Architecture",
    labelAr: "هيكل العمليات",
    href: "/processes",
    icon: "GitMerge",
    module: "processes",
    moduleKey: "processes",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Process Library",
        labelAr: "مكتبة العمليات",
        href: "/processes/library",
        icon: "Library",
        module: "processes",
      },
      {
        label: "Process Steps",
        labelAr: "خطوات العمليات",
        href: "/processes/steps",
        icon: "ListOrdered",
        module: "processes",
      },
      {
        label: "Dependency Mapping",
        labelAr: "خريطة التبعيات",
        href: "/processes/dependencies",
        icon: "Share2",
        module: "processes",
      },
    ],
  },

  /* ────────────────── PROCESS ENGINEERING ────────────────── */
  {
    label: "Process Engineering",
    labelAr: "هندسة العمليات",
    href: "/process-engineering",
    icon: "Play",
    module: "process-engineering",
    moduleKey: "process-engineering",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Execution Engine",
        labelAr: "محرك التنفيذ",
        href: "/process-engineering",
        icon: "Play",
        module: "process-engineering",
      },
      {
        label: "Process Mining",
        labelAr: "تعدين العمليات",
        href: "/process-engineering/mining",
        icon: "Search",
        module: "process-engineering",
      },
    ],
  },

  /* ────────────────── KPIs ────────────────── */
  {
    label: "KPIs",
    labelAr: "مؤشرات الأداء",
    href: "/kpis",
    icon: "Gauge",
    module: "kpis",
    moduleKey: "kpis",
    /* All roles can see KPI definitions */
    children: [
      {
        label: "KPI Categories",
        labelAr: "فئات المؤشرات",
        href: "/kpis/categories",
        icon: "Tags",
        module: "kpis",
      },
      {
        label: "KPI Library",
        labelAr: "مكتبة المؤشرات",
        href: "/kpis/library",
        icon: "Gauge",
        module: "kpis",
      },
      {
        label: "KPI Tree",
        labelAr: "شجرة المؤشرات",
        href: "/kpis/tree",
        icon: "Share2",
        module: "kpis",
      },
      {
        label: "KPI Dependency",
        labelAr: "تبعية المؤشرات",
        href: "/kpis/dependency",
        icon: "Share2",
        module: "kpis",
      },
    ],
  },

  /* ────────────────── PERFORMANCE SNAPSHOTS ────────────────── */
  {
    label: "Performance Snapshots",
    labelAr: "لقطات الأداء",
    href: "/snapshots",
    icon: "Camera",
    module: "snapshots",
    moduleKey: "snapshots",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "All Snapshots",
        labelAr: "جميع اللقطات",
        href: "/snapshots",
        icon: "List",
        module: "snapshots",
      },
      {
        label: "Record Snapshot",
        labelAr: "تسجيل لقطة",
        href: "/snapshots/new",
        icon: "PlusCircle",
        module: "snapshots",
        allowedRoles: ["ADMIN", "MANAGER"],
      },
    ],
  },

  /* ────────────────── EVIDENCE ────────────────── */
  {
    label: "Evidence",
    labelAr: "الأدلة",
    href: "/evidence",
    icon: "ClipboardCheck",
    module: "evidence",
    moduleKey: "evidence",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Evidence Library",
        labelAr: "مكتبة الأدلة",
        href: "/evidence",
        icon: "Library",
        module: "evidence",
      },
      {
        label: "Submit Evidence",
        labelAr: "تقديم دليل",
        href: "/evidence/new",
        icon: "Upload",
        module: "evidence",
        allowedRoles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Evidence Dashboard",
        labelAr: "لوحة الأدلة",
        href: "/evidence/dashboards",
        icon: "BarChart3",
        module: "evidence",
      },
    ],
  },

  /* ────────────────── DIAGNOSTICS ────────────────── */
  {
    label: "Diagnostics",
    labelAr: "التشخيصات",
    href: "/diagnostics",
    icon: "Stethoscope",
    module: "diagnostics",
    moduleKey: "diagnostics",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Diagnostic Reports",
        labelAr: "تقارير التشخيص",
        href: "/diagnostics",
        icon: "FileSearch",
        module: "diagnostics",
      },
      {
        label: "New Diagnostic",
        labelAr: "تشخيص جديد",
        href: "/diagnostics/new",
        icon: "PlusCircle",
        module: "diagnostics",
        allowedRoles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Diagnostic Dashboard",
        labelAr: "لوحة التشخيص",
        href: "/diagnostics/dashboard",
        icon: "BarChart3",
        module: "diagnostics",
      },
      {
        label: "Root Cause Analysis",
        labelAr: "تحليل الأسباب",
        href: "/diagnostics/root-cause",
        icon: "Search",
        module: "diagnostics",
      },
    ],
  },

  /* ────────────────── CASE MANAGEMENT ────────────────── */
  {
    label: "Case Management",
    labelAr: "إدارة الحالات",
    href: "/cases",
    icon: "Briefcase",
    module: "cases",
    moduleKey: "cases",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "All Cases",
        labelAr: "جميع الحالات",
        href: "/cases",
        icon: "List",
        module: "cases",
      },
      {
        label: "Case Dashboard",
        labelAr: "لوحة الحالات",
        href: "/cases/dashboard",
        icon: "BarChart3",
        module: "cases",
      },
      {
        label: "Root Cause KB",
        labelAr: "قاعدة الأسباب",
        href: "/cases/root-causes",
        icon: "BookOpen",
        module: "cases",
      },
    ],
  },

  /* ────────────────── INTERVENTIONS ────────────────── */
  {
    label: "Interventions",
    labelAr: "التدخلات",
    href: "/interventions",
    icon: "Activity",
    module: "interventions",
    moduleKey: "interventions",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Library",
        labelAr: "المكتبة",
        href: "/interventions",
        icon: "BookOpen",
        module: "interventions",
      },
      {
        label: "Effectiveness",
        labelAr: "فعالية التدخلات",
        href: "/interventions/effectiveness",
        icon: "Award",
        module: "interventions",
      },
      {
        label: "Action Plans",
        labelAr: "خطط العمل",
        href: "/action-plans",
        icon: "ClipboardList",
        module: "interventions",
      },
      {
        label: "Follow-Up",
        labelAr: "المتابعة",
        href: "/follow-up",
        icon: "Clock",
        module: "interventions",
      },
    ],
  },

  /* ────────────────── STANDALONE PAGES ────────────────── */
  {
    label: "Performance Journey",
    labelAr: "رحلة الأداء",
    href: "/journey",
    icon: "Activity",
    module: "journey",
    moduleKey: "journey",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
  },
  {
    label: "Workforce Risk",
    labelAr: "مخاطر القوى العاملة",
    href: "/risk",
    icon: "Shield",
    module: "risk",
    moduleKey: "risk",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Risk Dashboard",
        labelAr: "لوحة المخاطر",
        href: "/risk",
        icon: "BarChart3",
        module: "risk",
      },
      {
        label: "Heatmaps",
        labelAr: "خرائط حرارية",
        href: "/risk/heatmaps",
        icon: "Grid3x3",
        module: "risk",
      },
    ],
  },
  {
    label: "Maturity",
    labelAr: "النضج المؤسسي",
    href: "/maturity",
    icon: "BarChart3",
    module: "maturity",
    moduleKey: "maturity",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
  },
  {
    label: "Knowledge Graph",
    labelAr: "الرسم المعرفي",
    href: "/knowledge-graph",
    icon: "Share2",
    module: "knowledge-graph",
    moduleKey: "knowledge-graph",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
  },
  {
    label: "AI Assistant",
    labelAr: "المساعد الذكي",
    href: "/ai-assistant",
    icon: "Bot",
    module: "ai-assistant",
    moduleKey: "ai-assistant",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
  },

  /* ────────────────── ANALYTICS ────────────────── */
  {
    label: "Analytics",
    labelAr: "التحليلات",
    href: "/analytics",
    icon: "TrendingUp",
    module: "analytics",
    moduleKey: "analytics",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Root Cause Analysis",
        labelAr: "تحليل الأسباب",
        href: "/analytics/root-cause",
        icon: "Search",
        module: "analytics",
      },
      {
        label: "Competency Trends",
        labelAr: "اتجاهات الكفاءات",
        href: "/analytics/competency-trends",
        icon: "TrendingUp",
        module: "analytics",
      },
      {
        label: "Evidence Quality",
        labelAr: "جودة الأدلة",
        href: "/analytics/evidence-quality",
        icon: "Shield",
        module: "analytics",
      },
    ],
  },

  /* ────────────────── REPORTS ────────────────── */
  {
    label: "Reports",
    labelAr: "التقارير",
    href: "/reports",
    icon: "FileBarChart",
    module: "reports",
    moduleKey: "reports",
    allowedRoles: ["ADMIN", "CEO", "MANAGER"],
    children: [
      {
        label: "Diagnostic Reports",
        labelAr: "تقارير التشخيص",
        href: "/reports/diagnostics",
        icon: "FileSearch",
        module: "reports",
      },
      {
        label: "Enterprise Reports",
        labelAr: "تقارير مؤسسية",
        href: "/reports/enterprise",
        icon: "FileBarChart",
        module: "reports",
      },
      {
        label: "Export Reports",
        labelAr: "تصدير التقارير",
        href: "/reports/export",
        icon: "Download",
        module: "reports",
      },
    ],
  },

  /* ────────────────── NOTIFICATIONS ────────────────── */
  {
    label: "Notifications",
    labelAr: "الإشعارات",
    href: "/notifications",
    icon: "Bell",
    module: "notifications",
    moduleKey: "notifications",
    /* All roles can see notifications */
  },

  /* ────────────────── ADMINISTRATION ────────────────── */
  {
    label: "Administration",
    labelAr: "الإدارة",
    href: "/admin",
    icon: "Settings",
    module: "admin",
    moduleKey: "admin",
    allowedRoles: ["ADMIN", "CEO"],
    children: [
      {
        label: "User Management",
        labelAr: "إدارة المستخدمين",
        href: "/admin/users",
        icon: "Users",
        module: "admin",
        allowedRoles: ["ADMIN", "CEO"],
      },
      {
        label: "Role Management",
        labelAr: "إدارة الأدوار",
        href: "/admin/roles",
        icon: "Shield",
        module: "admin",
        allowedRoles: ["ADMIN", "CEO"],
      },
      {
        label: "Module Visibility",
        labelAr: "إظهار الوحدات",
        href: "/admin/settings",
        icon: "Settings",
        module: "admin",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Audit Logs",
        labelAr: "سجلات التدقيق",
        href: "/admin/audit",
        icon: "ScrollText",
        module: "admin",
        allowedRoles: ["ADMIN", "CEO"],
      },
      {
        label: "Security",
        labelAr: "الأمان",
        href: "/admin/security",
        icon: "Shield",
        module: "admin",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "API Keys",
        labelAr: "مفاتيح API",
        href: "/api-keys",
        icon: "Key",
        module: "api-keys",
        allowedRoles: ["ADMIN"],
      },
    ],
  },

  /* ────────────────── ADVANCED (ADMIN ONLY) ────────────────── */
  {
    label: "Advanced",
    labelAr: "متقدم",
    href: "/advanced",
    icon: "Cpu",
    module: "advanced",
    moduleKey: "advanced",
    allowedRoles: ["ADMIN"],
    children: [
      {
        label: "Rules Engine",
        labelAr: "محرك القواعد",
        href: "/rules-engine",
        icon: "Settings",
        module: "rules-engine",
      },
      {
        label: "Form Builder",
        labelAr: "منشئ النماذج",
        href: "/forms",
        icon: "Layout",
        module: "forms",
      },
      {
        label: "Data Lineage",
        labelAr: "نسب البيانات",
        href: "/lineage",
        icon: "Share2",
        module: "lineage",
      },
      {
        label: "Workflow Studio",
        labelAr: "استوديو سير العمل",
        href: "/workflow-studio",
        icon: "GitBranch",
        module: "workflow",
      },
      {
        label: "Digital Twin",
        labelAr: "التوأم الرقمي",
        href: "/digital-twin",
        icon: "Building2",
        module: "digital-twin",
      },
      {
        label: "Strategy",
        labelAr: "الاستراتيجية",
        href: "/strategy",
        icon: "Target",
        module: "strategy",
      },
      {
        label: "Portfolio",
        labelAr: "الحافظة",
        href: "/portfolio",
        icon: "FolderOpen",
        module: "portfolio",
      },
      {
        label: "Benchmarks",
        labelAr: "المقاييس المرجعية",
        href: "/benchmarks",
        icon: "BarChart3",
        module: "benchmarks",
      },
      {
        label: "Data Catalog",
        labelAr: "كتالوج البيانات",
        href: "/data-catalog",
        icon: "Database",
        module: "data-catalog",
      },
      {
        label: "Simulations",
        labelAr: "المحاكاة",
        href: "/simulations",
        icon: "Play",
        module: "simulations",
      },
      {
        label: "Command Center",
        labelAr: "مركز القيادة",
        href: "/command-center",
        icon: "Monitor",
        module: "command-center",
      },
      {
        label: "Documents",
        labelAr: "المستندات",
        href: "/documents",
        icon: "FileText",
        module: "documents",
      },
      {
        label: "SaaS Platform",
        labelAr: "منصة SaaS",
        href: "/saas",
        icon: "CreditCard",
        module: "saas",
      },
      {
        label: "Onboarding",
        labelAr: "الإعداد",
        href: "/onboarding",
        icon: "Zap",
        module: "onboarding",
      },
    ],
  },
];
