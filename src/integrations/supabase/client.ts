import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { clientEnv } from "@/config/env";

// Create client with auth persistence only in browser
export const supabase = createClient<Database>(
  clientEnv.VITE_SUPABASE_URL,
  clientEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  },
);
