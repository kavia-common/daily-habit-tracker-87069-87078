"use client";

import { useState } from "react";
import { createHabit } from "@/lib/dataClient";

// PUBLIC_INTERFACE
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
  /** Simple controlled modal to add a new habit. */
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-0 sm:p-4">
      <div className="w-full sm:max-w-md sm:rounded-lg rounded-t-lg o-card" style={{ boxShadow: "var(--shadow-md)" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h3 className="text-base font-medium" style={{ color: "var(--color-primary)" }}>Add a habit</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Close"
            style={{ color: "var(--color-secondary)" }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="habit" className="block text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              Habit name
            </label>
            <input
              id="habit"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="mt-1 block w-full shadow-sm"
            />
          </div>
          {error && <p className="text-sm" style={{ color: "var(--color-error)" }}>{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="o-btn o-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="o-btn o-btn-primary disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
