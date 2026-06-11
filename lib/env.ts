export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function getPublicEnv(): PublicEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_SUPABASE_URL belum diisi.",
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi.",
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}
