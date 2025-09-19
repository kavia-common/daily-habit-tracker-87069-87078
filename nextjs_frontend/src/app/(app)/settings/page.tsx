"use client";

import { useState } from "react";
import { useUser, UserProfile } from "@clerk/nextjs";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings page shows account information and theme preview using Clerk user data. */
  const { user } = useUser();

  // Optional theme preview toggle (local-only)
  const [themePreview, setThemePreview] = useState<"light" | "dark">("light");

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="o-card p-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>Settings</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
          Manage your account preferences and preview the Ocean Professional theme.
        </p>
      </section>

      {/* Account Info */}
      <section className="o-card p-6 space-y-6">
        <div>
          <h3 className="text-base font-medium" style={{ color: "var(--color-primary)" }}>Account</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
            Your core account details powered by Clerk.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--color-secondary)" }}>Email</p>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                {user?.primaryEmailAddress?.emailAddress ?? "Unknown"}
              </p>
            </div>
            <div className="rounded-md p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--color-secondary)" }}>User ID</p>
              <p className="mt-1 truncate text-sm" style={{ color: "var(--color-primary)" }}>
                {user?.id ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Clerk user profile management */}
        <div className="rounded-lg border border-gray-200 p-4">
          <UserProfile
            appearance={{
              variables: { colorPrimary: "#111827" },
              elements: { card: "shadow-none" },
            }}
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="o-card p-6">
        <h3 className="text-base font-medium" style={{ color: "var(--color-primary)" }}>Appearance</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>Theme: Ocean Professional</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setThemePreview("light")}
              className={`rounded-md px-3 py-1 text-sm border ${
                themePreview === "light"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setThemePreview("dark")}
              className={`rounded-md px-3 py-1 text-sm border ${
                themePreview === "dark"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Dark
            </button>
          </div>
          <span className="text-sm" style={{ color: "var(--color-secondary)" }}>(Preview only)</span>
        </div>

        {/* Preview Card */}
        <div
          className={`mt-4 rounded-lg border p-4 ${
            themePreview === "dark"
              ? "border-gray-700 bg-gray-900 text-gray-100"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          <p className="text-sm font-medium">Preview</p>
          <p
            className={`mt-1 text-sm ${
              themePreview === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Minimalist interface with generous whitespace and subtle accents.
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full bg-emerald-500`}
              style={{ width: "45%" }}
            />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="o-card p-6">
        <h3 className="text-base font-medium" style={{ color: "var(--color-primary)" }}>Danger zone</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
          Delete your account and all associated data.
        </p>
        <div className="mt-4 rounded-md border p-4" style={{ borderColor: "#FECACA", background: "#FEF2F2" }}>
          <p className="text-sm" style={{ color: "#B91C1C" }}>
            Account deletion is not yet available. This is a placeholder. Please contact support
            if you need your data removed.
          </p>
          <button
            disabled
            className="mt-3 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium opacity-60"
            style={{ color: "#DC2626", borderColor: "#FCA5A5", background: "#FFFFFF" }}
          >
            Delete account (coming soon)
          </button>
        </div>
      </section>
    </div>
  );
}
