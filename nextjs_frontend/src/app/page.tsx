"use client";

import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
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
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-600">
      {/* Render small placeholders to satisfy ReactNode without returning void */}
      <SignedIn><div /></SignedIn>
      <SignedOut><div /></SignedOut>
    </main>
  );
}
