"use client";

import { SignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * A sleek, car-themed, emoji-rich sign-in experience powered by Clerk.
 * - Shows a modern hero with playful but professional car visuals and streak charts
 * - Renders Clerk SignIn with email/passwordless/providers
 * - Redirects to dashboard when already signed in
 */
export default function LoginPage() {
  /** This is a public function. */
  const router = useRouter();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-900 text-white flex items-center justify-center shadow-sm">
            <span className="text-sm font-semibold select-none">HF</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">HabitFlow</h1>
            <p className="text-sm text-gray-500">Track better. Drive daily progress.</p>
          </div>
        </div>
      </header>

      {/* Hero + Card */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mx-auto w-full max-w-7xl px-6 py-10">
        {/* Left: Visual / Charts */}
        <section className="order-2 lg:order-1">
          <div className="o-card p-6 overflow-hidden">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>🚗</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your daily drive to great habits</h2>
                <p className="text-sm text-gray-500">Smooth, minimalist, and blazing fast.</p>
              </div>
            </div>

            {/* Simple chart placeholders */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Streak meter</p>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: "72%" }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">🔥 21-day streak</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Weekly momentum</p>
                <div className="mt-3 flex items-end gap-2 h-20">
                  {[40, 70, 55, 85, 65, 90, 60].map((h, i) => (
                    <div key={i} className="w-5 rounded-t bg-gray-900/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">📈 Consistency on the rise</p>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Pro tip: Tiny wins compound. Start your engine and keep it rolling. 🏁
              </p>
            </div>
          </div>
        </section>

        {/* Right: Clerk SignIn */}
        <section className="order-1 lg:order-2">
          <div className="o-card p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
              <p className="text-sm text-gray-500">Welcome back! Continue your journey.</p>
            </div>

            <SignedOut>
              <SignIn
                signUpUrl="/login"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
                appearance={{
                  variables: {
                    colorPrimary: "#111827",
                    colorText: "#111827",
                    colorBackground: "#FFFFFF",
                  },
                  elements: {
                    formButtonPrimary: "o-btn o-btn-primary",
                    card: "shadow-none border border-gray-200 rounded-lg",
                  },
                }}
              />
            </SignedOut>

            <SignedIn>
              {router.replace("/dashboard")}
            </SignedIn>

            <p className="mt-4 text-xs text-gray-500 text-center">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        Built with ❤️ for habits. Smooth like a well-tuned engine.
      </footer>
    </div>
  );
}
