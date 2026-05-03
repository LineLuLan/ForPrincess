"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { specialDatesSchema, type SpecialDate } from "@/lib/countdown";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; message: string };

const loveNotesSchema = z
  .array(z.string().trim().min(1).max(280))
  .max(60);

export async function updateLoveNotes(notes: string[]): Promise<ActionResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Chỉ Knight mới chỉnh được lời nhắn 🛡️" };
  }

  const cleaned = notes.map((n) => n.trim()).filter((n) => n.length > 0);
  const parsed = loveNotesSchema.safeParse(cleaned);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ love_notes: parsed.data })
    .eq("id", viewer.userId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function updateSpecialDates(dates: SpecialDate[]): Promise<ActionResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Chỉ Knight mới chỉnh được ngày kỷ niệm 🛡️" };
  }

  const parsed = specialDatesSchema.safeParse(dates);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ special_dates: parsed.data })
    .eq("id", viewer.userId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}
