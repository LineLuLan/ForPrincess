import { getCurrentRole } from "@/lib/auth";
import type { UserRole } from "@/types/wish";

type RoleGateProps = {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export async function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const current = await getCurrentRole();
  if (!current) return fallback;

  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(current)) return fallback;

  return <>{children}</>;
}
