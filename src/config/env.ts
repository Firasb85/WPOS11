/**
 * Validated client environment.
 * Safe to use in browser code — only VITE_ prefixed vars.
 * Fails fast with descriptive errors if validation fails.
 */
import { clientEnvSchema, type ClientEnv } from "./env.schema";

function validateClientEnv(): ClientEnv {
  const raw = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
  };

  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`\n❌ Client environment validation failed:\n${formatted}\n`);
    throw new Error("Missing or invalid client environment variables. Check your .env file.");
  }

  return result.data;
}

export const clientEnv = validateClientEnv();
