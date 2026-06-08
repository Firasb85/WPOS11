import { describe, it, expect } from "vitest";
import { isFeatureEnabled, getAllFlags } from "@/lib/security/feature-flags";

describe("Feature Flags", () => {
  it("returns false for unknown flag", () => {
    expect(isFeatureEnabled("nonexistent")).toBe(false);
  });

  it("mfa_enabled is on", () => {
    expect(isFeatureEnabled("mfa_enabled")).toBe(true);
  });

  it("ai_insights is on", () => {
    expect(isFeatureEnabled("ai_insights")).toBe(true);
  });

  it("getAllFlags returns array", () => {
    const flags = getAllFlags();
    expect(Array.isArray(flags)).toBe(true);
    expect(flags.length).toBeGreaterThan(5);
  });

  it("gdpr_tools requires ADMIN role", () => {
    const flags = getAllFlags();
    const gdpr = flags.find((f) => f.key === "gdpr_tools");
    expect(gdpr?.allowedRoles).toContain("ADMIN");
  });
});
