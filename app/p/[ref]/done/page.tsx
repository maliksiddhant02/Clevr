"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cancel01Icon,
  Share01Icon,
  ReceiptIcon,
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
      <div className="flex h-dvh items-center justify-center bg-background text-foreground -mx-5 px-5">
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
    // Replaced bg-paper with bg-background (Sun yellow) and removed horizontal container padding.
    // Kept -mx-5 to make the container run 100% full column width.
    <main className="flex min-h-dvh flex-col bg-background text-foreground justify-between -mx-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
      {/* ── Top Bar with "X" Close Button (with px-5 horizontal padding) ── */}
      <div className="flex items-center justify-between w-full px-5">
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

      {/* ── Core Success details (with px-5 horizontal padding) ── */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-5 gap-6">
        {/* Themed Success tick: solid black ground, yellow checkmark */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-sun shadow-sm">
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
          {/* Changed header styling to display font voice for Cera Round Pro 900 mapping */}
          <h1 className="display text-[1.625rem] text-foreground leading-tight tracking-tight">
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

        {/* Changed Up Bank to CommBank */}
        <div className="text-center text-[0.875rem] text-muted-foreground mt-2">
          Debited from <span className="font-semibold text-foreground">CommBank · XXXX 8891</span>
        </div>

        {/* Inverted Buttons: Solid black View Details, outlined Share Receipt */}
        <div className="flex flex-col gap-3 w-full max-w-[20rem] mt-4">
          <Link
            href={`/payment/${ref}`}
            className="bg-foreground text-sun hover:opacity-90 flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-bold transition-opacity cursor-pointer gap-2"
          >
            <HugeiconsIcon icon={ReceiptIcon} size={18} strokeWidth={2} />
            View details
          </Link>
          
          <button
            onClick={handleShare}
            className="border-foreground text-foreground hover:bg-foreground/5 flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-bold transition-colors cursor-pointer gap-2"
          >
            <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={2} />
            Share receipt
          </button>
        </div>
      </div>

      {/* ── Bottom Done button (with px-5 horizontal padding) ── */}
      <div className="w-full px-5">
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
