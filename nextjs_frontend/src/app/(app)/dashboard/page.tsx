"use client";

import { useEffect, useMemo, useState } from "react";
import QuoteBanner from "@/components/QuoteBanner";
import HabitCard from "@/components/HabitCard";
import AddHabitModal from "@/components/AddHabitModal";
import { fetchHabits, fetchHabitLogsForRange } from "@/lib/dataClient";
import type { Habit, HabitLog } from "@/lib/types";
import { getLastNDates } from "@/lib/date";

export default function DashboardPage() {
  // PUBLIC_INTERFACE
  /** Dashboard with quote banner, habits grid, daily toggling, streaks, and FAB for adding habits. */
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  const days = useMemo(() => getLastNDates(7), []);
  const start = days[0];
  const end = days[days.length - 1];

  const refresh = async () => {
    setLoading(true);
    const [{ data: hs }, { data: lg }] = await Promise.all([
      fetchHabits(),
      fetchHabitLogsForRange(start, end),
    ]);
    setHabits(hs);
    setLogs(lg);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map habitId -> [dates...]
  const completedByHabit = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const h of habits) map.set(h.id, []);
    for (const l of logs) {
      if (!map.has(l.habit_id)) map.set(l.habit_id, []);
      map.get(l.habit_id)!.push(l.date);
    }
    return map;
  }, [habits, logs]);

  return (
    <div className="space-y-6 relative">
      <QuoteBanner />

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">Your Habits</h3>
          <button
            onClick={() => setOpenAdd(true)}
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            aria-label="Add habit"
          >
            + Add
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        ) : habits.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">
            No habits yet. Click “+ Add” to create your first habit.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                completedDates={completedByHabit.get(h.id) ?? []}
                onChanged={refresh}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpenAdd(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gray-900 text-white text-2xl shadow-lg hover:bg-gray-800"
        aria-label="Add habit"
        title="Add habit"
      >
        +
      </button>

      <AddHabitModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={refresh} />
    </div>
  );
}
