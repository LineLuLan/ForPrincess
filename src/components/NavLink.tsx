"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const active = pathname === href;

  return (
    <Link
      href={href}
      prefetch
      onNavigate={() => {
        // Trigger optimistic pending UI immediately on click.
        startTransition(() => {});
      }}
      className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
        active
          ? "bg-accent-soft text-foreground"
          : "text-muted hover:bg-accent-soft/60 hover:text-foreground"
      }`}
    >
      {children}
      {pending && <Loader2 className="h-3 w-3 animate-spin" />}
      {active && (
        <span className="absolute inset-x-3 -bottom-px h-px bg-accent" aria-hidden />
      )}
    </Link>
  );
}
