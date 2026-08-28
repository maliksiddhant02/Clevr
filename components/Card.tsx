import type { ReactNode } from "react";

const TONE = {
  // Pure white against the warm canvas is what creates the lift.
  card: "bg-card border border-border shadow-md",
  muted: "bg-muted border border-border",
  // Inverted section: dramatic rhythm, and the dot texture stops it going flat.
  inverted:
    "bg-foreground text-background border border-foreground shadow-lg bg-[radial-gradient(circle,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:22px_22px]",
} as const;

type CardProps = {
  children: ReactNode;
  tone?: keyof typeof TONE;
  className?: string;
};

export function Card({ children, tone = "card", className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl p-5 ${TONE[tone]} ${className}`}>
      {children}
    </div>
  );
}
