"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Home
 * Entry route that redirects users based on authentication status.
 * - Authenticated: go to /dashboard
 * - Unauthenticated: go to /login
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    if (initializing) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [initializing, isAuthenticated, router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-600">
      Loading...
    </main>
  );
}
