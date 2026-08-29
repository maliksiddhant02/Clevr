/**
 * The two store marks, drawn rather than taken from an icon set. An icon set's
 * "apple" and "play" are that set's interpretation; these are the marks
 * themselves, which is what a store link is supposed to show.
 *
 * The Play mark is the one place in this system that carries colour it did not
 * choose. It is a trademark, not decoration, and a monochrome Play mark reads
 * as a generic triangle. See DESIGN.md 2.
 *
 * GoogleMark and FacebookMark follow the same rule: their brand terms require
 * the colour version and a monochrome reading loses the recognition that
 * makes them useful here.
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

// Google brand terms require the full-colour "G" mark on light backgrounds.
export function GoogleMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// Facebook brand guidelines require the blue "f" on light backgrounds.
export function FacebookMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}
