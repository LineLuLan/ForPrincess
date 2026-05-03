"use client";

import {
  createContext,
  startTransition,
  use,
  useMemo,
  useOptimistic,
} from "react";
import { motion } from "framer-motion";
import { KnightActions } from "@/components/KnightActions";
import { WishCard } from "@/components/WishCard";
import { PRIORITY_RANK, type UserRole, type WishItem } from "@/types/wish";

// Sort functions live in the client island so they don't have to cross
// the server→client boundary as props (functions aren't serializable).
function princessSort(a: WishItem, b: WishItem): number {
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
}

function knightSort(a: WishItem, b: WishItem): number {
  if (a.is_gifted !== b.is_gifted) return a.is_gifted ? 1 : -1;
  if (a.is_secretly_buying !== b.is_secretly_buying) {
    return a.is_secretly_buying ? -1 : 1;
  }
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
}

// ---------- mutation reducer ----------

type Mutation =
  | { type: "add"; item: WishItem }
  | { type: "update"; id: string; partial: Partial<WishItem> }
  | { type: "remove"; id: string };

function reducer(state: WishItem[], m: Mutation): WishItem[] {
  if (m.type === "add") return [m.item, ...state];
  if (m.type === "remove") return state.filter((x) => x.id !== m.id);
  return state.map((x) => (x.id === m.id ? { ...x, ...m.partial } : x));
}

// ---------- context ----------

type WishGridContextValue = {
  items: WishItem[];
  optimisticAdd: (item: WishItem) => void;
  optimisticUpdate: (id: string, partial: Partial<WishItem>) => void;
  optimisticRemove: (id: string) => void;
};

const WishGridContext = createContext<WishGridContextValue | null>(null);

export function useWishGrid(): WishGridContextValue {
  const ctx = use(WishGridContext);
  if (!ctx) {
    throw new Error("useWishGrid must be inside <WishListProvider>");
  }
  return ctx;
}

// ---------- provider ----------

type WishListProviderProps = {
  initialItems: WishItem[];
  children: React.ReactNode;
};

export function WishListProvider({
  initialItems,
  children,
}: WishListProviderProps) {
  const [optimistic, dispatch] = useOptimistic(initialItems, reducer);

  const value = useMemo<WishGridContextValue>(
    () => ({
      items: optimistic,
      optimisticAdd: (item) =>
        startTransition(() => dispatch({ type: "add", item })),
      optimisticUpdate: (id, partial) =>
        startTransition(() => dispatch({ type: "update", id, partial })),
      optimisticRemove: (id) =>
        startTransition(() => dispatch({ type: "remove", id })),
    }),
    [optimistic, dispatch],
  );

  return (
    <WishGridContext.Provider value={value}>{children}</WishGridContext.Provider>
  );
}

// ---------- grid renderer ----------

type WishGridProps = {
  viewerRole: UserRole;
  viewerId?: string | null;
  density?: "airy" | "dense";
};

export function WishGrid({ viewerRole, viewerId = null, density = "airy" }: WishGridProps) {
  const { items } = useWishGrid();
  const isKnight = viewerRole === "KNIGHT";
  const gridClass =
    density === "dense"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  const sorted = [...items].sort(isKnight ? knightSort : princessSort);

  return (
    <motion.section
      className={gridClass}
      variants={{
        show: { transition: { staggerChildren: 0.05 } },
      }}
      initial="hidden"
      animate="show"
    >
      {sorted.map((item) => {
        const isOptimistic = item.id.startsWith("temp-");
        return (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={isOptimistic ? "pointer-events-none animate-pulse" : ""}
          >
            <WishCard
              item={item}
              viewerRole={viewerRole}
              viewerId={viewerId}
              actionsSlot={
                isKnight && !isOptimistic ? <KnightActions item={item} /> : undefined
              }
            />
          </motion.div>
        );
      })}
    </motion.section>
  );
}
