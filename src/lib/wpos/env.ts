/**
 * Environment variable validation for WPOS using Zod.
 * Fails fast and strictly enforces schema compliance.
 */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production' && !data.DATABASE_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "DATABASE_URL is required in production environments.",
      path: ["DATABASE_URL"]
    });
  }
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('\n❌ Environment validation failed:');
  console.error(_env.error.format());
  throw new Error('Invalid environment variables. Check your .env file.');
}

export const env = _env.data;
export type EnvConfig = z.infer<typeof envSchema>;
