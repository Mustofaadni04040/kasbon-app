import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";

const folderItems = [
  "app",
  "components",
  "lib",
  "types",
  "validations",
  "supabase",
] as const;

const nextSteps = [
  "Install dependency Supabase dan validation library",
  "Setup schema database, migration, dan RLS",
  "Implement auth flow login, signup, dan logout",
  "Buat API debts dan dashboard utama",
] as const;

export function AppShell() {
  return (
    <main className="flex min-h-screen flex-1 bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
            <Wallet className="h-4 w-4" />
            <span>Kasflow App</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Next.js 16 starter siap untuk hiring task
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base">
            Project ini sudah memakai App Router, TypeScript, dan Tailwind CSS
            v4. Struktur folder inti juga sudah disiapkan supaya implementasi
            auth, database, API, dan dashboard bisa lanjut dengan rapi.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Masuk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Buat akun
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Folder inti</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              {folderItems.map((folderItem) => (
                <li
                  key={folderItem}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 font-mono"
                >
                  {folderItem}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Next step</h2>
            <ol className="mt-4 space-y-3 text-sm text-zinc-600">
              {nextSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
