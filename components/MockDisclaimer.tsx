"use client";

import { useEffect, useRef } from "react";
import { FlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/**
 * Shown on every entry to the app, not once per browser. Nothing behind this
 * screen is real, and a reader who saw the notice last week is still owed it
 * when they hand the phone to someone else.
 */
export function MockDisclaimer() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="disclaimer-title"
      className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-black/60"
    >
      <div className="bg-foreground text-paper mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
        <HugeiconsIcon icon={FlashIcon} size={24} strokeWidth={2} />
      </div>
      <h2 id="disclaimer-title" className="display text-[1.5rem]">
        CLEVR is an MVP
      </h2>
      <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
        Every account and payment here is mock data.
      </p>
      {/* method="dialog" closes it: no handler, no listener. */}
      <form method="dialog">
        <button
          type="submit"
          className="bg-foreground text-paper mt-6 flex h-12 w-full items-center justify-center rounded-2xl text-[0.9375rem] font-semibold"
        >
          Got it
        </button>
      </form>
    </dialog>
  );
}
