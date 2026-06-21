import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  BarChart3,
  Shield,
  Settings,
  FileText,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { to: '/admin/kpis', label: 'KPI Library', icon: Target },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/audit', label: 'Audit Log', icon: FileText },
  { to: '/admin/security', label: 'Security', icon: Shield },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-lg">Admin</div>
            <div className="text-xs text-gray-500">WPOS11</div>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 px-4">
          v2.0.0 • Admin Mode
        </div>
      </div>
    </div>
  );
}