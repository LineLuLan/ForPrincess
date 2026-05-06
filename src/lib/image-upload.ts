import imageCompression from "browser-image-compression";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "wish-images";
const MAX_INPUT_BYTES = 25 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 45_000;

export type UploadStage = "preparing" | "compressing" | "uploading";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

type Options = {
  onStage?: (stage: UploadStage) => void;
};

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;
  return file.type === "image/heic" || file.type === "image/heif";
}

async function decodeHeic(file: File): Promise<File> {
  // Dynamic import — heic2any is browser-only and ships ~1MB of WASM.
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const blob = Array.isArray(out) ? out[0] : out;
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

export async function compressAndUpload(
  file: File,
  options: Options = {},
): Promise<UploadResult> {
  const { onStage } = options;

  try {
    if (file.size > MAX_INPUT_BYTES) {
      return {
        ok: false,
        message: "Ảnh quá lớn (>25 MB). Princess thử ảnh khác giúp mình nhé.",
      };
    }

    let working = file;

    if (isHeic(file)) {
      onStage?.("preparing");
      try {
        working = await decodeHeic(file);
      } catch {
        return {
          ok: false,
          message:
            "Ảnh HEIC từ iPhone không đọc được. Vào Cài đặt → Camera → Định dạng → 'Tương thích nhất' để chụp ra JPG nhé.",
        };
      }
    }

    onStage?.("compressing");
    const compressed = await imageCompression(working, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.85,
    });

    onStage?.("uploading");
    const rawExt = (compressed.type.split("/")[1] || "jpg").toLowerCase();
    const ext = rawExt === "jpeg" ? "jpg" : rawExt;
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createSupabaseBrowserClient();
    const uploadPromise = supabase.storage
      .from(BUCKET)
      .upload(path, compressed, {
        contentType: compressed.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () =>
          reject(
            new Error("Upload quá lâu (>45s). Kiểm tra mạng và thử lại nhé."),
          ),
        UPLOAD_TIMEOUT_MS,
      );
    });

    const { error: uploadError } = await Promise.race([
      uploadPromise,
      timeoutPromise,
    ]);
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
