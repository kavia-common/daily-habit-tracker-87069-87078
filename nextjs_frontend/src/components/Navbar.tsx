"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Navbar
 * Minimal responsive navbar for authenticated routes.
 * Shows app name, navigation links, and Clerk user controls.
 */
export default function Navbar() {
  /** This is a public function. */
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Determine if a link is active (exact or prefixed path for nested routes)
  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const linkClass = (path: string) =>
    [
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive(path)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
    ].join(" ");

  return (
    <header
      className="w-full bg-white/80 backdrop-blur border-b o-border sticky top-0 z-40"
      role="banner"
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group"
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            <span
              className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-[1.02]"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-contrast)" }}
              aria-hidden
            >
              HF
            </span>
            <span
              className="text-lg font-semibold hover:opacity-90"
              style={{ color: "var(--color-accent)" }}
            >
              HabitFlow
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-2">
            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
              aria-current={isActive("/dashboard") ? "page" : undefined}
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={linkClass("/settings")}
              aria-current={isActive("/settings") ? "page" : undefined}
            >
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden rounded-md p-2 border o-border text-gray-600 hover:bg-gray-50"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
          <SignOutButton>
            <button className="o-btn o-btn-outline hidden sm:inline-flex" aria-label="Logout">
              Logout
            </button>
          </SignOutButton>
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t o-border bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-1">
            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={linkClass("/settings")}
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <SignOutButton>
              <button className="o-btn o-btn-outline mt-1 text-left">Logout</button>
            </SignOutButton>
          </div>
        </div>
      )}
    </header>
  );
}
