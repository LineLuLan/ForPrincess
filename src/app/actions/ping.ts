"use server";

import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const COOLDOWN_MS = 15 * 60 * 1000;
const MAX_MESSAGE = 200;

export type PingResult =
  | { ok: true }
  | { ok: false; message: string; retryInSeconds?: number };

const pingInput = z.object({
  message: z.string().trim().max(MAX_MESSAGE).optional(),
});

export async function sendHeartPing(rawMessage?: string): Promise<PingResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };

  const parsed = pingInput.safeParse({ message: rawMessage });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Lời nhắn quá dài.",
    };
  }
  const message = parsed.data.message?.trim() || null;

  const supabase = await createSupabaseServerClient();

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
    .insert({ from_user: viewer.userId, type: "heart", message });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Returns ms until the next ping is allowed. 0 means ready now. */
export async function getPingCooldown(): Promise<number> {
  const viewer = await getViewer();
  if (!viewer) return 0;

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
