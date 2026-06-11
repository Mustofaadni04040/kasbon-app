import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient(): SupabaseClient<Database> {
  const env = getPublicEnv();

  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
  );
}
