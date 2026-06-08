import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "1" }, error: null }),
  };
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.order.mockResolvedValue({ data: [], error: null });
  return { supabase: { from: vi.fn().mockReturnValue(chain) } };
});
vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://t.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "k",
    VITE_SUPABASE_PROJECT_ID: "p",
  },
}));

import { evidenceService } from "@/lib/services/supabase/evidence.service";

describe("evidenceService", () => {
  it("list returns array", async () => {
    expect(Array.isArray(await evidenceService.list())).toBe(true);
  });
  it("list function exists", () => {
    expect(typeof evidenceService.list).toBe("function");
  });
  it("create returns object with id", async () => {
    expect(
      await evidenceService.create({
        evidence_type: "quantitative",
        source: "S",
        description: "D",
      }),
    ).toHaveProperty("id");
  });
  it("delete resolves", async () => {
    await expect(evidenceService.delete("1")).resolves.not.toThrow();
  });
});
