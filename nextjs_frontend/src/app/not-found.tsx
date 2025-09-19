import Link from "next/link";

export const metadata = {
  title: "Page Not Found • HabitFlow",
  description: "The page you’re looking for doesn’t exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <section
        className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-3xl font-semibold text-gray-900">404 — Page Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="o-btn o-btn-primary"
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="o-btn o-btn-outline"
            aria-label="Back to Home"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          If you believe this is an error, please retry or navigate using the menu.
        </p>
      </section>
    </main>
  );
}
