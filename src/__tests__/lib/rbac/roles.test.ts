import { describe, it, expect } from "vitest";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from "@/lib/rbac";

describe("RBAC - hasPermission", () => {
  it("ADMIN should have all permissions", () => {
    Object.values(PERMISSIONS).forEach((perm) => {
      expect(hasPermission("ADMIN", perm)).toBe(true);
    });
  });

  it("USER should only have basic read permissions", () => {
    expect(hasPermission("USER", PERMISSIONS.READ_DASHBOARD)).toBe(true);
    expect(hasPermission("USER", PERMISSIONS.READ_KPIS)).toBe(true);
    expect(hasPermission("USER", PERMISSIONS.MANAGE_USERS)).toBe(false);
    expect(hasPermission("USER", PERMISSIONS.WRITE_DIAGNOSTICS)).toBe(false);
  });

  it("MANAGER should have read and write for diagnostics", () => {
    expect(hasPermission("MANAGER", PERMISSIONS.READ_DIAGNOSTICS)).toBe(true);
    expect(hasPermission("MANAGER", PERMISSIONS.WRITE_DIAGNOSTICS)).toBe(true);
    expect(hasPermission("MANAGER", PERMISSIONS.MANAGE_USERS)).toBe(false);
  });

  it("CEO should have executive access but not admin", () => {
    expect(hasPermission("CEO", PERMISSIONS.READ_EXECUTIVE)).toBe(true);
    expect(hasPermission("CEO", PERMISSIONS.READ_AUDIT)).toBe(true);
    expect(hasPermission("CEO", PERMISSIONS.MANAGE_USERS)).toBe(false);
    expect(hasPermission("CEO", PERMISSIONS.MANAGE_SETTINGS)).toBe(false);
  });
});

describe("RBAC - hasAllPermissions", () => {
  it("should return true when all permissions are present", () => {
    expect(hasAllPermissions("ADMIN", [PERMISSIONS.READ_DASHBOARD, PERMISSIONS.MANAGE_USERS])).toBe(
      true,
    );
  });

  it("should return false when any permission is missing", () => {
    expect(hasAllPermissions("USER", [PERMISSIONS.READ_DASHBOARD, PERMISSIONS.MANAGE_USERS])).toBe(
      false,
    );
  });
});

describe("RBAC - hasAnyPermission", () => {
  it("should return true when at least one permission is present", () => {
    expect(hasAnyPermission("USER", [PERMISSIONS.MANAGE_USERS, PERMISSIONS.READ_DASHBOARD])).toBe(
      true,
    );
  });

  it("should return false when no permissions match", () => {
    expect(hasAnyPermission("USER", [PERMISSIONS.MANAGE_USERS, PERMISSIONS.MANAGE_ROLES])).toBe(
      false,
    );
  });
});

describe("RBAC - ROLE_PERMISSIONS integrity", () => {
  it("every role should have at least one permission", () => {
    Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
      expect(perms.length).toBeGreaterThan(0);
    });
  });

  it("ADMIN should have the most permissions", () => {
    const adminCount = ROLE_PERMISSIONS.ADMIN.length;
    Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
      if (role !== "ADMIN") {
        expect(perms.length).toBeLessThanOrEqual(adminCount);
      }
    });
  });
});
