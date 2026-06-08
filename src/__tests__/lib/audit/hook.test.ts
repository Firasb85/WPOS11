import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const insertChain = {
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
  };
  return {
    supabase: {
      from: vi.fn().mockReturnValue({ insert: vi.fn().mockReturnValue(insertChain) }),
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
    },
  };
});
vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://t.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "k",
    VITE_SUPABASE_PROJECT_ID: "p",
  },
}));

import { logAuditEvent } from "@/lib/audit/hook";

describe("logAuditEvent", () => {
  it("should not throw on success", async () => {
    await expect(
      logAuditEvent({ action: "CREATE", entityType: "employee", entityId: "1" }),
    ).resolves.not.toThrow();
  });

  it("should not throw on failure", async () => {
    await expect(logAuditEvent({ action: "DELETE", entityType: "company" })).resolves.not.toThrow();
  });

  it("accepts all action types", async () => {
    for (const action of [
      "CREATE",
      "UPDATE",
      "DELETE",
      "APPROVE",
      "REJECT",
      "SUBMIT",
      "EXPORT",
    ] as const) {
      await expect(logAuditEvent({ action, entityType: "test" })).resolves.not.toThrow();
    }
  });
});
