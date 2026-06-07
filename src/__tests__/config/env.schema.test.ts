import { describe, it, expect } from "vitest";
import { clientEnvSchema, serverEnvSchema } from "@/config/env.schema";

describe("clientEnvSchema", () => {
  it("should validate correct client env", () => {
    const result = clientEnvSchema.safeParse({
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
      VITE_SUPABASE_PROJECT_ID: "test-project",
    });

    expect(result.success).toBe(true);
  });

  it("should reject missing VITE_SUPABASE_URL", () => {
    const result = clientEnvSchema.safeParse({
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
      VITE_SUPABASE_PROJECT_ID: "test-project",
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid URL", () => {
    const result = clientEnvSchema.safeParse({
      VITE_SUPABASE_URL: "not-a-url",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
      VITE_SUPABASE_PROJECT_ID: "test-project",
    });

    expect(result.success).toBe(false);
  });
});

describe("serverEnvSchema", () => {
  it("should validate minimal dev config", () => {
    const result = serverEnvSchema.safeParse({
      NODE_ENV: "development",
    });

    expect(result.success).toBe(true);
  });

  it("should default NODE_ENV to development", () => {
    const result = serverEnvSchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe("development");
    }
  });

  it("should require DATABASE_URL in production", () => {
    const result = serverEnvSchema.safeParse({
      NODE_ENV: "production",
    });

    expect(result.success).toBe(false);
  });

  it("should accept complete production config", () => {
    const result = serverEnvSchema.safeParse({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://localhost:5432/wpos",
      SESSION_SECRET: "this-is-a-long-enough-secret",
    });

    expect(result.success).toBe(true);
  });
});
