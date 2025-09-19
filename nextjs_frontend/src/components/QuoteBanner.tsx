"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchQuote } from "@/lib/quote";
import type { Quote } from "@/lib/types";

/**
 * PUBLIC_INTERFACE
 * QuoteBanner
 * A glassy banner with a lightweight carousel rotating through fetched and fallback quotes.
 */
export default function QuoteBanner() {
  /** Displays a motivational quote carousel with subtle animations. */
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    // Fetch one remote quote and mix with two curated fallbacks
    fetchQuote().then((q) => {
      if (!mounted) return;
      const curated: Quote[] = [
        q,
        { text: "Consistency is what transforms average into excellence.", author: "Tony Robbins" },
        { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
      ];
      setQuotes(curated);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % quotes.length);
    }, 5500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [quotes.length]);

  const current = useMemo(() => {
    return quotes[active] ?? { text: "Stay consistent. Your future self will thank you.", author: "HabitFlow" };
  }, [quotes, active]);

  return (
    <div
      className="rounded-2xl relative overflow-hidden p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(243,244,246,0.5))",
        border: "1px solid var(--color-border)",
        boxShadow: "0 6px 18px rgba(17,24,39,0.06), inset 0 1px rgba(255,255,255,0.6)",
      }}
    >
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(16,185,129,0))",
          filter: "blur(8px)",
        }}
      />
      <div className="relative">
        <p
          key={active}
          className="transition-opacity duration-500"
          style={{ color: "var(--color-primary)" }}
        >
          “{current.text}”
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-secondary)" }}>
          — {current.author ?? "Unknown"}
        </p>
      </div>
      {/* carousel indicators */}
      <div className="mt-3 flex gap-1.5">
        {(quotes.length ? quotes : new Array(3).fill(null)).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to quote ${i + 1}`}
            onClick={() => setActive(i)}
            className={[
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-gray-800" : "w-2 bg-gray-300 hover:bg-gray-400",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
