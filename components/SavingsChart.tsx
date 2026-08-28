"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart } from "@/components/AreaChart";
import { formatAud } from "@/lib/money";

// Sample data until payments are queried by shopper_cookie. TECHNICAL.md §14.
const RANGES = {
  week: {
    delta: "+4.2%",
    bars: [
      { label: "Mon", cents: 5 },
      { label: "Tue", cents: 12 },
      { label: "Wed", cents: 3 },
      { label: "Thu", cents: 21 },
      { label: "Fri", cents: 9 },
      { label: "Sat", cents: 34 },
      { label: "Sun", cents: 15 },
    ],
  },
  month: {
    delta: "+8.6%",
    bars: [
      { label: "1 Aug", cents: 41 },
      { label: "8 Aug", cents: 63 },
      { label: "15 Aug", cents: 28 },
      { label: "22 Aug", cents: 74 },
      { label: "29 Aug", cents: 52 },
    ],
  },
} as const;

type Range = keyof typeof RANGES;

export function SavingsChart() {
  const [range, setRange] = useState<Range>("month");
  const { bars, delta } = RANGES[range];
  const total = bars.reduce((sum, b) => sum + b.cents, 0);

  return (
    <div className="border-border bg-card rounded-2xl border p-5 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div
          role="group"
          aria-label="Time range"
          className="bg-muted flex gap-0.5 rounded-full p-0.5"
        >
          {(["week", "month"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`min-h-8 rounded-full px-3 text-[0.8125rem] font-medium capitalize transition-all duration-200 ${
                range === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              This {r}
            </button>
          ))}
        </div>
        <span className="text-success inline-flex items-center gap-1 text-[0.8125rem] font-semibold">
          <TrendingUp size={14} strokeWidth={2.4} aria-hidden />
          {delta}
        </span>
      </div>

      <p className="mb-1 text-3xl font-semibold tracking-[-0.02em]">
        {formatAud(total)}
      </p>
      <p className="text-muted-foreground mb-4 text-[0.8125rem]">
        kept by paying from your bank
      </p>

      <AreaChart data={bars} id={`savings-${range}`} />
    </div>
  );
}
