import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function getApiAuth(): Promise<{
  user: User | null;
  authError: string | null;
  status: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return {
      user: null,
      authError: "Failed to verify user session.",
      status: 500,
    };
  }

  if (!user) {
    return {
      user: null,
      authError: "Authentication required.",
      status: 401,
    };
  }

  return {
    user,
    authError: null,
    status: 200,
  };
}
