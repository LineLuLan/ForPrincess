"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, MessageSquareHeart, Plus, Trash2, X } from "lucide-react";
import { updateLoveNotes } from "@/app/actions/profile";

type LoveNotesDialogProps = {
  initial: string[];
};

export function LoveNotesDialog({ initial }: LoveNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [items, setItems] = useState<string[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const addRow = () => setItems((xs) => [...xs, ""]);
  const removeRow = (i: number) =>
    setItems((xs) => xs.filter((_, idx) => idx !== i));
  const setRow = (i: number, value: string) =>
    setItems((xs) => xs.map((x, idx) => (idx === i ? value : x)));

  const handleClose = () => {
    setOpen(false);
    setItems(initial);
    setError(null);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const r = await updateLoveNotes(items);
      if (!r.ok) {
        setError(r.message);
        return;
      }
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/60 px-2 py-1 font-mono text-[11px] text-muted transition hover:bg-accent hover:text-white"
      >
        <MessageSquareHeart className="h-3 w-3" /> Lời nhắn
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        className="m-auto w-full max-w-lg rounded-[var(--radius-soft)] border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[85vh] flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Lời nhắn hằng ngày</h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-soft"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted">
            Nàng sẽ thấy 1 câu mỗi ngày, đổi mỗi ngày theo thứ tự xoay vòng. Tối đa 60 câu, mỗi câu ≤ 280 ký tự. Để trống → app dùng 30 câu mẫu.
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {items.length === 0 && (
              <p className="rounded-2xl bg-surface-soft px-3 py-3 text-xs text-muted">
                Chưa có câu nào — bấm + để thêm.
              </p>
            )}
            {items.map((it, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2 w-6 shrink-0 text-right font-mono text-[11px] text-muted">
                  {i + 1}.
                </span>
                <textarea
                  value={it}
                  onChange={(e) => setRow(i, e.target.value)}
                  rows={2}
                  maxLength={280}
                  placeholder="Hôm nay anh nhớ em..."
                  className="flex-1 resize-none rounded-2xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Xóa câu"
                  className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-accent-soft hover:text-accent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {items.length < 60 && (
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted hover:border-accent hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm câu
            </button>
          )}

          {error && (
            <p className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Lưu
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
