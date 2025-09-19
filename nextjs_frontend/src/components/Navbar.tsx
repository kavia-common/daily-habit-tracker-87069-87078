"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Navbar
 * Minimal responsive navbar for authenticated routes.
 * Shows app name, navigation links, and logout action.
 */
export default function Navbar() {
  /** This is a public function. */
  const pathname = usePathname();
  const { signOut } = useAuth();

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
    <header className="w-full bg-white border-b o-border">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold hover:opacity-90"
            style={{ color: "var(--color-accent)" }}
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            HabitFlow
          </Link>
          <div className="hidden md:flex items-center gap-1">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut()}
            className="o-btn o-btn-outline"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
