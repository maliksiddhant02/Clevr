import type { ReactNode } from "react";

// Literal class strings only — Tailwind scans source for whole names, so a
// template like `rounded-wobble-${n}` renders square and silently.
const RADIUS = {
  1: "rounded-wobble-1",
  2: "rounded-wobble-2",
  3: "rounded-wobble-3",
} as const;

const TILT = {
  none: "",
  left: "-rotate-1",
  right: "rotate-1",
} as const;

const TONE = {
  paper: "bg-white",
  postit: "bg-postit",
  ink: "bg-ink text-paper",
} as const;

type CardProps = {
  children: ReactNode;
  /** Alternate across repeated cards so they aren't identically irregular. */
  radius?: keyof typeof RADIUS;
  tilt?: keyof typeof TILT;
  tone?: keyof typeof TONE;
  decoration?: "none" | "tape" | "tack";
  className?: string;
};

export function Card({
  children,
  radius = 1,
  tilt = "none",
  tone = "paper",
  decoration = "none",
  className = "",
}: CardProps) {
  return (
    <div
      className={`border-ink shadow-hard relative border-2 p-5 ${RADIUS[radius]} ${TILT[tilt]} ${TONE[tone]} ${className}`}
    >
      {decoration === "tape" && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 border-2 border-dashed border-[#2d2d2d]/25 bg-[#2d2d2d]/10"
        />
      )}
      {decoration === "tack" && (
        <span
          aria-hidden
          className="bg-marker border-ink absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2"
        />
      )}
      {children}
    </div>
  );
}
