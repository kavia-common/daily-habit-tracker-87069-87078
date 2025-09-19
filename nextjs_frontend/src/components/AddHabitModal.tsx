"use client";

import { useEffect, useRef, useState } from "react";
import { createHabit } from "@/lib/dataClient";

/**
 * PUBLIC_INTERFACE
 * AddHabitModal
 * Glassmorphic modal/sheet with subtle springy transitions and mobile-first layout.
 */
export default function AddHabitModal({
  userId,
  open,
  onClose,
  onCreated,
}: {
  userId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  /** Controlled modal to add a new habit with enhanced visuals. */
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const reset = () => {
    setTitle("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a habit name.");
      return;
    }
    setSubmitting(true);
    const { error } = await createHabit(userId, { title: title.trim() });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    reset();
    onCreated();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.35) 100%)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        ref={containerRef}
        className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(243,244,246,0.6))",
          border: "1px solid var(--color-border)",
          boxShadow:
            "0 12px 32px rgba(17,24,39,0.25), inset 0 1px rgba(255,255,255,0.6)",
          transform: "translateY(0)",
          animation: "modalIn 260ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 sticky top-0 bg-transparent"
          style={{ borderBottom: "1px solid var(--color-border)", boxShadow: "0 1px 0 rgba(255,255,255,0.6)" }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 sm:hidden">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" aria-hidden />
          </div>
          <h3 className="text-base font-semibold" style={{ color: "var(--color-primary)" }}>
            Add a habit
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 transition-colors hover:bg-gray-100"
            aria-label="Close"
            style={{ color: "var(--color-secondary)" }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="habit"
              className="block text-sm font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Habit name
            </label>
            <input
              id="habit"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="mt-1 block w-full shadow-sm"
              autoFocus
            />
            <p className="mt-1 text-xs" style={{ color: "var(--color-secondary)" }}>
              Tip: add an emoji prefix for flair (e.g., 📚 Read 10 pages)
            </p>
          </div>
          {error && (
            <p className="text-sm" style={{ color: "var(--color-error)" }}>
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="o-btn o-btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="o-btn o-btn-primary disabled:opacity-60 active:scale-[0.98]"
            >
              {submitting ? "Adding..." : "Add habit"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from {
            transform: translateY(12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
