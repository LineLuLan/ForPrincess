"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteWish } from "@/app/actions/wish";

type DeleteWishButtonProps = {
  wishId: string;
  onDeleted?: () => void;
};

export function DeleteWishButton({ wishId, onDeleted }: DeleteWishButtonProps) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3-second arm window: first click arms, second click within 3s deletes.
  useEffect(() => {
    if (!armed) return;
    timeoutRef.current = setTimeout(() => setArmed(false), 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [armed]);

  const handleClick = () => {
    setError(null);
    if (!armed) {
      setArmed(true);
      return;
    }
    startTransition(async () => {
      const r = await deleteWish(wishId);
      if (!r.ok) {
        setError(r.message);
        setArmed(false);
        return;
      }
      onDeleted?.();
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition disabled:opacity-60 ${
          armed
            ? "bg-red-500 text-white ring-red-500 animate-pulse"
            : "bg-surface-soft text-red-500 ring-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
        }`}
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        {armed ? "Bấm lần nữa để xóa" : "Xóa"}
      </button>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
