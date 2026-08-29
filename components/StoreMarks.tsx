/**
 * The two store marks, drawn rather than taken from an icon set. An icon set's
 * "apple" and "play" are that set's interpretation; these are the marks
 * themselves, which is what a store link is supposed to show.
 *
 * The Play mark is the one place in this system that carries colour it did not
 * choose. It is a trademark, not decoration, and a monochrome Play mark reads
 * as a generic triangle. See DESIGN.md 2.
 */

export function AppleMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3.02-.85 1-2.24 1.77-3.38 1.68-.14-1.1.4-2.26 1.06-3.03.75-.87 2.09-1.55 3.44-1.67zM20.9 17.06c-.53 1.23-.79 1.78-1.47 2.87-.95 1.52-2.29 3.41-3.95 3.42-1.48.01-1.86-.96-3.86-.95-2 .01-2.42.97-3.9.96-1.66-.02-2.93-1.72-3.88-3.24C1.2 15.85.92 10.9 2.55 8.27c1.16-1.87 2.99-2.96 4.71-2.96 1.75 0 2.85.96 4.3.96 1.4 0 2.26-.96 4.28-.96 1.53 0 3.15.83 4.31 2.27-3.79 2.08-3.18 7.5.75 9.48z" />
    </svg>
  );
}

export function GooglePlayMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#00A0FF"
        d="M3.6 1.8a1.5 1.5 0 0 0-.6 1.2v18a1.5 1.5 0 0 0 .6 1.2l.1.1L13.8 12v-.2L3.7 1.8h-.1z"
      />
      <path
        fill="#FFC900"
        d="m17.2 15.4-3.4-3.4v-.2l3.4-3.4.1.1 4.1 2.3c1.2.6 1.2 1.7 0 2.4l-4.1 2.2z"
      />
      <path fill="#FF3A44" d="m17.3 15.3-3.5-3.5L3.6 22.2c.4.4 1 .5 1.8.1l11.9-7z" />
      <path fill="#00E676" d="M17.3 8.7 5.4 1.9c-.8-.5-1.4-.4-1.8.1l10.2 10z" />
    </svg>
  );
}
