import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/wish";

export type Viewer = {
  userId: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
};

/**
 * Returns the currently logged-in user joined with their profile,
 * or null if not logged in / no profile row. Cached per request so
 * repeated calls within one render don't hit the DB twice.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName: profile.display_name,
    role: profile.role,
  };
});

export async function getCurrentRole(): Promise<UserRole | null> {
  const viewer = await getViewer();
  return viewer?.role ?? null;
}
