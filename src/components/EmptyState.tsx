import { EmptyHearts } from "@/components/illustrations/EmptyHearts";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
};

export function EmptyState({
  title = "Chưa có điều ước nào",
  description = "Hãy thêm điều ước đầu tiên — một món đồ, một chuyến đi, hay một trải nghiệm mà nàng đang muốn.",
  icon,
  illustration,
}: EmptyStateProps) {
  const visual =
    illustration ??
    (icon ? (
      <div className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
        {icon}
      </div>
    ) : (
      <EmptyHearts className="h-28 w-32 text-accent" />
    ));

  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-soft)] border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <div className="mb-4">{visual}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
