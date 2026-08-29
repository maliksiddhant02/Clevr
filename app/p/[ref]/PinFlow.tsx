"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { formatAud } from "@/lib/money";
import type { SamplePayment } from "@/lib/sample";
import Image from "next/image";

export function PinFlow({ payment }: { payment: SamplePayment }) {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleKey = (key: string) => {
    if (loading) return;

    if (key === "⌫") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4) {
      const nextPin = pin + key;
      setPin(nextPin);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4 || loading) return;
    setLoading(true);
    try {
      // POST to confirm payment on mock rail
      await fetch(`/api/payments/${payment.ref}/confirm`, { method: "POST" });
      router.push(`/p/${payment.ref}/done`);
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setLoading(false);
    }
  };

  // Auto-submit when PIN reaches 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pin]);

  return (
    <main className="flex min-h-dvh flex-col bg-paper text-foreground justify-between">
      {/* ── Header block matching UPI layout ── */}
      <div className="px-5 pt-4 pb-4 border-b border-border bg-foreground/3">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="text-foreground text-[0.875rem] font-bold tracking-wider hover:opacity-75"
            >
              CANCEL
            </Link>
            <div className="mt-3">
              <p className="text-[1rem] font-bold text-foreground leading-tight">
                Up Bank
              </p>
              <p className="text-muted-foreground text-[0.8125rem] tracking-wide">
                XXXX 8891
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <Image
              src="/logo.png"
              alt="CLEVR"
              width={1774}
              height={887}
              priority
              className="h-7 w-auto opacity-80"
            />
            <span className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
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
            <span className="text-foreground font-extrabold text-[1.125rem] tabular-nums">
              {formatAud(payment.paidCents)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Center Content PIN Indicators ── */}
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

        {/* Warning notification banner in Clevr theme */}
        <div className="w-full max-w-[21rem] bg-muted/65 border border-border/80 rounded-2xl p-4 flex gap-3 items-start">
          <HugeiconsIcon icon={HelpCircleIcon} size={20} className="text-foreground shrink-0 mt-0.5" />
          <p className="text-[0.8125rem] font-semibold text-muted-foreground leading-relaxed">
            You are SENDING{" "}
            <span className="text-foreground font-extrabold tabular-nums">
              {formatAud(payment.paidCents)}
            </span>{" "}
            from your account to{" "}
            <span className="text-foreground font-bold">{payment.merchant}</span>.
          </p>
        </div>
      </div>

      {/* ── Custom Numeric Keypad at the bottom ── */}
      <div className="shrink-0 bg-paper">
        <div className="grid grid-cols-3 border-t border-border">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKey(num)}
              className="flex h-16 items-center justify-center border-r border-b border-border text-[1.375rem] font-bold text-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
            >
              {num}
            </button>
          ))}
          
          {/* Backspace Key */}
          <button
            type="button"
            onClick={() => handleKey("⌫")}
            className="flex h-16 items-center justify-center border-r border-b border-border text-[1.125rem] font-bold text-muted-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
            aria-label="Backspace"
          >
            ⌫
          </button>
          
          {/* Zero Key */}
          <button
            type="button"
            onClick={() => handleKey("0")}
            className="flex h-16 items-center justify-center border-r border-b border-border text-[1.375rem] font-bold text-foreground active:bg-foreground/5 hover:bg-foreground/2 transition-colors duration-100 cursor-pointer"
          >
            0
          </button>
          
          {/* Submit Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pin.length !== 4 || loading}
            className="flex h-16 items-center justify-center border-b border-border text-[0.875rem] font-black uppercase tracking-wider bg-background text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-40 transition-colors duration-100 cursor-pointer"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}
