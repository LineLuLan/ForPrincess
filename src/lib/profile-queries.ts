import { cache } from "react";
import { parseSpecialDates, type SpecialDate } from "@/lib/countdown";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function envConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Fetch the Knight's curated countdown dates. Both Princess and Knight read
 * from this — Knight is the only one who curates them via updateSpecialDates.
 * Cached per-request so multiple sections can call without duplicate queries.
 */
export const fetchKnightSpecialDates = cache(
  async (): Promise<SpecialDate[]> => {
    if (!envConfigured()) return [];
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase
        .from("profiles")
        .select("special_dates")
        .eq("role", "KNIGHT")
        .maybeSingle();
      return parseSpecialDates(data?.special_dates ?? []);
    } catch {
      return [];
    }
  },
);

/**
 * Fetch the Knight's curated love notes. Princess reads this for her daily
 * note. When empty, callers should fall back to the seed JSON. Cached per request.
 */
export const fetchKnightLoveNotes = cache(async (): Promise<string[]> => {
  if (!envConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("profiles")
      .select("love_notes")
      .eq("role", "KNIGHT")
      .maybeSingle();
    const raw = data?.love_notes;
    if (!Array.isArray(raw)) return [];
    return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  } catch {
    return [];
  }
});
