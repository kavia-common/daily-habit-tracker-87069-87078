"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * Minimal login page offering magic link via email and Google OAuth.
 * Redirects to target page if already authenticated.
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const normalizedRedirect =
    typeof redirect === "string" && redirect.trim().startsWith("/") ? redirect : "/dashboard";
  const { isAuthenticated, initializing, signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      router.replace(normalizedRedirect);
    }
  }, [initializing, isAuthenticated, router, normalizedRedirect]);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    const { error } = await signInWithEmail(email);
    if (error) {
      setStatus("error");
      const raw = error.message || "";
      const friendly =
        raw.includes("not configured") || raw.includes("Missing NEXT_PUBLIC")
          ? "Authentication is temporarily unavailable due to missing configuration. Please try again later."
          : raw || "Failed to send magic link. Please try again.";
      setErrorMsg(friendly);
    } else {
      setStatus("sent");
    }
  };

  const handleGoogle = async () => {
    setStatus("sending");
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus("error");
      const raw = error.message || "";
      const friendly =
        raw.includes("not configured") || raw.includes("Missing NEXT_PUBLIC")
          ? "Google sign-in is unavailable due to missing configuration. Please contact the administrator."
          : raw || "Failed to start Google sign-in. Please try again.";
      setErrorMsg(friendly);
    } else {
      setStatus("idle");
    }
  };

  // Loading skeleton for initialization
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div
          aria-hidden
          className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen o-gradient flex flex-col">
      {/* Top brand header */}
      <header className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gray-900/90 text-white flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold select-none">HF</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">HabitFlow</h1>
              <p className="text-sm text-gray-500">Minimal daily habit tracker</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16 pt-2">
        <div className="w-full max-w-md">
          {/* Elevated card */}
          <div className="o-card relative overflow-hidden">
            {/* Subtle decorative top bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gray-900/90" />

            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Welcome back. Continue with your email or Google.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full rounded-md border o-border px-3 py-2.5 text-gray-900 placeholder-gray-400 transition-[border,box-shadow] focus:border-gray-400 focus:outline-none focus:ring-0"
                    />
                    {/* Micro-interaction: focus border cue handled via transition */}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We&apos;ll send you a secure, time-limited sign-in link.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="o-btn o-btn-primary w-full disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send magic link"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={status === "sending"}
                className="o-btn o-btn-outline w-full disabled:opacity-60"
              >
                Continue with Google
              </button>

              {status === "sent" && (
                <div
                  role="status"
                  className="mt-5 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
                >
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden />
                  <p>Magic link sent! Please check your email.</p>
                </div>
              )}
              {status === "error" && errorMsg && (
                <div
                  role="alert"
                  className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </main>

      {/* Footer spacing for balance */}
      <footer aria-hidden className="pb-8" />
    </div>
  );
}

export default function LoginPage() {
  /** This is a public function. */
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
