import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// ══════════════════════════════════════════════════════════════
// HARDCODED Supabase credentials for project nsbmrtohkdttsufxwzdi.
// This bypasses ALL .env / import.meta.env / config/env layers
// so that Lovable's hidden env cannot override the connection.
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://nsbmrtohkdttsufxwzdi.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwi" +
  "cm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTkxNTIsImV4cCI6MjA5NjQzNTE1Mn0." +
  "mrjM5EWl_BAAjM8u7mY4nxOLVyTNEnt3ST3k8gl7I8w";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
});
