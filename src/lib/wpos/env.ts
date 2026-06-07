/**
 * Environment variable validation for WPOS.
 * Import this module early in your server entry point to catch
 * missing configuration at startup instead of at runtime.
 */

interface EnvConfig {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  SESSION_SECRET?: string;
  // Supabase
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Required in production
  if (process.env.NODE_ENV !== 'development' && !process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required in production. Set it in your .env file.');
  }

  if (errors.length > 0) {
    console.error('\n❌ Environment validation failed:\n');
    errors.forEach(e => console.error(`  • ${e}`));
    console.error('\nCheck your .env file against .env.example\n');
    throw new Error(`Missing required environment variables:\n${errors.join('\n')}`);
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL || '',
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    SESSION_SECRET: process.env.SESSION_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export const env = validateEnv();
