"use client";

import { useState, useTransition } from "react";
import { Gift, Loader2, Lock, Undo2 } from "lucide-react";
import { markGifted, setSecretBuying, unmarkGifted } from "@/app/actions/wish";
import { celebrate } from "@/lib/confetti";
import { useWishGrid } from "@/components/WishGrid";
import type { WishItem } from "@/types/wish";

type KnightActionsProps = {
  item: WishItem;
};

export function KnightActions({ item }: KnightActionsProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const grid = useWishGrid();

  const run = (
    optimistic: () => void,
    fn: () => Promise<{ ok: boolean; message?: string }>,
  ) =>
    startTransition(async () => {
      setError(null);
      optimistic();
      const r = await fn();
      if (!r.ok) setError(r.message ?? "Có lỗi xảy ra.");
    });

  if (item.is_gifted) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () =>
                grid.optimisticUpdate(item.id, {
                  is_gifted: false,
                  gifted_at: null,
                  gift_message: null,
                }),
              () => unmarkGifted(item.id),
            )
          }
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Undo2 className="h-3.5 w-3.5" />}
          Hoàn tác đã tặng
        </button>
        {error && <span className="text-xs text-accent">{error}</span>}
      </div>
    );
  }

  if (showGiftBox) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          rows={2}
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value)}
          placeholder="Lời nhắn cho nàng..."
          className="rounded-2xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(
                () => {
                  grid.optimisticUpdate(item.id, {
                    is_gifted: true,
                    is_secretly_buying: false,
                    gifted_at: new Date().toISOString(),
                    gift_message: giftMessage.trim() || null,
                  });
                  celebrate();
                },
                () => markGifted(item.id, giftMessage),
              )
            }
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-gold/90 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Gift className="h-3.5 w-3.5" />}
            Đã tặng 🎁
          </button>
          <button
            type="button"
            onClick={() => {
              setShowGiftBox(false);
              setGiftMessage("");
            }}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
          >
            Hủy
          </button>
        </div>
        {error && <span className="text-xs text-accent">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () =>
                grid.optimisticUpdate(item.id, {
                  is_secretly_buying: !item.is_secretly_buying,
                }),
              () => setSecretBuying(item.id, !item.is_secretly_buying),
            )
          }
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
            item.is_secretly_buying
              ? "bg-foreground/90 text-white hover:bg-foreground"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-accent"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {item.is_secretly_buying ? "Đang chuẩn bị" : "Chốt đơn bí mật"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setShowGiftBox(true)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent/90 disabled:opacity-60"
        >
          <Gift className="h-3.5 w-3.5" /> Đã tặng
        </button>
      </div>
      {error && <span className="text-xs text-accent">{error}</span>}
    </div>
  );
}
