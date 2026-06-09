/**
 * Client environment configuration for WPOS.
 *
 * ARCHITECTURE NOTE:
 * The canonical Supabase project is hardcoded here because Lovable's
 * hidden .env (which we cannot edit) may inject credentials for an
 * older project.  All env-var lookups are intentionally skipped so
 * that Vite's compile-time string replacement cannot override us.
 *
 * To switch projects, update the three constants below.
 */
import { clientEnvSchema, type ClientEnv } from "./env.schema";

/* ── Canonical Supabase credentials ────────────────────────── */
const SUPABASE_PROJECT = "nsbmrtohkdttsufxwzdi";
const SUPABASE_URL = "https://nsbmrtohkdttsufxwzdi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwi" +
  "cm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTkxNTIsImV4cCI6MjA5NjQzNTE1Mn0." +
  "mrjM5EWl_BAAjM8u7mY4nxOLVyTNEnt3ST3k8gl7I8w";

/* ── Build the validated config ────────────────────────────── */
function validateClientEnv(): ClientEnv {
  const raw: ClientEnv = {
    VITE_SUPABASE_URL: SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: SUPABASE_ANON_KEY,
    VITE_SUPABASE_PROJECT_ID: SUPABASE_PROJECT,
  };

  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    /* SSR: swallow gracefully */
    if (typeof window === "undefined") {
      console.warn("[env] validation failed during SSR — using defaults");
      return raw;
    }
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`\n❌ Client env validation failed:\n${formatted}\n`);
    throw new Error("Invalid client environment. Check src/config/env.ts.");
  }

  return result.data;
}

export const clientEnv = validateClientEnv();
