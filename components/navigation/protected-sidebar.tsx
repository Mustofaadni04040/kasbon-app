"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  Menu,
  WalletCards,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/charts",
    label: "Charts",
    icon: BarChart3,
  },
] as const;

interface ProtectedSidebarProps {
  userEmail?: string;
}

function getDesktopNavItemClassName(isActive: boolean): string {
  return isActive
    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
    : "border-transparent bg-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950";
}

function getMobileNavItemClassName(isActive: boolean): string {
  return isActive
    ? "border-zinc-900 bg-zinc-900 text-white"
    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50";
}

export function ProtectedSidebar({ userEmail }: ProtectedSidebarProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <div className="md:hidden">
        <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
                  <WalletCards className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-950">
                    Kasflow App
                  </p>
                  <p className="text-xs text-zinc-500">Navigation menu</p>
                </div>
              </div>
              {userEmail ? (
                <p className="mt-3 truncate text-xs text-zinc-500">
                  {userEmail}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation overlay"
          />

          <div className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-r border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-5">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">
                      Kasflow App
                    </p>
                    <p className="text-xs text-zinc-500">
                      Hiring task navigation
                    </p>
                  </div>
                </div>
                {userEmail ? (
                  <p className="mt-3 break-all text-xs text-zinc-500">
                    {userEmail}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <nav className="flex flex-col gap-3">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${getMobileNavItemClassName(
                        isActive,
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto border-t border-zinc-100 pt-5">
              <LogoutButton className="w-full justify-center" />
            </div>
          </div>
        </div>
      ) : null}

      <aside className="hidden md:flex md:h-[calc(100vh-4rem)] md:w-80 md:flex-col md:justify-between md:rounded-4xl md:border md:border-zinc-200 md:bg-white md:p-5 md:shadow-sm md:sticky md:top-8">
        <div>
          <div className="border-b border-zinc-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
                <WalletCards className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Kasflow App
                </p>
                <p className="text-xs text-zinc-500">Personal debt tracker</p>
              </div>
            </div>

            {userEmail ? (
              <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Logged In
                </p>
                <p className="mt-1 break-all text-sm font-medium text-zinc-800">
                  {userEmail}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-5">
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Main Navigation
            </p>
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl border px-3 py-3 transition ${getDesktopNavItemClassName(
                      isActive,
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-zinc-100 text-zinc-700 group-hover:bg-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 transition ${
                        isActive ? "text-white" : "text-zinc-400"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-5">
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Session
          </p>
          <LogoutButton className="w-full justify-center" />
        </div>
      </aside>
    </>
  );
}
