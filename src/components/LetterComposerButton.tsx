"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Mail, Send, Trash2, X } from "lucide-react";
import { cancelLetter, sendLetter } from "@/app/actions/letter";

const MAX_BODY = 5000;
const MAX_TITLE = 120;

type LetterComposerButtonProps = {
  hasActiveLetter: boolean;
};

export function LetterComposerButton({ hasActiveLetter }: LetterComposerButtonProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const handleClose = () => {
    if (pending) return;
    setOpen(false);
    setError(null);
  };

  const handleSend = () => {
    setError(null);
    startTransition(async () => {
      const r = await sendLetter({ title: title.trim() || undefined, body });
      if (!r.ok) {
        setError(r.message);
        return;
      }
      setTitle("");
      setBody("");
      setOpen(false);
    });
  };

  const handleCancelExisting = () => {
    setError(null);
    startTransition(async () => {
      const r = await cancelLetter();
      if (!r.ok) {
        setError(r.message);
        return;
      }
    });
  };

  const tooLong = body.length > MAX_BODY;
  const titleTooLong = title.length > MAX_TITLE;
  const empty = body.trim().length === 0;
  const disabled = pending || tooLong || titleTooLong || empty;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/60 px-2 py-1 font-mono text-[11px] text-muted transition hover:bg-accent hover:text-white"
      >
        <Mail className="h-3 w-3" />
        {hasActiveLetter ? "Sửa thư" : "Viết thư"}
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        className="m-auto w-full max-w-2xl rounded-[var(--radius-soft)] border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[90vh] flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Mail className="h-4 w-4 text-accent" />
              Lá thư cho nàng
            </h2>
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
            Thư hiển thị 24h kể từ khi gửi rồi tự ẩn. Tối đa {MAX_BODY.toLocaleString("vi-VN")} ký tự.
          </p>

          {hasActiveLetter && (
            <div className="flex items-start justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-foreground">
              <span className="leading-snug">
                Đang có một lá thư đang chạy. Gửi thư mới sẽ thay thế lá hiện tại.
              </span>
              <button
                type="button"
                onClick={handleCancelExisting}
                disabled={pending}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-accent disabled:opacity-60"
              >
                <Trash2 className="h-3 w-3" />
                Hủy thư hiện tại
              </button>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">Tiêu đề (tùy chọn)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE + 20}
              placeholder="Chúc mừng sinh nhật em yêu..."
              className="block w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40"
            />
            {titleTooLong && (
              <span className="text-xs text-accent">Tiêu đề tối đa {MAX_TITLE} ký tự.</span>
            )}
          </label>

          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">Nội dung thư</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              placeholder="Em yêu của anh,&#10;&#10;Hôm nay là sinh nhật em..."
              className="block w-full flex-1 resize-none rounded-2xl border border-border bg-surface px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40"
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className={tooLong ? "text-accent" : "text-muted"}>
                {body.length.toLocaleString("vi-VN")} / {MAX_BODY.toLocaleString("vi-VN")} ký tự
              </span>
              <span className="text-muted">{body.split(/\s+/).filter(Boolean).length} từ</span>
            </div>
          </label>

          {error && (
            <p className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">{error}</p>
          )}

          <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={pending}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-60"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Gửi cho nàng
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
