"use client";

import { useEffect, useState } from "react";
import { FlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MockDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check localStorage to see if they've already dismissed the disclaimer
    const dismissed = localStorage.getItem("clevr_mock_dismissed");
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("clevr_mock_dismissed", "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs"
    >
      <div className="bg-card border-border flex w-full max-w-[340px] flex-col items-center rounded-3xl border p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-foreground text-paper flex h-12 w-12 items-center justify-center rounded-2xl mb-4">
          <HugeiconsIcon icon={FlashIcon} size={24} strokeWidth={2} />
        </div>
        <h2
          id="disclaimer-title"
          className="display text-foreground text-[1.5rem] font-bold leading-tight"
        >
          CLEVR Demo
        </h2>
        <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
          This is a demonstration of the CLEVR payment flow. All banking rails, accounts, and transactions shown in this app are mock simulations.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="bg-foreground text-paper mt-6 flex h-12 w-full items-center justify-center rounded-2xl text-[0.9375rem] font-semibold transition-transform duration-150 active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
