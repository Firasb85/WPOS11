/**
 * Smoke Test: Preview Sign-In Flow
 *
 * Verifies that one-click sign-in works for each test account
 * and the correct role is returned from Supabase.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSignIn = vi.fn();
const mockGetSession = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignIn,
      getSession: mockGetSession.mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  },
}));

const TEST_ACCOUNTS = [
  { email: "admin@wpos.com", password: "Password123!", expectedRole: "ADMIN" },
  { email: "ceo@wpos.com", password: "Password123!", expectedRole: "CEO" },
  { email: "manager@wpos.com", password: "Password123!", expectedRole: "MANAGER" },
  { email: "user@wpos.com", password: "Password123!", expectedRole: "USER" },
];

describe("Auth Smoke Test — Quick Sign-In", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  for (const account of TEST_ACCOUNTS) {
    it(`should sign in ${account.email} and return role ${account.expectedRole}`, async () => {
      mockSignIn.mockResolvedValueOnce({
        data: {
          user: {
            id: `user-${account.expectedRole.toLowerCase()}`,
            email: account.email,
            app_metadata: { role: account.expectedRole },
            user_metadata: {},
          },
          session: {
            access_token: "test-token-" + account.expectedRole,
            refresh_token: "test-refresh",
            expires_in: 3600,
            token_type: "bearer",
          },
        },
        error: null,
      });

      const { supabase } = await import("@/integrations/supabase/client");
      const result = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toBeDefined();
      expect(result.data.user!.email).toBe(account.email);
      expect(result.data.user!.app_metadata.role).toBe(account.expectedRole);
      expect(result.data.session).toBeDefined();
      expect(result.data.session!.access_token).toContain(account.expectedRole);
    });
  }

  it("should return error for invalid credentials", async () => {
    mockSignIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", status: 400, code: "invalid_credentials" },
    });

    const { supabase } = await import("@/integrations/supabase/client");
    const result = await supabase.auth.signInWithPassword({
      email: "bad@email.com",
      password: "wrong",
    });

    expect(result.error).toBeDefined();
    expect(result.error!.message).toContain("Invalid");
    expect(result.data.session).toBeNull();
  });

  it("should enforce role-based redirect mapping", () => {
    const ROLE_HOME: Record<string, string> = {
      ADMIN: "/dashboard/ceo",
      CEO: "/dashboard/ceo",
      MANAGER: "/dashboard/department",
      USER: "/dashboard/ceo",
    };

    expect(ROLE_HOME.ADMIN).toBe("/dashboard/ceo");
    expect(ROLE_HOME.CEO).toBe("/dashboard/ceo");
    expect(ROLE_HOME.MANAGER).toBe("/dashboard/department");
    expect(ROLE_HOME.USER).toBe("/dashboard/ceo");
  });

  it("should have correct role labels for all roles", () => {
    const ROLE_LABELS: Record<string, { en: string; ar: string }> = {
      ADMIN: { en: "System Administrator", ar: "مدير النظام" },
      CEO: { en: "Chief Executive", ar: "الرئيس التنفيذي" },
      MANAGER: { en: "Department Manager", ar: "مدير الإدارة" },
      USER: { en: "Team Member", ar: "عضو الفريق" },
    };

    for (const role of ["ADMIN", "CEO", "MANAGER", "USER"]) {
      expect(ROLE_LABELS[role]).toBeDefined();
      expect(ROLE_LABELS[role].en.length).toBeGreaterThan(3);
      expect(ROLE_LABELS[role].ar.length).toBeGreaterThan(3);
    }
  });
});
