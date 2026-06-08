/**
 * Validated client environment.
 * Safe to use in browser code — only VITE_ prefixed vars.
 * During SSR, returns fallback values to prevent build crashes.
 */
import { clientEnvSchema, type ClientEnv } from "./env.schema";

const fallbackClientEnv: ClientEnv = {
  VITE_SUPABASE_URL: "https://byojycjnbxbhutvclebl.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6ImJ5b2p5Y2puYnhiaHV0dmNsZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjkyMTYsImV4cCI6MjA5NjM0NTIxNn0.LRzpsskUF2bHJbjHgat9fhy1zOCh5sb25_E8aGhkGYc",
  VITE_SUPABASE_PROJECT_ID: "byojycjnbxbhutvclebl",
};

function validateClientEnv(): ClientEnv {
  const processEnv = typeof process !== "undefined" ? process.env : {};
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
      fallbackClientEnv.VITE_SUPABASE_PROJECT_ID,
  };

  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    // In SSR / build context, don't crash — return placeholders
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

export const clientEnv = validateClientEnv();
