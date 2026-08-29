"use client";

import { useState } from "react";
import { ChartUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
    <div className="bg-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div
          role="group"
          aria-label="Time range"
          className="bg-background flex gap-0.5 rounded-full p-0.5"
        >
          {(["week", "month"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`min-h-11 rounded-full px-4 text-[0.8125rem] font-medium capitalize transition-colors duration-200 ${
                range === r ? "bg-foreground text-paper" : "text-foreground"
              }`}
            >
              This {r}
            </button>
          ))}
        </div>
        <span className="text-success inline-flex items-center gap-1 text-[0.8125rem] font-semibold tabular-nums">
          <HugeiconsIcon icon={ChartUpIcon} size={14} strokeWidth={2.4} aria-hidden />
          {delta}
        </span>
      </div>

      <p className="display text-foreground mb-1.5 text-[3rem] tabular-nums">
        {formatAud(total)}
      </p>
      <p className="text-muted-foreground mb-4 text-[0.8125rem]">
        kept by paying from your bank
      </p>

      <AreaChart data={bars} />
    </div>
  );
}
