"use client";

import { useState } from "react";
import type { Habit } from "@/lib/types";
import { getLastNDates, todayYYYYMMDD } from "@/lib/date";
import { computeCurrentStreak, toDaySet, hasCompleted } from "@/lib/streak";
import { toggleHabitForDay, deleteHabit } from "@/lib/dataClient";

// PUBLIC_INTERFACE
export default function HabitCard({
  habit,
  completedDates,
  onChanged,
}: {
  habit: Habit;
  completedDates: string[]; // YYYY-MM-DD set for this habit
  onChanged: () => void; // refresh hook
}) {
  /** Displays a habit with 7-day toggles and streak info. */
  const [working, setWorking] = useState(false);
  const days = getLastNDates(7);
  const set = toDaySet(completedDates);
  const streak = computeCurrentStreak(set);

  const handleToggle = async (day: string) => {
    setWorking(true);
    const { error } = await toggleHabitForDay(habit.id, day);
    setWorking(false);
    if (!error) onChanged();
    // Optional: toast error
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${habit.title}"?`)) return;
    setWorking(true);
    const { error } = await deleteHabit(habit.id);
    setWorking(false);
    if (!error) onChanged();
  };

  const isToday = (d: string) => d === todayYYYYMMDD();

  return (
    <div className="o-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium" style={{ color: "var(--color-primary)" }}>{habit.title}</p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-secondary)" }}>Streak: {streak}</p>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-md px-2 py-1 text-xs hover:bg-gray-50"
          style={{ color: "var(--color-secondary)" }}
        >
          Delete
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((d) => {
          const done = hasCompleted(set, d);
          return (
            <button
              key={d}
              disabled={working}
              onClick={() => handleToggle(d)}
              className={`h-10 rounded-md text-sm font-medium border transition ${
                done
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              } ${isToday(d) ? "o-ring" : ""}`}
              title={d}
            >
              {d.slice(5)}{isToday(d) ? " •" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
