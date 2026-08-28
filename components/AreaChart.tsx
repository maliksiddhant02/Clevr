import { formatAud } from "@/lib/money";

const W = 320;
const H = 132;
const PAD_X = 6;
const PAD_TOP = 14;
const PAD_BOTTOM = 22;

/** Smooth the polyline through midpoints — cheaper than a spline, reads the same. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const midX = (prev.x + cur.x) / 2;
    d += ` Q ${midX} ${prev.y} ${midX} ${(prev.y + cur.y) / 2} Q ${midX} ${cur.y} ${cur.x} ${cur.y}`;
  }
  return d;
}

export function AreaChart({
  data,
  id,
}: {
  data: readonly { label: string; cents: number }[];
  /** Unique per instance: SVG gradient ids are document-global. */
  id: string;
}) {
  const peak = Math.max(...data.map((d) => d.cents), 1);
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;

  const pts = data.map((d, i) => ({
    x: PAD_X + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD_TOP + (1 - d.cents / peak) * innerH,
  }));

  const line = smoothPath(pts);
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
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" />
          </linearGradient>
        </defs>

        {/* Baseline only — gridlines would compete with the fill. */}
        <line
          x1={PAD_X}
          y1={PAD_TOP + innerH}
          x2={W - PAD_X}
          y2={PAD_TOP + innerH}
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        <path d={area} fill={`url(#${id}-fill)`} />
        <path
          d={line}
          fill="none"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="draw-line"
          style={{ ["--draw-length" as string]: "900" }}
        />

        {/* Peak marker, matching the reference's dashed drop line. */}
        <line
          x1={marker.x}
          y1={marker.y}
          x2={marker.x}
          y2={PAD_TOP + innerH}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.4"
        />
        <circle cx={marker.x} cy={marker.y} r="6" fill="var(--color-accent)" opacity="0.18" />
        <circle
          cx={marker.x}
          cy={marker.y}
          r="3.5"
          fill="var(--color-accent)"
          stroke="var(--color-card)"
          strokeWidth="2"
        />
      </svg>

      <div className="text-muted-foreground mt-1 flex justify-between text-[0.6875rem]">
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
