"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Gift, HeartHandshake, Lock, Sparkles } from "lucide-react";
import {
  PRIORITY_LABEL,
  type UserRole,
  type WishItem,
  type WishPriority,
} from "@/types/wish";
import { formatGiftedDate, formatPrice } from "@/lib/format";

const PRIORITY_TONE: Record<WishPriority, string> = {
  WANT: "bg-surface-soft text-muted ring-border",
  REALLY_WANT: "bg-accent-soft/70 text-accent ring-accent-soft",
  MUST_HAVE: "bg-accent text-white ring-accent",
};

type WishCardProps = {
  item: WishItem;
  viewerRole?: UserRole;
  actionsSlot?: React.ReactNode;
};

export function WishCard({ item, viewerRole = "PRINCESS", actionsSlot }: WishCardProps) {
  const price = formatPrice(item.price, item.currency);
  const giftedOn = formatGiftedDate(item.gifted_at);
  const isKnight = viewerRole === "KNIGHT";

  return (
    <motion.article
      layout
      layoutId={`wish-${item.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, rotate: -0.6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-soft)] border border-border bg-surface shadow-sm hover:shadow-md"
    >
      {item.is_gifted && <GiftedRibbon />}
      {isKnight && item.is_secretly_buying && !item.is_gifted && <SecretRibbon />}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-accent/60">
            <HeartHandshake className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-base font-semibold text-foreground line-clamp-2">
            {item.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${PRIORITY_TONE[item.priority]}`}
          >
            {PRIORITY_LABEL[item.priority]}
          </span>
        </div>

        {price && (
          <div
            className={`price text-sm font-semibold text-accent ${
              isKnight ? "font-mono tabular-nums tracking-tight" : ""
            }`}
          >
            {price}
          </div>
        )}

        {item.note && (
          <p className="text-sm leading-relaxed text-muted line-clamp-3">{item.note}</p>
        )}

        {item.is_gifted && item.gift_message && (
          <div className="rounded-2xl bg-accent-soft/60 p-3 text-sm leading-relaxed text-foreground">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Lời nhắn
            </span>
            {item.gift_message}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {item.url ? (
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted transition hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Xem sản phẩm
            </Link>
          ) : (
            <span className="text-xs text-muted/70">—</span>
          )}

          {item.is_gifted && giftedOn && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Gift className="h-3.5 w-3.5 text-gold" /> {giftedOn}
            </span>
          )}
        </div>

        {actionsSlot && <div className="border-t border-border/70 pt-3">{actionsSlot}</div>}
      </div>
    </motion.article>
  );
}

function GiftedRibbon() {
  return (
    <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gold/95 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow">
      <Gift className="h-3.5 w-3.5" /> Đã tặng
    </div>
  );
}

function SecretRibbon() {
  return (
    <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow">
      <Lock className="h-3.5 w-3.5" /> Đang chuẩn bị
    </div>
  );
}
