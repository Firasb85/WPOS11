/**
 * Validated client environment.
 * Supports both JWT anon keys and sb_publishable_ format.
 * During SSR, returns fallback values to prevent build crashes.
 */
import { clientEnvSchema, type ClientEnv } from "./env.schema";

const processEnv = typeof process !== "undefined" && process.env ? process.env : {};

const fallbackClientEnv: ClientEnv = {
  VITE_SUPABASE_URL: "https://nsbmrtohkdttsufxwzdi.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_dXfF2sIngV2Z3wT-_M9t8g_GkxdnHEk",
  VITE_SUPABASE_PROJECT_ID: "nsbmrtohkdttsufxwzdi",
};

function validateClientEnv(): ClientEnv {
  const raw = {
    VITE_SUPABASE_URL:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
      processEnv.VITE_SUPABASE_URL ||
      processEnv.SUPABASE_URL ||
      fallbackClientEnv.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
      processEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
      processEnv.SUPABASE_PUBLISHABLE_KEY ||
      fallbackClientEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_PROJECT_ID:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PROJECT_ID) ||
      processEnv.VITE_SUPABASE_PROJECT_ID ||
      processEnv.SUPABASE_PROJECT_ID ||
      // Extract project ID from URL if not set
      extractProjectId(
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
          processEnv.VITE_SUPABASE_URL ||
          "",
      ) ||
      fallbackClientEnv.VITE_SUPABASE_PROJECT_ID,
  };

  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    if (typeof window === "undefined") {
      console.warn("[env] Client env validation failed during SSR — using fallbacks");
      return fallbackClientEnv;
    }

    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`\n❌ Client environment validation failed:\n${formatted}\n`);
    throw new Error("Missing or invalid client environment variables. Check your .env file.");
  }

  return result.data;
}

function extractProjectId(url: string): string {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? "";
}

export const clientEnv = validateClientEnv();
