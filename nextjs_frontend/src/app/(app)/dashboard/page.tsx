"use client";

import { useEffect, useMemo, useState } from "react";
import { SignedIn, useUser } from "@clerk/nextjs";
import QuoteBanner from "@/components/QuoteBanner";
import HabitCard from "@/components/HabitCard";
import AddHabitModal from "@/components/AddHabitModal";
import { fetchHabits, fetchHabitLogsForRange } from "@/lib/dataClient";
import type { Habit, HabitLog } from "@/lib/types";
import { getLastNDates } from "@/lib/date";
import AnalyticsPanel from "@/components/AnalyticsPanel";

export default function DashboardPage() {
  // PUBLIC_INTERFACE
  /** Dashboard with quote banner, habits grid, daily toggling, streaks, and FAB for adding habits. */
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? "";

  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  const analyticsDays = useMemo(() => getLastNDates(30), []);
  // kept for 7-day UI rendering; analytics has its own range
  // const start = days[0];
  // const end = days[days.length - 1];
  const analyticsStart = analyticsDays[0];
  const analyticsEnd = analyticsDays[analyticsDays.length - 1];

  const refresh = async () => {
    if (!userId) return;
    setLoading(true);
    const [{ data: hs }, { data: lg }] = await Promise.all([
      fetchHabits(userId),
      fetchHabitLogsForRange(userId, analyticsStart, analyticsEnd),
    ]);
    setHabits(hs);
    setLogs(lg);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded && userId) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId]);

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
    <SignedIn>
      <div className="space-y-6 relative">
        <QuoteBanner />

        <section className="o-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold" style={{ color: "var(--color-primary)" }}>
                Your Habits
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
                Keep the momentum. Tiny progress every day.
              </p>
            </div>
            <button
              onClick={() => setOpenAdd(true)}
              className="o-btn o-btn-primary"
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
                <div key={h.id} className="transition-transform duration-200 hover:-translate-y-0.5">
                  <HabitCard
                    userId={userId}
                    habit={h}
                    completedDates={completedByHabit.get(h.id) ?? []}
                    onChanged={refresh}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Analytics / Insights */}
        <section>
          <AnalyticsPanel habits={habits} logs={logs} />
        </section>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setOpenAdd(true)}
            className="h-14 w-14 rounded-full bg-gray-900 text-white text-2xl shadow-lg hover:bg-gray-800 fab-pulse relative"
            aria-label="Add habit"
            title="Add habit"
          >
            +
            <span className="absolute -top-9 right-0 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded opacity-90 hidden sm:block">
              Add habit
            </span>
          </button>
        </div>

        <AddHabitModal userId={userId} open={openAdd} onClose={() => setOpenAdd(false)} onCreated={refresh} />
      </div>
    </SignedIn>
  );
}


