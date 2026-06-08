import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi
      .fn()
      .mockResolvedValue({ data: { id: "1", competency_name_en: "Leadership" }, error: null }),
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

import { competenciesService } from "@/lib/services/supabase/competencies.service";

describe("competenciesService", () => {
  it("list returns array", async () => {
    expect(Array.isArray(await competenciesService.list())).toBe(true);
  });
  it("create returns object", async () => {
    const r = await competenciesService.create({
      competency_code: "C1",
      competency_name_en: "L",
      competency_name_ar: "ق",
      category: "skill",
    });
    expect(r).toHaveProperty("id");
  });
  it("delete resolves", async () => {
    await expect(competenciesService.delete("1")).resolves.not.toThrow();
  });
  it("listEmployeeCompetencies returns array", async () => {
    expect(Array.isArray(await competenciesService.listEmployeeCompetencies())).toBe(true);
  });
});
