import { HeartHandshake } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export function EmptyState({
  title = "Chưa có điều ước nào",
  description = "Hãy thêm điều ước đầu tiên — một món đồ, một chuyến đi, hay một trải nghiệm mà nàng đang muốn.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-soft)] border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
        {icon ?? <HeartHandshake className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
