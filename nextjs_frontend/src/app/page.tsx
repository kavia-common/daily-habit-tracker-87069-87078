"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Home
 * Redirects users based on Clerk session:
 * - Signed in -> /dashboard
 * - Signed out -> /login
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // No-op: actual content based on SignedIn/SignedOut below
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-600">
      <SignedIn>{router.replace("/dashboard")}</SignedIn>
      <SignedOut>{router.replace("/login")}</SignedOut>
    </main>
  );
}
