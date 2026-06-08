import { describe, it, expect } from "vitest";
import { isRateLimited, getRemainingAttempts } from "@/lib/security/rate-limit";

describe("Rate Limiting", () => {
  it("allows first request", () => {
    expect(isRateLimited("apiCall")).toBe(false);
  });

  it("tracks remaining attempts", () => {
    const remaining = getRemainingAttempts("login");
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(5);
  });

  it("returns false for unknown action", () => {
    expect(isRateLimited("unknown" as never)).toBe(false);
  });
});
