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

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-gray-100 text-gray-900"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <header className="w-full bg-white border-b o-border">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold" style={{ color: "var(--color-accent)" }}>
            HabitFlow
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/settings" className={linkClass("/settings")}>
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
