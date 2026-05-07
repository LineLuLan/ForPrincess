import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActiveLetter = {
  id: string;
  title: string | null;
  body: string;
  expiresAt: string;
  createdAt: string;
  fromUser: string;
};

/**
 * Returns the most-recent active letter (RLS already filters out expired rows),
 * or null when there is none. Both Princess and Knight see the same row because
 * only one Knight letter exists at a time.
 */
export async function fetchActiveLetter(): Promise<ActiveLetter | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("letters")
    .select("id, title, body, expires_at, created_at, from_user")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    body: data.body,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    fromUser: data.from_user,
  };
}
