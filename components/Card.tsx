import type { ReactNode } from "react";

/**
 * A Paper surface on the Sun canvas. No border and no shadow: the fill is the
 * boundary. Emphasis is not a card variant in this system, it is a full-bleed
 * band written inline at the point of use. See DESIGN.md §1.
 */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bg-card rounded-2xl p-5 ${className}`}>{children}</div>;
}
