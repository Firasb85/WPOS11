import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        is: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    }),
  },
}));

vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://test.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
    VITE_SUPABASE_PROJECT_ID: "test-id",
  },
}));

import { adminService } from "@/lib/services/supabase/admin.service";

describe("adminService", () => {
  it("listAuditLogs should return array", async () => {
    const result = await adminService.listAuditLogs();
    expect(Array.isArray(result)).toBe(true);
  });

  it("listRoles should return array", async () => {
    const result = await adminService.listRoles();
    expect(Array.isArray(result)).toBe(true);
  });

  it("listPermissions should return array", async () => {
    const result = await adminService.listPermissions();
    expect(Array.isArray(result)).toBe(true);
  });
});
