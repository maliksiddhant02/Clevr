"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// PhonePe-style celebratory overlay: full-screen deep green, confetti falling,
// success tick + burst centred, a brief line of type. Self-dismissing.
// Fires a short haptic on mount where the platform allows it.
export function SuccessBurst({ durationMs = 2600 }: { durationMs?: number }) {
  const [show, setShow] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Haptic on entry — one soft double-buzz, ignored on desktop.
    navigator.vibrate?.([12, 40, 20]);
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-live="polite"
          aria-label="Payment successful"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduced ? 0 : 0.25,
            ease: "easeOut",
            exit: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="bg-success pointer-events-none fixed inset-0 z-50 overflow-hidden"
        >
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
            Payment successful
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
