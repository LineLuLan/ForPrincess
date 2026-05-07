import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActiveLetter = {
  id: string;
  title: string | null;
  body: string;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  fromUser: string;
};

/**
 * Returns the latest letter visible to the current viewer.
 *  - Princess: filtered by RLS to letters where starts_at <= now() and not expired.
 *  - Knight: also sees his own scheduled-for-future or just-expired letters via
 *    the knight_sees_own_letters policy, so he can preview/cancel.
 */
export const fetchActiveLetter = cache(
  async (): Promise<ActiveLetter | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("letters")
      .select("id, title, body, starts_at, expires_at, created_at, from_user")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      startsAt: data.starts_at,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      fromUser: data.from_user,
    };
  },
);
