/**
 * Centralized RBAC role and permission definitions for WPOS.
 * Single source of truth — all guards reference this module.
 */

export const APP_ROLES = {
  SUPER_ADMIN: "ADMIN",
  CEO: "CEO",
  MANAGER: "MANAGER",
  USER: "USER",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

/**
 * Permission codes follow the pattern: `action:resource`
 * e.g. "read:dashboard", "manage:users", "write:diagnostics"
 */
export const PERMISSIONS = {
  // Dashboard
  READ_DASHBOARD: "read:dashboard",
  READ_EXECUTIVE: "read:executive",

  // Organization
  READ_ORGANIZATION: "read:organization",
  WRITE_ORGANIZATION: "write:organization",

  // Users & Admin
  MANAGE_USERS: "manage:users",
  MANAGE_ROLES: "manage:roles",
  READ_AUDIT: "read:audit",
  MANAGE_SETTINGS: "manage:settings",
  MANAGE_API_KEYS: "manage:api-keys",

  // Diagnostics
  READ_DIAGNOSTICS: "read:diagnostics",
  WRITE_DIAGNOSTICS: "write:diagnostics",

  // KPIs
  READ_KPIS: "read:kpis",
  WRITE_KPIS: "write:kpis",

  // Cases
  READ_CASES: "read:cases",
  WRITE_CASES: "write:cases",

  // Evidence
  READ_EVIDENCE: "read:evidence",
  WRITE_EVIDENCE: "write:evidence",

  // Reports
  READ_REPORTS: "read:reports",
  EXPORT_REPORTS: "export:reports",

  // Analytics
  READ_ANALYTICS: "read:analytics",

  // Processes
  READ_PROCESSES: "read:processes",
  WRITE_PROCESSES: "write:processes",

  // Advanced
  MANAGE_RULES: "manage:rules",
  MANAGE_WORKFLOWS: "manage:workflows",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Default permission sets per role.
 * These are the baseline permissions — can be extended per-user via DB.
 */
export const ROLE_PERMISSIONS: Record<AppRole, PermissionCode[]> = {
  ADMIN: Object.values(PERMISSIONS), // Full access
  CEO: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.READ_EXECUTIVE,
    PERMISSIONS.READ_ORGANIZATION,
    PERMISSIONS.READ_DIAGNOSTICS,
    PERMISSIONS.READ_KPIS,
    PERMISSIONS.READ_CASES,
    PERMISSIONS.READ_EVIDENCE,
    PERMISSIONS.READ_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.READ_ANALYTICS,
    PERMISSIONS.READ_PROCESSES,
    PERMISSIONS.READ_AUDIT,
  ],
  MANAGER: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.READ_ORGANIZATION,
    PERMISSIONS.READ_DIAGNOSTICS,
    PERMISSIONS.WRITE_DIAGNOSTICS,
    PERMISSIONS.READ_KPIS,
    PERMISSIONS.READ_CASES,
    PERMISSIONS.WRITE_CASES,
    PERMISSIONS.READ_EVIDENCE,
    PERMISSIONS.WRITE_EVIDENCE,
    PERMISSIONS.READ_REPORTS,
    PERMISSIONS.READ_ANALYTICS,
    PERMISSIONS.READ_PROCESSES,
  ],
  USER: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.READ_KPIS,
    PERMISSIONS.READ_EVIDENCE,
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(
  role: AppRole,
  permission: PermissionCode,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: AppRole,
  permissions: PermissionCode[],
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(
  role: AppRole,
  permissions: PermissionCode[],
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
