import { formatAud } from "@/lib/money";

// A tonal green ramp with one lime spark, not a rainbow: one colour with
// variations tells a story, five unrelated hues tell none.
const COLORS = ["#163300", "#054d28", "#9fe870", "#c9d3c2", "#e2f6d5"] as const;

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
  let offset = 0;

  const slices = segments.map((s, i) => {
    const fraction = s.cents / total;
    const slice = {
      ...s,
      percent: Math.round(fraction * 100),
      color: COLORS[i % COLORS.length],
      dash: fraction * CIRC,
      offset,
    };
    offset += fraction * CIRC;
    return slice;
  });

  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 140 140"
        className="h-33 w-33 shrink-0 -rotate-90"
        role="img"
        aria-label={caption}
      >
        {slices.map((s) => (
          <circle
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
          />
        ))}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-foreground rotate-90 text-[17px] font-bold tabular-nums"
          style={{ transformOrigin: "70px 70px" }}
        >
          {formatAud(totalCents)}
        </text>
        <text
          x="70"
          y="82"
          textAnchor="middle"
          className="fill-muted-foreground rotate-90 text-[10px]"
          style={{ transformOrigin: "70px 70px" }}
        >
          kept
        </text>
      </svg>

      <ul className="min-w-0 flex-1 space-y-2">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[0.8125rem]">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            <span className="text-muted-foreground shrink-0 font-medium tabular-nums">
              {s.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
