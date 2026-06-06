import type { NavItem } from '../types';

export const navigation: NavItem[] = [
  {
    label: 'Dashboard', labelAr: 'لوحة القيادة', href: '/dashboard', icon: 'LayoutDashboard', module: 'dashboard',
    children: [
      { label: 'CEO Dashboard', labelAr: 'لوحة الرئيس التنفيذي', href: '/dashboard/ceo', icon: 'BarChart3', module: 'dashboard' },
      { label: 'Department Dashboard', labelAr: 'لوحة الإدارة', href: '/dashboard/department', icon: 'Building2', module: 'dashboard' },
      { label: 'Supervisor Dashboard', labelAr: 'لوحة المشرف', href: '/dashboard/supervisor', icon: 'Users', module: 'dashboard' },
    ],
  },
  {
    label: 'Organization', labelAr: 'الهيكل التنظيمي', href: '/organization', icon: 'Building2', module: 'organization',
    children: [
      { label: 'Companies', labelAr: 'الشركات', href: '/organization/companies', icon: 'Building', module: 'organization' },
      { label: 'Branches', labelAr: 'الفروع', href: '/organization/branches', icon: 'GitBranch', module: 'organization' },
      { label: 'Departments', labelAr: 'الإدارات', href: '/organization/departments', icon: 'Building2', module: 'organization' },
      { label: 'Teams', labelAr: 'الفرق', href: '/organization/teams', icon: 'Users', module: 'organization' },
      { label: 'Employees', labelAr: 'الموظفين', href: '/organization/employees', icon: 'UserCircle', module: 'organization' },
      { label: 'Hierarchy View', labelAr: 'عرض التسلسل الهرمي', href: '/organization/hierarchy', icon: 'GitFork', module: 'organization' },
    ],
  },
  {
    label: 'Job Architecture', labelAr: 'هيكل الوظائف', href: '/jobs', icon: 'Briefcase', module: 'jobs',
    children: [
      { label: 'Job Families', labelAr: 'مجموعات الوظائف', href: '/jobs/families', icon: 'FolderTree', module: 'jobs' },
      { label: 'Job Grades', labelAr: 'المستويات الوظيفية', href: '/jobs/grades', icon: 'Layers', module: 'jobs' },
      { label: 'Job Profiles', labelAr: 'الملفات الوظيفية', href: '/jobs/profiles', icon: 'FileText', module: 'jobs' },
      { label: 'Jobs', labelAr: 'الوظائف', href: '/jobs/list', icon: 'Briefcase', module: 'jobs' },
    ],
  },
  {
    label: 'Process Architecture', labelAr: 'هيكل العمليات', href: '/processes', icon: 'GitMerge', module: 'processes',
    children: [
      { label: 'Process Library', labelAr: 'مكتبة العمليات', href: '/processes/library', icon: 'Library', module: 'processes' },
      { label: 'Process Steps', labelAr: 'خطوات العمليات', href: '/processes/steps', icon: 'ListOrdered', module: 'processes' },
    ],
  },
  {
    label: 'KPIs', labelAr: 'مؤشرات الأداء', href: '/kpis', icon: 'Gauge', module: 'kpis',
    children: [
      { label: 'KPI Categories', labelAr: 'فئات المؤشرات', href: '/kpis/categories', icon: 'Tags', module: 'kpis' },
      { label: 'KPI Library', labelAr: 'مكتبة المؤشرات', href: '/kpis/library', icon: 'Gauge', module: 'kpis' },
    ],
  },
  {
    label: 'Performance Snapshots', labelAr: 'لقطات الأداء', href: '/snapshots', icon: 'Camera', module: 'snapshots',
    children: [
      { label: 'All Snapshots', labelAr: 'جميع اللقطات', href: '/snapshots', icon: 'List', module: 'snapshots' },
      { label: 'Record Snapshot', labelAr: 'تسجيل لقطة', href: '/snapshots/new', icon: 'PlusCircle', module: 'snapshots' },
    ],
  },
  {
    label: 'Evidence', labelAr: 'الأدلة', href: '/evidence', icon: 'ClipboardCheck', module: 'evidence',
    children: [
      { label: 'Evidence Library', labelAr: 'مكتبة الأدلة', href: '/evidence', icon: 'Library', module: 'evidence' },
      { label: 'Submit Evidence', labelAr: 'تقديم دليل', href: '/evidence/new', icon: 'Upload', module: 'evidence' },
    ],
  },
  {
    label: 'Diagnostics', labelAr: 'التشخيصات', href: '/diagnostics', icon: 'Stethoscope', module: 'diagnostics',
    children: [
      { label: 'Diagnostic Reports', labelAr: 'تقارير التشخيص', href: '/diagnostics', icon: 'FileSearch', module: 'diagnostics' },
      { label: 'New Diagnostic', labelAr: 'تشخيص جديد', href: '/diagnostics/new', icon: 'PlusCircle', module: 'diagnostics' },
    ],
  },
  {
    label: 'Reports', labelAr: 'التقارير', href: '/reports', icon: 'FileBarChart', module: 'reports',
    children: [
      { label: 'Diagnostic Reports', labelAr: 'تقارير التشخيص', href: '/reports/diagnostics', icon: 'FileSearch', module: 'reports' },
      { label: 'Export Reports', labelAr: 'تصدير التقارير', href: '/reports/export', icon: 'Download', module: 'reports' },
    ],
  },
  {
    label: 'Administration', labelAr: 'الإدارة', href: '/admin', icon: 'Settings', module: 'admin',
    children: [
      { label: 'User Management', labelAr: 'إدارة المستخدمين', href: '/admin/users', icon: 'Users', module: 'users' },
      { label: 'Role Management', labelAr: 'إدارة الأدوار', href: '/admin/roles', icon: 'Shield', module: 'roles' },
      { label: 'Audit Logs', labelAr: 'سجلات التدقيق', href: '/admin/audit', icon: 'ScrollText', module: 'admin' },
      { label: 'System Settings', labelAr: 'إعدادات النظام', href: '/admin/settings', icon: 'Settings', module: 'admin' },
    ],
  },
];
