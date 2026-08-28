/**
 * The signature section badge: accent dot, uppercase mono, wide tracking.
 * Repeated across screens it becomes the app's orientation rhythm.
 */
export function SectionLabel({
  children,
  pulse = false,
}: {
  children: string;
  pulse?: boolean;
}) {
  return (
    <span className="border-accent/30 bg-accent/5 inline-flex items-center gap-2 rounded-full border px-3 py-1">
      <span
        aria-hidden
        className={`bg-accent h-1.5 w-1.5 rounded-full ${pulse ? "pulse-dot" : ""}`}
      />
      <span className="text-accent font-mono text-[0.6875rem] tracking-[0.15em] uppercase">
        {children}
      </span>
    </span>
  );
}
