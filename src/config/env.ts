/**
 * Validated client environment.
 * Safe to use in browser code — only VITE_ prefixed vars.
 * During SSR, returns fallback values to prevent build crashes.
 */
import { clientEnvSchema, type ClientEnv } from "./env.schema";

function validateClientEnv(): ClientEnv {
  // During SSR, import.meta.env may not have VITE_ vars
  const raw = {
    VITE_SUPABASE_URL:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "",
    VITE_SUPABASE_PUBLISHABLE_KEY:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "",
    VITE_SUPABASE_PROJECT_ID:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PROJECT_ID) ||
      process.env.VITE_SUPABASE_PROJECT_ID ||
      process.env.SUPABASE_PROJECT_ID ||
      "",
  };

  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    // In SSR / build context, don't crash — return placeholders
    if (typeof window === "undefined") {
      console.warn("[env] Client env validation failed during SSR — using fallbacks");
      return {
        VITE_SUPABASE_URL: raw.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: raw.VITE_SUPABASE_PUBLISHABLE_KEY || "placeholder",
        VITE_SUPABASE_PROJECT_ID: raw.VITE_SUPABASE_PROJECT_ID || "placeholder",
      };
    }

    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`\n❌ Client environment validation failed:\n${formatted}\n`);
    throw new Error("Missing or invalid client environment variables. Check your .env file.");
  }

  return result.data;
}

export const clientEnv = validateClientEnv();
