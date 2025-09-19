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
  // Normalize redirect to avoid empty or malformed values
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
      setErrorMsg(error.message);
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
      setErrorMsg(error.message);
    } else {
      setStatus("idle");
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to HabitFlow</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to track your daily habits and stay consistent.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-0"
              />
              <p className="mt-1 text-xs text-gray-500">
                We&apos;ll send you a secure sign-in link.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send magic link"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={status === "sending"}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          {status === "sent" && (
            <p className="mt-4 text-sm text-green-600">
              Magic link sent! Please check your email.
            </p>
          )}
          {status === "error" && errorMsg && (
            <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  /** This is a public function. */
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
