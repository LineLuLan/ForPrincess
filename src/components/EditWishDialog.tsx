"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Eye, Loader2, Pencil, X } from "lucide-react";
import { updateWish } from "@/app/actions/wish";
import { DeleteWishButton } from "@/components/DeleteWishButton";
import { wishPriorityValues } from "@/lib/wish-schema";
import { PRIORITY_LABEL, type UserRole, type WishItem, type WishPriority } from "@/types/wish";

type EditWishDialogProps = {
  item: WishItem;
  viewerRole: UserRole;
  viewerId: string | null;
  mode?: "edit" | "view";
};

export function EditWishDialog({
  item,
  viewerRole,
  viewerId,
  mode = "edit",
}: EditWishDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [title, setTitle] = useState(item.title);
  const [url, setUrl] = useState(item.url ?? "");
  const [price, setPrice] = useState<string>(item.price?.toString() ?? "");
  const [priority, setPriority] = useState<WishPriority>(item.priority);
  const [note, setNote] = useState(item.note ?? "");
  const [giftMessage, setGiftMessage] = useState(item.gift_message ?? "");
  const [error, setError] = useState<string | null>(null);

  const [pending, startTransition] = useTransition();

  const isKnight = viewerRole === "KNIGHT";
  const isOwner = viewerId != null && item.created_by === viewerId;
  const isView = mode === "view";

  // Knight edits anything. Princess edits things she owns (any state).
  // Read-only mode disables all editing.
  const canEditCore = !isView && (isKnight || isOwner);
  const canEditGiftMessage = !isView && isKnight && item.is_gifted;
  // Knight can delete anything; Princess can delete things she owns.
  const canDelete = !isView && (isKnight || isOwner);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const reset = () => {
    setTitle(item.title);
    setUrl(item.url ?? "");
    setPrice(item.price?.toString() ?? "");
    setPriority(item.priority);
    setNote(item.note ?? "");
    setGiftMessage(item.gift_message ?? "");
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const priceNum = price.trim() === "" ? null : Number(price);
      if (priceNum != null && Number.isNaN(priceNum)) {
        setError("Giá không hợp lệ");
        return;
      }

      const r = await updateWish({
        wishId: item.id,
        ...(canEditCore && {
          title: title.trim(),
          url: url.trim() || null,
          price: priceNum,
          priority,
          note: note.trim() || null,
        }),
        ...(canEditGiftMessage && { giftMessage: giftMessage.trim() || null }),
      });

      if (!r.ok) {
        setError(r.message);
        return;
      }

      setOpen(false);
    });
  };

  const TriggerIcon = isView ? Eye : Pencil;
  const triggerLabel = isView ? "Xem" : "Sửa";
  const dialogTitle = isView ? "Chi tiết điều ước" : "Sửa điều ước";

  return (
    <>
      <button
        type="button"
        aria-label={triggerLabel}
        onClick={() => setOpen(true)}
        className="absolute left-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface/95 text-muted shadow-sm backdrop-blur transition hover:bg-accent hover:text-white"
      >
        <TriggerIcon className="h-3.5 w-3.5" />
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        className="m-auto w-full max-w-md rounded-[var(--radius-soft)] border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{dialogTitle}</h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-soft hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Field label="Tên" required={!isView}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required={canEditCore}
              maxLength={120}
              readOnly={!canEditCore}
              disabled={!canEditCore}
            />
          </Field>

          <Field label="Link sản phẩm">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              readOnly={!canEditCore}
              disabled={!canEditCore}
            />
          </Field>

          <Field label="Giá (VND)">
            <input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              readOnly={!canEditCore}
              disabled={!canEditCore}
            />
          </Field>

          <Field label="Mức độ thích">
            <div className="flex gap-2">
              {wishPriorityValues.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => canEditCore && setPriority(p)}
                  disabled={!canEditCore}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ring-1 transition disabled:opacity-70 ${
                    priority === p
                      ? "bg-accent text-white ring-accent"
                      : "bg-surface-soft text-muted ring-border hover:bg-accent-soft/60"
                  }`}
                >
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Lý do thích">
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${inputClass} resize-none`}
              maxLength={500}
              readOnly={!canEditCore}
              disabled={!canEditCore}
            />
          </Field>

          {item.is_gifted && (
            <Field label="Lời nhắn cho nàng">
              <textarea
                rows={3}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className={`${inputClass} resize-none`}
                maxLength={500}
                placeholder={canEditGiftMessage ? "Lời nhắn ấm áp..." : ""}
                readOnly={!canEditGiftMessage}
                disabled={!canEditGiftMessage}
              />
            </Field>
          )}

          {error && (
            <p className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">{error}</p>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-4">
            <div>
              {canDelete && (
                <DeleteWishButton wishId={item.id} onDeleted={() => setOpen(false)} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
              >
                {isView ? "Đóng" : "Hủy"}
              </button>
              {!isView && (canEditCore || canEditGiftMessage) && (
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-ripple inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:opacity-60"
                >
                  {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                  Lưu thay đổi
                </button>
              )}
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}

const inputClass =
  "block w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40 read-only:bg-surface-soft read-only:text-muted disabled:bg-surface-soft disabled:text-muted disabled:cursor-not-allowed";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
