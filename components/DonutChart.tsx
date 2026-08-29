"use client";

import { motion } from "motion/react";
import { formatAud } from "@/lib/money";

// A tonal Ink ramp with one Sun spark, not a rainbow: one colour with
// variations tells a story, five unrelated hues tell none. Read on a Paper
// card, so the ramp darkens away from the card rather than from the page.
const COLORS = ["#101010", "#3f3c33", "#ffe500", "#a3a094", "#d6d3c6"] as const;

const R = 52;
const STROKE = 18;
const CIRC = 2 * Math.PI * R;

export function DonutChart({
  segments,
  totalCents,
  caption,
}: {
  segments: readonly { label: string; cents: number }[];
  totalCents: number;
  caption: string;
}) {
  const total = segments.reduce((n, s) => n + s.cents, 0) || 1;

  const slices = segments.reduce<
    { label: string; cents: number; percent: number; color: string; dash: number; offset: number }[]
  >((acc, s, i) => {
    const currentOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    const fraction = s.cents / total;
    acc.push({
      ...s,
      percent: Math.round(fraction * 100),
      color: COLORS[i % COLORS.length],
      dash: fraction * CIRC,
      offset: currentOffset,
    });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-5">
      {/* Whole chart rotates and scales in with a spring animation */}
      <motion.svg
        viewBox="0 0 140 140"
        className="h-33 w-33 shrink-0 -rotate-90"
        role="img"
        aria-label={caption}
        initial={{ rotate: -180, scale: 0.8, opacity: 0 }}
        animate={{ rotate: -90, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
      >
        {slices.map((s, i) => (
          <motion.circle
            key={s.label}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
          />
        ))}
        <motion.text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-foreground rotate-90 text-[17px] font-bold tabular-nums"
          style={{ transformOrigin: "70px 70px" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          {formatAud(totalCents)}
        </motion.text>
        <motion.text
          x="70"
          y="82"
          textAnchor="middle"
          className="fill-muted-foreground rotate-90 text-[10px]"
          style={{ transformOrigin: "70px 70px" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          kept
        </motion.text>
      </motion.svg>

      {/* List items stagger fade-in */}
      <ul className="min-w-0 flex-1 space-y-2">
        {slices.map((s, i) => (
          <motion.li
            key={s.label}
            className="flex items-center gap-2 text-[0.9375rem]"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.3, ease: "easeOut" }}
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            <span className="text-muted-foreground shrink-0 font-medium tabular-nums">
              {s.percent}%
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
