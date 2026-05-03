"use server";

import { getViewer } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const COOLDOWN_MS = 15 * 60 * 1000;

export type PingResult =
  | { ok: true }
  | { ok: false; message: string; retryInSeconds?: number };

export async function sendHeartPing(): Promise<PingResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Tính năng này chỉ Knight mới dùng được 🛡️" };
  }

  const supabase = await createSupabaseServerClient();

  // Cooldown: refuse if the latest ping from this Knight is < 15 min old.
  const { data: latest } = await supabase
    .from("pings")
    .select("created_at")
    .eq("from_user", viewer.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest?.created_at) {
    const elapsed = Date.now() - new Date(latest.created_at).getTime();
    if (elapsed < COOLDOWN_MS) {
      return {
        ok: false,
        message: "Để chút nữa hãy gửi tiếp nhé — kẻo nàng quen 💕",
        retryInSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
      };
    }
  }

  const { error } = await supabase
    .from("pings")
    .insert({ from_user: viewer.userId, type: "heart" });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Returns ms until the next ping is allowed. 0 means ready now. */
export async function getPingCooldown(): Promise<number> {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "KNIGHT") return 0;

  const supabase = await createSupabaseServerClient();
  const { data: latest } = await supabase
    .from("pings")
    .select("created_at")
    .eq("from_user", viewer.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest?.created_at) return 0;
  const elapsed = Date.now() - new Date(latest.created_at).getTime();
  return Math.max(0, COOLDOWN_MS - elapsed);
}
