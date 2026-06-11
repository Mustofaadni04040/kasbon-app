"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import type { AuthActionState } from "@/types";
import { initialAuthActionState } from "@/types";

type AuthMode = "login" | "signup";

type AuthFormAction = (
  state: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

interface AuthFormProps {
  mode: AuthMode;
  action: AuthFormAction;
}

const authContent: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
    pendingLabel: string;
    switchText: string;
    switchLabel: string;
    switchHref: string;
  }
> = {
  login: {
    title: "Masuk ke Kasflow",
    description: "Masuk pakai email dan password yang sudah terdaftar.",
    submitLabel: "Masuk",
    pendingLabel: "Loading...",
    switchText: "Belum punya akun?",
    switchLabel: "Daftar di sini",
    switchHref: "/signup",
  },
  signup: {
    title: "Buat akun baru",
    description: "Daftar cepat untuk mulai menggunakan Kasflow.",
    submitLabel: "Buat akun",
    pendingLabel: "Loading...",
    switchText: "Sudah punya akun?",
    switchLabel: "Masuk di sini",
    switchHref: "/login",
  },
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialAuthActionState);
  const content = authContent[mode];

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {content.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {content.description}
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </span>
          <span className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 focus-within:border-zinc-400">
            <Mail className="h-4 w-4 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </span>
          {state.fieldErrors?.email ? (
            <p className="mt-2 text-sm text-red-600">
              {state.fieldErrors.email[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Password
          </span>
          <span className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 focus-within:border-zinc-400">
            <LockKeyhole className="h-4 w-4 text-zinc-400" />
            <input
              type="password"
              name="password"
              placeholder="Minimal 8 karakter"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </span>
          {state.fieldErrors?.password ? (
            <p className="mt-2 text-sm text-red-600">
              {state.fieldErrors.password[0]}
            </p>
          ) : null}
        </label>

        {state.message ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              state.status === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <AuthSubmitButton
          label={content.submitLabel}
          pendingLabel={content.pendingLabel}
        />
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        {content.switchText}{" "}
        <Link
          href={content.switchHref}
          className="font-semibold text-zinc-900 hover:underline"
        >
          {content.switchLabel}
        </Link>
      </p>
    </div>
  );
}
