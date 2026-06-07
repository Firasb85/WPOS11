import React, { type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import type { AppRole, PermissionCode } from "@/lib/rbac";

interface PermissionGuardProps {
  children: ReactNode;
  /** Roles that are allowed to see this content */
  allowedRoles?: AppRole[];
  /** Permissions required (ALL must be satisfied) */
  requiredPermissions?: PermissionCode[];
  /** Content to show when denied */
  fallback?: ReactNode;
  /** Route to redirect to when denied */
  redirectRoute?: string;
}

/**
 * PermissionGuard — renders children only if the current user
 * satisfies BOTH role and permission requirements.
 *
 * Usage:
 *   <PermissionGuard allowedRoles={['ADMIN']} requiredPermissions={['manage:users']}>
 *     <AdminPanel />
 *   </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallback = null,
  redirectRoute,
}) => {
  const { user, role, isLoading, canAll } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div
        className="animate-pulse bg-muted h-full w-full rounded-md min-h-[100px]"
        role="status"
        aria-label="Loading content..."
      />
    );
  }

  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(role);
  const hasPermission =
    requiredPermissions.length === 0 || canAll(requiredPermissions);

  if (!user || !hasRole || !hasPermission) {
    if (redirectRoute) {
      router.navigate({ to: redirectRoute, replace: true });
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
