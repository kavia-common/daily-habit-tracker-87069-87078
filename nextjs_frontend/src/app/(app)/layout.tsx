"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * AppLayout
 * Client-side gated layout for authenticated app routes.
 * Redirects unauthenticated users to /login and renders Navbar + content for authenticated users.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  /** This is a public function. */
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    if (!initializing) {
      if (!isAuthenticated) {
        // If user is not authenticated, redirect to login.
        router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      }
    }
  }, [initializing, isAuthenticated, router, pathname]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // While redirecting
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
