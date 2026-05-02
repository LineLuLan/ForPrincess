import imageCompression from "browser-image-compression";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "wish-images";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function compressAndUpload(file: File): Promise<UploadResult> {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.85,
    });

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createSupabaseBrowserClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, compressed, {
        contentType: compressed.type || file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) return { ok: false, message: uploadError.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Tải ảnh lên thất bại.",
    };
  }
}
