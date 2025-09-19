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
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
      <p className="text-gray-800">
        {quote?.text ?? "Stay consistent. Your future self will thank you."}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        — {quote?.author ?? "HabitFlow"}
      </p>
    </div>
  );
}
