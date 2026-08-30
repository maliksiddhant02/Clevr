"use client";

import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The celebration, in two halves, because it spans a route change.
 *
 * A payment confirms on one screen and the receipt lives on another, so the
 * old version swept the green in *after* the navigation: the receipt painted,
 * sat there for a beat, and then got covered by its own success animation. The
 * reader watched the answer arrive before the thing announcing it.
 *
 * So the sheet comes in over the screen the reader is still looking at
 * (`phase="enter"`, on the confirm screen), and the navigation happens at the
 * moment it covers — `onCovered`. The destination mounts already covered
 * (`phase="cover"`), plays the tick, and sweeps off to reveal itself. One
 * continuous horizontal motion across two routes, and the swap happens
 * behind the green where nobody can see it.
 *
 * The handoff is on a timer, not on `onAnimationComplete`. The callback is
 * driven by the animation frame loop, which a browser stops running when the
 * tab is not visible: a payment confirmed on a backgrounded tab would sit
 * under a green sheet forever, waiting for a frame that never comes. Timers
 * are throttled there, not stopped.
 *
 * Fires a short haptic where the platform allows it.
 */
export function SuccessBurst({
  phase = "cover",
  durationMs = 2400,
  label = "Payment successful",
  onCovered,
}: {
  phase?: "enter" | "cover";
  durationMs?: number;
  /** The shopper sent it; the shop received it. Same sheet, different fact. */
  label?: string;
  onCovered?: () => void;
}) {
  const [show, setShow] = useState(true);
  const reduced = useReducedMotion();
  const covering = phase === "cover";
  const sweepMs = reduced ? 250 : 500;

  // Callers pass an inline arrow, so the prop is a new function every render.
  // In the dependency array that restarts the handoff timer on every render
  // and the navigation never happens.
  const covered = useRef(onCovered);
  useEffect(() => {
    covered.current = onCovered;
  });

  useEffect(() => {
    // Haptic on entry — one soft double-buzz, ignored on desktop.
    navigator.vibrate?.([12, 40, 20]);
  }, []);

  useEffect(() => {
    // Entering: hand over the moment the sheet has the screen covered. The
    // route change happens behind it, so it is never seen.
    if (!covering) {
      const t = setTimeout(() => covered.current?.(), sweepMs);
      return () => clearTimeout(t);
    }
    // Covering: hold the celebration, then sweep off to reveal the receipt.
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [covering, durationMs, sweepMs]);

  // Reduced-motion collapses the sweep to a plain fade, in both halves.
  const sheet = reduced
    ? { initial: { opacity: covering ? 1 : 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: covering ? "0%" : "100%" }, animate: { x: "0%" }, exit: { x: "-100%" } };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-live="polite"
          aria-label={label}
          initial={sheet.initial}
          animate={sheet.animate}
          exit={sheet.exit}
          transition={{
            duration: sweepMs / 1000,
            ease: [0.83, 0, 0.17, 1],
          }}
          className="bg-success pointer-events-none fixed inset-0 z-50 overflow-hidden will-change-transform"
        >
          {/* The entering half is a bare sheet. Starting the tick under a
              screen that is about to be replaced would play it twice. */}
          {covering && (
            <>
          {/* Confetti fills the whole viewport, plays once. */}
          <DotLottieReact
            src="/lottie/confetti.lottie"
            autoplay
            loop={false}
            className="absolute inset-0 h-full w-full"
          />

          {/* Success burst tick, scaled in on top for the moment of arrival. */}
          <motion.div
            initial={reduced ? { scale: 1 } : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale: { type: "spring", visualDuration: 0.5, bounce: 0.35 },
              opacity: { duration: 0.2, ease: "easeOut" },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <DotLottieReact
              src="/lottie/success-confetti.lottie"
              autoplay
              loop={false}
              className="h-[22rem] w-[22rem] max-w-full"
            />
          </motion.div>

          {/* The line reads after the tick has landed, sits low so the
              lottie's centre stays clean. */}
          <motion.p
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35, ease: "easeOut" }}
            className="text-paper display absolute inset-x-0 bottom-[22vh] text-center text-[1.75rem]"
          >
            {label}
          </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
