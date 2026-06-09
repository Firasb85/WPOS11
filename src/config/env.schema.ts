/**
 * Environment variable schemas for WPOS.
 * Supports both JWT and sb_publishable_ key formats.
 */
import { z } from "zod";

export const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "VITE_SUPABASE_PUBLISHABLE_KEY is required"),
  VITE_SUPABASE_PROJECT_ID: z.string().min(1, "VITE_SUPABASE_PROJECT_ID is required"),
});

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string().url().optional(),
    SESSION_SECRET: z.string().min(16).optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production") {
      if (!data.DATABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "DATABASE_URL is required in production",
          path: ["DATABASE_URL"],
        });
      }
    }
  });

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
