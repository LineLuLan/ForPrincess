import { KnightHome } from "@/components/KnightHome";
import { PrincessHome } from "@/components/PrincessHome";
import { getViewer } from "@/lib/auth";
import { fetchKnightSpecialDates } from "@/lib/profile-queries";
import { fetchVisibleWishes } from "@/lib/wish-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [viewer, fetched, specialDates] = await Promise.all([
    getViewer(),
    fetchVisibleWishes(),
    fetchKnightSpecialDates(),
  ]);

  const role = viewer?.role ?? "PRINCESS";
  const { items, source, warning } = fetched;

  const banner =
    source === "mock" && warning ? (
      <div className="rounded-2xl border border-dashed border-accent-soft bg-accent-soft/40 px-4 py-3 text-xs text-accent">
        ⚠️ {warning}
      </div>
    ) : null;

  const viewerId = viewer?.userId ?? null;

  if (role === "KNIGHT") {
    return (
      <div className="flex flex-col gap-6">
        {banner}
        <KnightHome items={items} specialDates={specialDates} viewerId={viewerId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {banner}
      <PrincessHome items={items} specialDates={specialDates} viewerId={viewerId} />
    </div>
  );
}
