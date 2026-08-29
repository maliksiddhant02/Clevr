"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Press-and-hold to pay. A Sun ring fills over ~900ms; release early resets.
 *
 * The hold gesture stands in for biometrics and for the shopper actually
 * paying in their banking app. Real Face ID / Touch ID is WebAuthn and needs
 * a server challenge. A line on the screen says this demo doesn't read a
 * fingerprint. We don't imply a biometric we didn't take.
 *
 * prefers-reduced-motion: no ring animation, the control becomes
 * press-and-confirm.
 *
 * ponytail: replace onConfirm with an actual payment initiation when the
 * banking app deep-link is available.
 */
export function HoldToPay({
  onConfirm,
  label = "Hold to pay",
  disabled = false,
}: {
  onConfirm: () => void;
  label?: string;
  disabled?: boolean;
}) {
  const [progress, setProgress] = useState(0); // 0–1
  const [holding, setHolding] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 900; // ms

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function start() {
    if (disabled) return;
    if (reduced) {
      onConfirm();
      return;
    }
    setHolding(true);
    startRef.current = performance.now();
    function tick(now: number) {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setHolding(false);
        onConfirm();
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancel() {
    cancelAnimationFrame(rafRef.current);
    setHolding(false);
    setProgress(0);
  }

  // SVG ring params
  const SIZE = 72;
  const STROKE = 5;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const dash = progress * CIRC;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex h-[72px] w-[72px] select-none items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
      >
        {/* Background track */}
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute -rotate-90"
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(255,244,1,0.25)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#fff401"
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeLinecap="round"
            style={{ transition: holding ? "none" : "stroke-dasharray 0.15s ease" }}
          />
        </svg>
        {/* Fingerprint icon — signals biometric-style interaction */}
        <svg
          width={32}
          height={32}
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="text-paper relative z-10"
          aria-hidden
        >
          <path d="M16 4a12 12 0 0 1 0 24" />
          <path d="M16 8a8 8 0 0 1 0 16" />
          <path d="M16 12a4 4 0 0 1 0 8" />
          <path d="M10 6.27A12 12 0 0 0 4 16c0 3.31 1.34 6.31 3.51 8.49" />
        </svg>
      </button>
      <p className="text-on-ink text-center text-[0.8125rem]">
        {reduced ? "Tap to confirm" : label}
      </p>
      <p className="text-on-ink/60 text-center text-[0.75rem]">
        This does not read your fingerprint.
      </p>
    </div>
  );
}
