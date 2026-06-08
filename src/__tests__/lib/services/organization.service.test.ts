import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "1", name: "Test" }, error: null }),
  };
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.order.mockResolvedValue({ data: [], error: null, count: 0 });
  chain.range.mockResolvedValue({ data: [], error: null, count: 0 });
  return { supabase: { from: vi.fn().mockReturnValue(chain) } };
});
vi.mock("@/config/env", () => ({
  clientEnv: {
    VITE_SUPABASE_URL: "https://t.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "k",
    VITE_SUPABASE_PROJECT_ID: "p",
  },
}));

import { companiesService } from "@/lib/services/supabase/companies.service";
import { branchesService } from "@/lib/services/supabase/branches.service";
import { departmentsService } from "@/lib/services/supabase/departments.service";
import { teamsService } from "@/lib/services/supabase/teams.service";
import { employeesService } from "@/lib/services/supabase/employees.service";

describe("companiesService", () => {
  it("list returns array", async () => {
    const r = await companiesService.list();
    expect(Array.isArray(r)).toBe(true);
  });
  it("create returns object with id", async () => {
    const r = await companiesService.create({ name: "X" });
    expect(r).toHaveProperty("id");
  });
  it("delete does not throw", async () => {
    await expect(companiesService.delete("1")).resolves.not.toThrow();
  });
});

describe("branchesService", () => {
  it("list returns array", async () => {
    const r = await branchesService.list();
    expect(Array.isArray(r)).toBe(true);
  });
  it("create returns object", async () => {
    const r = await branchesService.create({ name: "B", company_id: "1" });
    expect(r).toHaveProperty("id");
  });
});

describe("departmentsService", () => {
  it("list returns array", async () => {
    const r = await departmentsService.list();
    expect(Array.isArray(r)).toBe(true);
  });
  it("create returns object", async () => {
    const r = await departmentsService.create({ name: "D", branch_id: "1" });
    expect(r).toHaveProperty("id");
  });
});

describe("teamsService", () => {
  it("list returns array", async () => {
    const r = await teamsService.list();
    expect(Array.isArray(r)).toBe(true);
  });
  it("create returns object", async () => {
    const r = await teamsService.create({ name: "T", department_id: "1" });
    expect(r).toHaveProperty("id");
  });
});

describe("employeesService", () => {
  it("list function exists", () => {
    expect(typeof employeesService.list).toBe("function");
  });
  it("create returns object", async () => {
    const r = await employeesService.create({ first_name: "J", last_name: "D" });
    expect(r).toHaveProperty("id");
  });
});
