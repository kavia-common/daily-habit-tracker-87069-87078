"use client";

import { ReactNode } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

/**
 * PUBLIC_INTERFACE
 * AppLayout
 * Auth-gated layout powered by Clerk.
 * - Shows Navbar + content when signed in
 * - Redirects to Clerk sign-in when signed out
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  /** This is a public function. */
  return (
    <>
      <SignedIn>
        <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/dashboard" />
      </SignedOut>
    </>
  );
}
