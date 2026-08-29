"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { formatAud } from "@/lib/money";
import type { SamplePayment } from "@/lib/sample";

export function PinFlow({ payment }: { payment: SamplePayment }) {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleKey = (key: string) => {
    if (loading) return;

    if (key === "⌫") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4) {
      setPin((prev) => prev + key);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4 || loading) return;
    setLoading(true);
    try {
      await fetch(`/api/payments/${payment.ref}/confirm`, { method: "POST" });
      router.push(`/p/${payment.ref}/done`);
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setLoading(false);
    }
  };

  return (
    // Removed px-5 from the top level main container so keypad grid lines touch screen edges.
    // -mx-5 cancels parent padding to make container run 100% full column width.
    <main className="flex min-h-dvh flex-col bg-background text-foreground justify-between -mx-5">
      {/* ── Header block matching UPI layout (with px-5 horizontal padding) ── */}
      <div className="pt-4 pb-4 border-b border-border bg-foreground/3 px-5">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="text-foreground text-[0.875rem] font-bold tracking-wider hover:opacity-75"
            >
              CANCEL
            </Link>
            <div className="mt-3">
              <span className="text-[0.9375rem] font-black tracking-[-0.03em] text-[#FFCC00] bg-black px-2 py-0.5 rounded-md inline-block">
                CommBank
              </span>
              <p className="text-muted-foreground text-[0.8125rem] tracking-wide mt-1">
                XXXX 8891
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Instant Pay
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-border/60 pt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[0.875rem]">To:</span>
            <span className="text-foreground font-bold text-[0.9375rem]">
              {payment.merchant}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[0.875rem]">Sending:</span>
            <span className="text-foreground font-black text-[1.125rem] tabular-nums">
              {formatAud(payment.paidCents)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Center Content PIN Indicators (with px-5 horizontal padding) ── */}
      <div className="flex flex-col items-center justify-center flex-1 py-6 px-5 gap-6">
        <div className="text-center">
          <h2 className="text-muted-foreground text-[0.875rem] font-bold uppercase tracking-widest">
            Enter 4-Digit PIN
          </h2>
          
          {/* PIN circles */}
          <div className="flex gap-4 mt-4 justify-center">
            {[0, 1, 2, 3].map((index) => {
              const active = pin.length > index;
              return (
                <span
                  key={index}
                  className={`h-4.5 w-4.5 rounded-full border-2 transition-all duration-100 ${
                    active
                      ? "bg-foreground border-foreground scale-110"
                      : "bg-transparent border-foreground/25"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Warning notification banner using Inversion: solid Ink block with Paper type & Sun accent */}
        <div className="w-full max-w-[21rem] bg-foreground text-paper rounded-2xl p-4 flex gap-3 items-start">
          <HugeiconsIcon icon={HelpCircleIcon} size={20} className="text-sun shrink-0 mt-0.5" />
          <p className="text-[0.8125rem] font-semibold leading-relaxed text-on-ink">
            You are SENDING{" "}
            <span className="text-sun font-black tabular-nums">
              {formatAud(payment.paidCents)}
            </span>{" "}
            from your account to{" "}
            <span className="text-paper font-bold">{payment.merchant}</span>.
          </p>
        </div>
      </div>

      {/* ── Custom Numeric Keypad flat on Sun ground (NO horizontal padding so it touches screen edges) ── */}
      <div className="shrink-0">
        <div className="grid grid-cols-3 border-t border-foreground/16">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKey(num)}
              className="flex h-16 items-center justify-center border-r border-b border-foreground/16 text-[1.375rem] font-bold text-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
            >
              {num}
            </button>
          ))}
          
          {/* Backspace Key */}
          <button
            type="button"
            onClick={() => handleKey("⌫")}
            className="flex h-16 items-center justify-center border-r border-b border-foreground/16 text-[1.125rem] font-bold text-muted-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
            aria-label="Backspace"
          >
            ⌫
          </button>
          
          {/* Zero Key */}
          <button
            type="button"
            onClick={() => handleKey("0")}
            className="flex h-16 items-center justify-center border-r border-b border-foreground/16 text-[1.375rem] font-bold text-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
          >
            0
          </button>
          
          {/* Submit Action Button - Solid Ink (black) background with white text */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pin.length !== 4 || loading}
            className="flex h-16 items-center justify-center border-b border-foreground/16 text-[0.875rem] font-black uppercase tracking-wider bg-foreground text-paper hover:bg-foreground/90 disabled:opacity-40 transition-colors duration-100 cursor-pointer"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}
