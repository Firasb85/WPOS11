import React, { ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth, Role } from '@/hooks/useAuth';

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
  const { user, role, permissions, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="animate-pulse bg-muted h-full w-full rounded-md min-h-[100px]" aria-label="Loading content..."></div>;
  }

  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(role);
  const hasPermission = requiredPermissions.length === 0 || requiredPermissions.every(p => permissions.includes(p));

  if (!user || !hasRole || !hasPermission) {
    if (redirectRoute) {
      router.navigate({ to: redirectRoute, replace: true });
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
