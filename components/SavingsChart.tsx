"use client";

import { useState } from "react";
import { ChartUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AreaChart } from "@/components/AreaChart";
import { formatAud } from "@/lib/money";

// Sample data until payments are queried by shopper_cookie. TECHNICAL.md §14.
// Weekly/monthly totals proportional to lib/sample.ts SAVED_CENTS ($418.80
// over 213 days). That averages ~$2/day, but the average is not the shape: a
// week with a television in it is one tall bar and six short ones, and
// flattening that would hide the whole point of a big-ticket payment.
// Deltas are versus the previous period so the % has a referent.
const RANGES = {
  week: {
    delta: "+12% vs last week",
    bars: [
      { label: "Mon", cents: 186 },
      { label: "Tue", cents: 263 },
      { label: "Wed", cents: 201 },
      { label: "Thu", cents: 512 },
      { label: "Fri", cents: 340 },
      { label: "Sat", cents: 1620 },
      { label: "Sun", cents: 118 },
    ],
  },
  month: {
    delta: "+9% vs last month",
    bars: [
      { label: "1 Aug", cents: 1240 },
      { label: "8 Aug", cents: 890 },
      { label: "15 Aug", cents: 2310 },
      { label: "22 Aug", cents: 1105 },
      { label: "29 Aug", cents: 3240 },
    ],
  },
} as const;

type Range = keyof typeof RANGES;

export function SavingsChart() {
  const [range, setRange] = useState<Range>("month");
  const { bars, delta } = RANGES[range];
  const total = bars.reduce((sum, b) => sum + b.cents, 0);

  return (
    <div className="bg-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div
          role="group"
          aria-label="Time range"
          className="bg-background flex gap-0.5 rounded-full p-0.5 shrink-0"
        >
          {(["week", "month"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`h-9 rounded-full px-3.5 text-[0.875rem] font-bold capitalize transition-colors duration-200 cursor-pointer ${
                range === r ? "bg-foreground text-paper" : "text-foreground"
              }`}
            >
              This {r}
            </button>
          ))}
        </div>
        <span className="text-success inline-flex items-center gap-1 text-[0.8125rem] sm:text-[0.9375rem] font-bold shrink-0">
          <HugeiconsIcon icon={ChartUpIcon} size={16} strokeWidth={2.4} aria-hidden />
          {delta}
        </span>
      </div>

      <p className="display text-foreground mb-1.5 text-[3rem] tabular-nums">
        {formatAud(total)}
      </p>
      <p className="text-muted-foreground mb-4 text-[1rem]">
        kept this {range}
      </p>

      <AreaChart data={bars} />
    </div>
  );
}
