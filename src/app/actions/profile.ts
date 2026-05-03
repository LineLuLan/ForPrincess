"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/auth";
import { specialDatesSchema, type SpecialDate } from "@/lib/countdown";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; message: string };

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
