"use client";

import { motion } from "motion/react";
import { formatAud } from "@/lib/money";

const W = 320;
const H = 132;
const PAD_X = 6;
const PAD_TOP = 14;
const PAD_BOTTOM = 22;

/** Render direct straight lines connecting coordinates like a normal stock graph */
function straightPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
}

export function AreaChart({
  data,
}: {
  data: readonly { label: string; cents: number }[];
}) {
  const peak = Math.max(...data.map((d) => d.cents), 1);
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;

  const pts = data.map((d, i) => ({
    x: PAD_X + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD_TOP + (1 - d.cents / peak) * innerH,
  }));

  const line = straightPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${PAD_TOP + innerH} L ${pts[0].x} ${PAD_TOP + innerH} Z`;
  const peakIndex = data.findIndex((d) => d.cents === peak);
  const marker = pts[peakIndex];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-33 w-full overflow-visible"
        role="img"
        aria-label={`Kept per period. Peak of ${formatAud(peak)} at ${data[peakIndex].label}.`}
      >
        {/* Baseline only. Gridlines would compete with the fill. */}
        <line
          x1={PAD_X}
          y1={PAD_TOP + innerH}
          x2={W - PAD_X}
          y2={PAD_TOP + innerH}
          stroke="var(--color-foreground)"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Flat wash, no gradient: the system has no gradients anywhere. */}
        <motion.path
          d={area}
          fill="var(--color-muted)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Drop line and marker at the peak with nice entrance delay. */}
        <motion.line
          x1={marker.x}
          y1={marker.y}
          x2={marker.x}
          y2={PAD_TOP + innerH}
          stroke="var(--color-foreground)"
          strokeWidth="1"
          strokeDasharray="3 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
        <motion.circle
          cx={marker.x}
          cy={marker.y}
          r="4"
          fill="var(--color-foreground)"
          stroke="var(--color-card)"
          strokeWidth="2.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.75 }}
        />
      </svg>

      <div className="text-muted-foreground mt-1 flex justify-between text-[0.8125rem]">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={i === peakIndex ? "text-foreground font-semibold" : ""}
          >
            {d.label}
          </span>
        ))}
      </div>
    </figure>
  );
}
