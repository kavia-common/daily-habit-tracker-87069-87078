"use client";

import { useMemo, useState } from "react";
import type { Habit } from "@/lib/types";
import { getLastNDates, todayYYYYMMDD } from "@/lib/date";
import { computeCurrentStreak, toDaySet, hasCompleted } from "@/lib/streak";
import { toggleHabitForDay, deleteHabit } from "@/lib/dataClient";

/**
 * PUBLIC_INTERFACE
 * HabitCard
 * Premium visual card with:
 * - Glassmorphism container
 * - Animated 7-day toggle pills with haptic-like scale feedback
 * - Tiny sparkline showing recent completion trend (CSS-driven, no deps)
 * - Emoji accent derived from title (first emoji if present, else 🔹)
 */
export default function HabitCard({
  userId,
  habit,
  completedDates,
  onChanged,
}: {
  userId: string;
  habit: Habit;
  completedDates: string[];
  onChanged: () => void;
}) {
  /** Displays a habit with 7-day toggles, streak info, and a lightweight sparkline. */
  const [working, setWorking] = useState(false);
  const days = getLastNDates(7);
  const set = toDaySet(completedDates);
  const streak = computeCurrentStreak(set);

  // Extract first emoji in title; fallback to accent glyph
  const accent = useMemo(() => {
    const match = habit.title.match(
      /([⌚-⌛]|[⏩-⏳]|⏸|⏹|⏺|[Ⓜ-➰]|[➿-⭕]|〰|〽|[㊗㊙]|\u{1F000}-\u{1FAFF})/u
    );
    return match?.[0] ?? "🔹";
  }, [habit.title]);

  const handleToggle = async (day: string) => {
    setWorking(true);
    const { error } = await toggleHabitForDay(userId, habit.id, day);
    setWorking(false);
    if (!error) onChanged();
    // Optional: toast error
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${habit.title}"?`)) return;
    setWorking(true);
    const { error } = await deleteHabit(userId, habit.id);
    setWorking(false);
    if (!error) onChanged();
  };

  const isToday = (d: string) => d === todayYYYYMMDD();

  // Build sparkline points array from last 7 days (1 = done, 0 = not)
  const spark = days.map((d) => (hasCompleted(set, d) ? 1 : 0));
  const sparkHeight = 24;
  const sparkWidth = 80;
  const step = spark.length > 1 ? sparkWidth / (spark.length - 1) : sparkWidth;

  const sparkPath = useMemo(() => {
    if (spark.length === 0) return "";
    const points = spark.map((v, i) => {
      const x = i * step;
      // map 1 -> higher point, 0 -> lower point
      const y = sparkHeight - (v ? sparkHeight * 0.75 : sparkHeight * 0.2);
      return `${x},${y}`;
    });
    return `M ${points[0]} L ${points.slice(1).join(" ")}`;
  }, [spark.join(","), step]);

  return (
    <div
      className="p-4 rounded-2xl relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(249,250,251,0.35))",
        border: "1px solid var(--color-border)",
        boxShadow:
          "0 8px 24px rgba(17,24,39,0.06), inset 0 1px rgba(255,255,255,0.25)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Decorative soft highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(147,197,253,0.25), rgba(147,197,253,0))",
          filter: "blur(6px)",
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg"
            style={{
              background: "#fff",
              border: "1px solid var(--color-border)",
              boxShadow:
                "inset 0 1px rgba(255,255,255,0.9), 0 3px 8px rgba(17,24,39,0.06)",
            }}
          >
            {accent}
          </span>
          <div>
            <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
              {habit.title}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--color-secondary)" }}>
              Streak: <span className="font-medium">{streak}🔥</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-50"
          style={{ color: "var(--color-secondary)" }}
          aria-label={`Delete ${habit.title}`}
          title="Delete habit"
        >
          Delete
        </button>
      </div>

      {/* Sparkline */}
      <div className="mt-3">
        <svg width={sparkWidth} height={sparkHeight} viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} aria-hidden>
          <path
            d={sparkPath}
            fill="none"
            stroke="rgba(16,185,129,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 0 rgba(16,185,129,0.2))" }}
          />
        </svg>
      </div>

      {/* 7-day selector */}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((d) => {
          const done = hasCompleted(set, d);
          return (
            <button
              key={d}
              disabled={working}
              onClick={() => handleToggle(d)}
              className={[
                "h-10 rounded-xl text-xs font-semibold border transition-all select-none",
                "active:scale-[0.98] focus:outline-none",
                done
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                isToday(d) ? "ring-1 ring-gray-200" : "",
              ].join(" ")}
              title={d}
              aria-pressed={done}
              aria-label={`Toggle ${habit.title} for ${d}`}
              style={{
                boxShadow: done
                  ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 8px rgba(16,185,129,0.15)"
                  : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(17,24,39,0.05)",
              }}
            >
              {d.slice(5)}
              {isToday(d) ? " •" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
