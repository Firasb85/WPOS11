import React, { ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';

// Placeholder for auth context hook. Replace with actual useAuth implementation
const useAuth = () => ({ 
  user: { roleName: 'USER', permissions: ['read'] }, 
  isLoading: false 
});

export type Role = 'ADMIN' | 'MANAGER' | 'USER' | 'CEO';

interface PermissionGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectRoute?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallback = null,
  redirectRoute
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>;

  const hasRole = !allowedRoles.length || (user && allowedRoles.includes(user.roleName as Role));
  const hasPermission = !requiredPermissions.length || (user && requiredPermissions.every(p => user.permissions.includes(p)));

  if (!user || !hasRole || !hasPermission) {
    if (redirectRoute) {
      router.navigate({ to: redirectRoute, replace: true });
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
