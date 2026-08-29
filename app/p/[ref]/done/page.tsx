"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cancel01Icon,
  Share01Icon,
  ReceiptIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { findPayment, type SamplePayment } from "@/lib/sample";
import { formatAud } from "@/lib/money";
import { Avatar } from "@/components/Avatar";

export default function DonePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const router = useRouter();
  const [ref, setRef] = useState<string>("");
  const [payment, setPayment] = useState<SamplePayment | null>(null);

  useEffect(() => {
    params.then((p) => {
      setRef(p.ref);
      const data = findPayment(p.ref) ?? {
        ref: p.ref,
        merchant: "Brew & Co",
        paidCents: 995,
        savedCents: 5,
        day: "Today",
        time: "now",
        settledSeconds: 4,
      };
      setPayment(data);
    });
  }, [params]);

  if (!payment) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper text-foreground -mx-5 px-5">
        <span className="text-[1.0625rem] font-semibold">Loading...</span>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CLEVR Receipt - ${payment.merchant}`,
        text: `Paid ${formatAud(payment.paidCents)} to ${payment.merchant}. Kept ${formatAud(payment.savedCents)}!`,
        url: window.location.origin + `/payment/${ref}`,
      }).catch(() => {});
    }
  };

  return (
    // Make full-bleed to cover screen and avoid yellow borders
    <main className="flex min-h-dvh flex-col bg-paper text-foreground justify-between -mx-5 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
      {/* ── Top Bar with "X" Close Button ── */}
      <div className="flex items-center justify-between w-full">
        <Link
          href="/"
          aria-label="Close and go home"
          className="border-foreground/15 text-foreground hover:bg-foreground/5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <span className="text-[0.875rem] font-bold text-muted-foreground uppercase tracking-widest">
          Receipt
        </span>
        <span className="h-11 w-11" /> {/* Spacer to align title */}
      </div>

      {/* ── Core Success details taking less space ── */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 gap-6">
        {/* Simple success tick */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-paper shadow-sm">
          <svg
            width={24}
            height={24}
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="10,21 17,28 30,13" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-[1.5rem] font-black tracking-tight text-foreground">
            Payment Successful
          </h1>
          <p className="text-muted-foreground text-[0.875rem] mt-1">
            Transaction processed on instant rail
          </p>
        </div>

        {/* Business and amount details */}
        <div className="flex flex-col items-center mt-2">
          <Avatar name={payment.merchant} size="lg" />
          <h2 className="text-foreground mt-3 text-[1.125rem] font-bold">
            {payment.merchant}
          </h2>
          <p className="display text-foreground mt-2 text-[3rem] tabular-nums leading-none">
            {formatAud(payment.paidCents)}
          </p>
          <p className="text-success mt-1.5 text-[0.9375rem] font-semibold">
            you kept {formatAud(payment.savedCents)}
          </p>
        </div>

        {/* Debited Bank details */}
        <div className="text-center text-[0.875rem] text-muted-foreground mt-2">
          Debited from <span className="font-semibold text-foreground">Up Bank · XXXX 8891</span>
        </div>

        {/* Dynamic Details and Share buttons inside content area */}
        <div className="flex flex-col gap-3 w-full max-w-[20rem] mt-4">
          <Link
            href={`/payment/${ref}`}
            className="bg-foreground text-paper hover:opacity-90 flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-bold transition-opacity cursor-pointer gap-2"
          >
            <HugeiconsIcon icon={ReceiptIcon} size={18} strokeWidth={2} />
            View details
          </Link>
          
          <button
            onClick={handleShare}
            className="border-border text-foreground hover:bg-foreground/5 flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-bold transition-colors cursor-pointer gap-2"
          >
            <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={2} />
            Share receipt
          </button>
        </div>
      </div>

      {/* ── Bottom Done button ── */}
      <div className="w-full">
        <Link
          href="/"
          className="border-foreground text-foreground hover:bg-foreground/5 flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-bold transition-colors cursor-pointer"
        >
          Done
        </Link>
      </div>
    </main>
  );
}
