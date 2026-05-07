"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_BODY = 5000;
const MAX_TITLE = 120;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;

export type LetterResult = { ok: true } | { ok: false; message: string };

const letterInput = z.object({
  title: z
    .string()
    .trim()
    .max(MAX_TITLE, `Tiêu đề tối đa ${MAX_TITLE} ký tự.`)
    .optional(),
  body: z
    .string()
    .trim()
    .min(1, "Viết gì đó cho nàng đi 💌")
    .max(MAX_BODY, `Thư tối đa ${MAX_BODY} ký tự.`),
  startsAt: z
    .string()
    .datetime({ message: "Ngày giờ không hợp lệ." })
    .optional(),
});

export async function sendLetter(input: {
  title?: string;
  body: string;
  startsAt?: string;
}): Promise<LetterResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Tính năng này chỉ Knight mới dùng được 🛡️" };
  }

  const parsed = letterInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Nội dung không hợp lệ.",
    };
  }

  let startsAtIso: string | undefined;
  let expiresAtIso: string | undefined;
  if (parsed.data.startsAt) {
    const startsMs = new Date(parsed.data.startsAt).getTime();
    if (Number.isNaN(startsMs)) {
      return { ok: false, message: "Ngày giờ không hợp lệ." };
    }
    if (startsMs < Date.now() - CLOCK_SKEW_MS) {
      return { ok: false, message: "Không thể đặt thư cho thời điểm đã qua." };
    }
    startsAtIso = new Date(startsMs).toISOString();
    expiresAtIso = new Date(startsMs + TWENTY_FOUR_HOURS_MS).toISOString();
  }

  const supabase = await createSupabaseServerClient();

  // Replace any previous letter from this Knight (active or not — keep table tidy).
  await supabase.from("letters").delete().eq("from_user", viewer.userId);

  const { error } = await supabase.from("letters").insert({
    from_user: viewer.userId,
    title: parsed.data.title || null,
    body: parsed.data.body,
    ...(startsAtIso ? { starts_at: startsAtIso, expires_at: expiresAtIso } : {}),
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function cancelLetter(): Promise<LetterResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Tính năng này chỉ Knight mới dùng được 🛡️" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("from_user", viewer.userId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}
