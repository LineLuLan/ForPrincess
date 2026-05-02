"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, ImagePlus, Loader2, Plus } from "lucide-react";
import {
  wishFormDefaults,
  wishFormSchema,
  wishPriorityValues,
  type WishFormValues,
} from "@/lib/wish-schema";
import { PRIORITY_LABEL, type WishPriority } from "@/types/wish";

type AddWishFormProps = {
  onSubmit?: (values: WishFormValues, image: File | null) => Promise<void> | void;
};

export function AddWishForm({ onSubmit }: AddWishFormProps) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WishFormValues>({
    resolver: zodResolver(wishFormSchema),
    defaultValues: wishFormDefaults,
  });

  const priority = watch("priority");

  const handleImage = (file: File | null) => {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    if (!open) return;

    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleImage(file);
            e.preventDefault();
            return;
          }
        }
      }
    };

    const root = formRef.current;
    root?.addEventListener("paste", onPaste);
    return () => root?.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values, imageFile);
    }
    reset(wishFormDefaults);
    handleImage(null);
    setOpen(false);
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-center gap-2 rounded-[var(--radius-soft)] border-2 border-dashed border-border/80 bg-surface/40 px-4 py-6 text-sm font-semibold text-muted transition hover:border-accent hover:bg-accent-soft/40 hover:text-accent"
      >
        <Plus className="h-4 w-4" />
        Thêm một điều ước mới
        <Heart className="h-3.5 w-3.5 fill-accent stroke-accent transition group-hover:scale-110" />
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="rounded-[var(--radius-soft)] border border-border bg-surface p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Thêm điều ước</h2>
        <button
          type="button"
          onClick={() => {
            reset(wishFormDefaults);
            handleImage(null);
            setOpen(false);
          }}
          className="text-xs text-muted hover:text-foreground"
        >
          Hủy
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên" error={errors.title?.message} required>
          <input
            type="text"
            placeholder="Đôi dép pastel mơ ước..."
            {...register("title")}
            className={inputClass}
          />
        </Field>

        <Field label="Link sản phẩm" error={errors.url?.message}>
          <input
            type="url"
            placeholder="https://..."
            {...register("url")}
            className={inputClass}
          />
        </Field>

        <Field label="Giá (VND)" error={errors.price?.message}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
            className={inputClass}
          />
        </Field>

        <Field label="Mức độ thích" error={errors.priority?.message}>
          <div className="flex gap-2">
            {wishPriorityValues.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setValue("priority", p, { shouldValidate: true })}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ring-1 transition ${
                  priority === p
                    ? "bg-accent text-white ring-accent"
                    : "bg-surface-soft text-muted ring-border hover:bg-accent-soft/60"
                }`}
              >
                {PRIORITY_LABEL[p as WishPriority]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Lý do thích" className="sm:col-span-2" error={errors.note?.message}>
          <textarea
            rows={3}
            placeholder="Vì nó giống ngày đầu tiên hai đứa hẹn hò..."
            {...register("note")}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Ảnh sản phẩm" className="sm:col-span-2">
          <label
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-soft/60 px-4 py-3 text-sm text-muted transition hover:border-accent hover:text-accent"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="flex-1 truncate">
              {imageFile ? imageFile.name : "Chọn ảnh hoặc paste từ clipboard (Ctrl+V)"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
            />
          </label>
          {imagePreview && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="preview" className="aspect-[4/3] w-full object-cover" />
            </div>
          )}
        </Field>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className="h-4 w-4 fill-white" />
          )}
          Lưu điều ước
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "block w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40";

function Field({
  label,
  error,
  children,
  className = "",
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-muted">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-accent">{error}</span>}
    </label>
  );
}
