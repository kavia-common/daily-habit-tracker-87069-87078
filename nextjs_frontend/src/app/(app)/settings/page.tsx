"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getURL } from "@/utils/getURL";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings page shows account information, password reset link, account deletion placeholder, and a theme preview toggle. */
  const { user } = useAuth();

  // Prepare a password reset handler using Supabase
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendPasswordReset = async () => {
    if (!supabase) {
      setErrorMsg("Supabase client not configured.");
      setResetState("error");
      return;
    }
    if (!user?.email) {
      setErrorMsg("No email is associated with this account.");
      setResetState("error");
      return;
    }
    setErrorMsg(null);
    setResetState("sending");
    const url = getURL();
    // Supabase email password reset flow
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${url}login`,
    });
    if (error) {
      setErrorMsg(error.message);
      setResetState("error");
    } else {
      setResetState("sent");
    }
  };

  // Optional theme preview toggle (local-only)
  const [themePreview, setThemePreview] = useState<"light" | "dark">("light");

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account preferences. Minimal, Ocean Professional theme.
        </p>
      </section>

      {/* Account Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-base font-medium text-gray-900">Account</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {user?.email ?? "Unknown"}
            </p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">User ID</p>
            <p className="mt-1 truncate text-sm text-gray-900">
              {user?.id ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleSendPasswordReset}
            disabled={resetState === "sending"}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetState === "sending" ? "Sending..." : "Send password reset link"}
          </button>
          {resetState === "sent" && (
            <span className="text-sm text-green-600">Reset email sent. Check your inbox.</span>
          )}
          {resetState === "error" && errorMsg && (
            <span className="text-sm text-red-600">{errorMsg}</span>
          )}
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-base font-medium text-gray-900">Appearance</h3>
        <p className="mt-1 text-sm text-gray-600">Theme: Ocean Professional</p>

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
          <span className="text-sm text-gray-500">(Preview only)</span>
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
              className={`h-2 rounded-full ${
                themePreview === "dark" ? "bg-emerald-500" : "bg-emerald-500"
              }`}
              style={{ width: "45%" }}
            />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-base font-medium text-gray-900">Danger zone</h3>
        <p className="mt-1 text-sm text-gray-600">
          Delete your account and all associated data.
        </p>
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            Account deletion is not yet available. This is a placeholder. Please contact support
            if you need your data removed.
          </p>
          <button
            disabled
            className="mt-3 inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 opacity-60"
          >
            Delete account (coming soon)
          </button>
        </div>
      </section>
    </div>
  );
}
