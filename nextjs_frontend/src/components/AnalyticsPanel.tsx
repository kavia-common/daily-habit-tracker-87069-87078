"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import type { Habit, HabitLog } from "@/lib/types";
import { getLastNDates } from "@/lib/date";
import { computeCurrentStreak } from "@/lib/streak";

/**
 * PUBLIC_INTERFACE
 * AnalyticsPanel
 * Displays:
 * - Completion rate over time (last 30 days) area chart
 * - Streak metrics (current and longest) with progress
 * - Weekly compact heatmap (last 7 days)
 * - Optional category breakdown (if categories available in Habit titles as #tag)
 */
export default function AnalyticsPanel({
  habits,
  logs,
}: {
  habits: Habit[];
  logs: HabitLog[];
}) {
  /** Modern, minimalist analytics widget grid matching the Ocean Professional style. */
  // Prepare date helpers
  const last30 = useMemo(() => getLastNDates(30), []);
  const last7 = useMemo(() => getLastNDates(7), []);

  // Map date -> total done count for rate; and compute rate
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of last30) map.set(d, 0);
    for (const l of logs) {
      if (map.has(l.date)) map.set(l.date, (map.get(l.date) || 0) + 1);
    }
    return map;
  }, [logs, last30]);

  const completionRateData = useMemo(() => {
    const totalHabits = habits.length || 1; // avoid divide by zero
    return last30.map((d) => {
      const finished = byDate.get(d) || 0;
      const rate = Math.round((finished / totalHabits) * 100);
      return { date: d.slice(5), rate, finished };
    });
  }, [byDate, last30, habits.length]);

  // Compute per-user streak stats from all logs across habits
  const { currentStreak, longestStreak } = useMemo(() => {
    // Build a set of unique completion days across all habits
    const set = new Set<string>();
    for (const l of logs) set.add(l.date);

    // Current streak up to today
    const cur = computeCurrentStreak(set);

    // Longest streak: walk through sorted dates and find max consecutive run
    const sorted = Array.from(set).sort();
    let longest = 0;
    let run = 0;
    let prev: string | null = null;
    for (const d of sorted) {
      if (!prev) {
        run = 1;
      } else {
        // check if consecutive day
        const prevDate = dayjs(prev);
        if (dayjs(d).diff(prevDate, "day") === 1) {
          run += 1;
        } else {
          longest = Math.max(longest, run);
          run = 1;
        }
      }
      prev = d;
    }
    longest = Math.max(longest, run);
    return { currentStreak: cur, longestStreak: longest };
  }, [logs]);

  // Weekly mini heatmap: for last 7 days compute total finished
  const weekBars = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of last7) map.set(d, 0);
    for (const l of logs) {
      if (map.has(l.date)) map.set(l.date, (map.get(l.date) || 0) + 1);
    }
    return last7.map((d) => ({ day: d.slice(5), count: map.get(d) || 0 }));
  }, [logs, last7]);

  // Optional category breakdown - parse #tags from habit titles
  const categoryData = useMemo(() => {
    const tagCounts = new Map<string, number>();
    const hasTag = /#([a-zA-Z0-9_-]+)/g;
    for (const h of habits) {
      const matches = h.title.matchAll(hasTag);
      let hadAny = false;
      for (const m of matches) {
        if (!m[1]) continue;
        hadAny = true;
        const tag = m[1].toLowerCase();
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
      // Optionally count uncategorized
      if (!hadAny) tagCounts.set("uncategorized", (tagCounts.get("uncategorized") || 0) + 1);
    }
    const arr = Array.from(tagCounts.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [habits]);

  // Progress percentage of current vs longest
  const streakPct = useMemo(() => {
    const denom = Math.max(1, longestStreak);
    const pct = Math.min(100, Math.round((currentStreak / denom) * 100));
    return pct;
  }, [currentStreak, longestStreak]);

  // Tiny palette aligned to Ocean Professional
  const palette = {
    primary: "rgba(55, 65, 81, 1)", // #374151
    primarySoft: "rgba(55, 65, 81, 0.15)",
    success: "rgba(16, 185, 129, 1)", // #10B981
    successSoft: "rgba(16, 185, 129, 0.16)",
    grid: "rgba(229, 231, 235, 0.6)", // #E5E7EB
    text: "var(--color-primary)",
    muted: "var(--color-secondary)",
  };

  return (
    <section className="o-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--color-primary)" }}>
            Insights
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
            Visualize your consistency and trends over time.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completion rate over time */}
        <div className="lg:col-span-2 rounded-xl border o-border p-4 bg-white">
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-primary)" }}>
            Completion rate (last 30 days)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionRateData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.success} stopOpacity={0.32} />
                    <stop offset="95%" stopColor={palette.success} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={palette.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value: number, name) => [value + (name === "rate" ? "%" : ""), name]}
                  labelClassName="text-xs"
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke={palette.success}
                  fill="url(#rateFill)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streaks panel */}
        <div className="rounded-xl border o-border p-4 bg-white">
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-primary)" }}>
            Streaks
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--color-secondary)" }}>Current streak</span>
              <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                {currentStreak} day{currentStreak === 1 ? "" : "s"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "#F3F4F6" }} aria-hidden>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${streakPct}%`, background: palette.success }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--color-secondary)" }}>Longest streak</span>
              <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                {longestStreak} day{longestStreak === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Week compact bars */}
          <div className="mt-5">
            <h5 className="text-xs font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
              This week
            </h5>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekBars} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    labelClassName="text-xs"
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      background: "#fff",
                    }}
                    formatter={(v: number) => [`${v} done`, "Completions"]}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {weekBars.map((entry, index) => {
                      const intensity = Math.min(1, entry.count / Math.max(1, habits.length));
                      const color = `rgba(16,185,129,${0.2 + intensity * 0.6})`;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown (if any tags present) */}
      {categoryData.length > 0 && (
        <div className="mt-6 rounded-xl border o-border p-4 bg-white">
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-primary)" }}>
            Categories
          </h4>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    labelClassName="text-xs"
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      background: "#fff",
                    }}
                    formatter={(v: number, name: string) => [`${v} habit${v === 1 ? "" : "s"}`, name]}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                    cornerRadius={6}
                  >
                    {categoryData.map((entry, idx) => {
                      const base = [55, 65, 81]; // #374151
                      const alpha = 0.4 + (idx / Math.max(1, categoryData.length - 1)) * 0.4;
                      return (
                        <Cell
                          key={`slice-${idx}`}
                          fill={`rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha.toFixed(2)})`}
                        />
                      );
                    })}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value) => (
                      <span style={{ color: "var(--color-primary)", fontSize: 12 }}>{value as string}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {categoryData.map((c) => (
                <div key={c.name} className="o-chip flex items-center justify-between">
                  <span>#{c.name}</span>
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--color-secondary)" }}>
            Tip: add #tags to habit titles like “#fitness Run 3km” to categorize.
          </p>
        </div>
      )}
    </section>
  );
}
