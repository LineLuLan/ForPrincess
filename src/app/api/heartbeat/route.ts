import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return Response.json(
      { ok: false, error: "Missing Supabase env vars" },
      { status: 500 },
    );
  }

  // Plain anon client — no cookies, no auth. We just want to touch the DB
  // so Supabase doesn't pause the project after 7 days of inactivity.
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("wish_items").select("id").limit(1);

  if (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return Response.json({ ok: true, ts: new Date().toISOString() });
}
