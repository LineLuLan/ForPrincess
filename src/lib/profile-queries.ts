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
 */
export async function fetchKnightSpecialDates(): Promise<SpecialDate[]> {
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
}
