"use client";

import { useEffect, useState } from "react";
import { fetchQuote } from "@/lib/quote";
import type { Quote } from "@/lib/types";

// PUBLIC_INTERFACE
export default function QuoteBanner() {
  /** Displays a motivational quote with subtle Ocean Professional styling. */
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchQuote().then((q) => {
      if (mounted) setQuote(q);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-lg o-border p-5 o-gradient" style={{ borderWidth: 1 }}>
      <p style={{ color: "var(--color-primary)" }}>
        {quote?.text ?? "Stay consistent. Your future self will thank you."}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--color-secondary)" }}>
        — {quote?.author ?? "HabitFlow"}
      </p>
    </div>
  );
}
