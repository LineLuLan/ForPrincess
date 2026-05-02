"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { signIn, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form
      action={formAction}
      className="w-full rounded-[var(--radius-soft)] border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Mật khẩu"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {state.status === "error" && (
          <div className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Đăng nhập
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...input
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <input
        {...input}
        className="rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
