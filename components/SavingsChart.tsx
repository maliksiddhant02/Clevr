"use client";

import { useState } from "react";
import { formatAud } from "@/lib/money";

// Sample data until payments are queried by shopper_cookie. TECHNICAL.md §14.
const RANGES = {
  week: [
    { label: "Mon", cents: 5 },
    { label: "Tue", cents: 12 },
    { label: "Wed", cents: 0 },
    { label: "Thu", cents: 21 },
    { label: "Fri", cents: 9 },
    { label: "Sat", cents: 34 },
    { label: "Sun", cents: 15 },
  ],
  month: [
    { label: "1–7", cents: 41 },
    { label: "8–14", cents: 63 },
    { label: "15–21", cents: 28 },
    { label: "22–28", cents: 74 },
    { label: "29+", cents: 29 },
  ],
} as const;

type Range = keyof typeof RANGES;

export function SavingsChart() {
  const [range, setRange] = useState<Range>("week");
  const bars = RANGES[range];
  const peak = Math.max(...bars.map((b) => b.cents));
  const total = bars.reduce((sum, b) => sum + b.cents, 0);

  return (
    <section aria-labelledby="chart-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="chart-heading" className="font-display text-2xl">
          Kept by you
        </h2>
        {/* Segmented control — a real toggle, not a decorative one. */}
        <div
          role="group"
          aria-label="Time range"
          className="border-ink rounded-wobble-sm flex gap-1 border-2 bg-white p-1"
        >
          {(["week", "month"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-wobble-sm min-h-9 px-3 text-lg capitalize transition-all duration-100 ${
                range === r ? "bg-ink text-paper" : "hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="font-money mb-4 text-4xl">{formatAud(total)}</div>

      <ul className="border-ink flex h-40 items-end justify-between gap-2 border-b-2 border-dashed pb-0">
        {bars.map((bar, i) => (
          <li
            key={bar.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="font-exact text-xs">
              {bar.cents > 0 ? formatAud(bar.cents) : ""}
            </span>
            <div
              // Height is data, not styling — the only inline style in the app.
              style={{ height: `${Math.max((bar.cents / peak) * 100, 4)}%` }}
              className={`border-ink rounded-wobble-sm w-full border-2 ${
                i === bars.length - 1 ? "bg-marker" : "bg-pen"
              }`}
              role="img"
              aria-label={`${bar.label}: ${formatAud(bar.cents)} kept`}
            />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between">
        {bars.map((bar) => (
          <span key={bar.label} className="flex-1 text-center text-base">
            {bar.label}
          </span>
        ))}
      </div>
    </section>
  );
}
