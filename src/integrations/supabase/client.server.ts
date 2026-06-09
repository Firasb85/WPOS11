// Server-side Supabase admin client — bypasses RLS.
// Hardcoded credentials to prevent .env override issues.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://nsbmrtohkdttsufxwzdi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwi" +
  "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1OTE1MiwiZXhwIjoyMDk2NDM1MTUyfQ." +
  "HXe6dSh9fASSuRkp6cr44HRLs3puy5b5Gx4XgR-y8hI";

function createSupabaseAdminClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy(
  {} as ReturnType<typeof createSupabaseAdminClient>,
  {
    get(_, prop, receiver) {
      if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
      return Reflect.get(_supabaseAdmin, prop, receiver);
    },
  },
);
