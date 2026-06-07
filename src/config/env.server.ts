/**
 * Validated server-only environment.
 * The .server.ts suffix prevents Vite from bundling this into the client.
 *
 * On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
 * resolve to undefined — always read process.env INSIDE a function.
 */
import { serverEnvSchema, type ServerEnv } from "./env.schema";

let _cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (_cachedEnv) return _cachedEnv;

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`\n❌ Server environment validation failed:\n${formatted}\n`);
    throw new Error("Missing or invalid server environment variables. Check your .env file.");
  }

  _cachedEnv = result.data;
  return _cachedEnv;
}

/** Shortcut for common env reads */
export function getServerConfig() {
  const env = getServerEnv();
  return {
    nodeEnv: env.NODE_ENV,
    databaseUrl: env.DATABASE_URL,
    sessionSecret: env.SESSION_SECRET,
    supabaseUrl: env.SUPABASE_URL,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
