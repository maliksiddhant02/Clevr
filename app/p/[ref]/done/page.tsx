"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  BankIcon,
  CopyIcon,
  ReceiptIcon,
  Share01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { findPayment } from "@/lib/sample";
import { formatAud, splitAud, cardFeeCents } from "@/lib/money";
import { Avatar } from "@/components/Avatar";
import "./done-animations.css";

export default function DonePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const router = useRouter();
  const [ref, setRef] = useState<string>("");
  const [payment, setPayment] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

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

      // Generate localized timestamp
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateStr = now.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setTimestamp(`${timeStr} on ${dateStr}`);
    });
  }, [params]);

  if (!payment) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#054d28] text-white">
        <span className="text-[1.0625rem] font-semibold">Loading...</span>
      </div>
    );
  }

  const { whole, fraction } = splitAud(payment.paidCents);

  const handleCopy = () => {
    navigator.clipboard.writeText(ref);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CLEVR Receipt - ${payment.merchant}`,
        text: `Paid ${formatAud(payment.paidCents)} to ${payment.merchant}. Kept ${formatAud(payment.savedCents)}!`,
        url: window.location.origin + `/payment/${ref}`,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <main className="animate-container text-foreground relative flex flex-col items-center">
      {/* ── Top Header Animation Group ── */}
      <div className="success-header-group absolute left-0 right-0 top-[28%] z-10 flex flex-col items-center justify-center text-center">
        {/* White circular loading spinner & checkmark pop */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg
            width={80}
            height={80}
            viewBox="0 0 80 80"
            className="absolute inset-0 -rotate-90"
          >
            <circle
              cx={40}
              cy={40}
              r={30}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={4}
            />
            <circle
              cx={40}
              cy={40}
              r={30}
              fill="none"
              stroke="white"
              strokeWidth={4}
              strokeLinecap="round"
              className="success-spinner-circle"
            />
          </svg>
          
          <div className="success-checkmark absolute flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white">
            <svg
              width={32}
              height={32}
              viewBox="0 0 40 40"
              fill="none"
              stroke="#054d28" /* success Spruce green */
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="10,21 17,28 30,13" />
            </svg>
          </div>
        </div>

        {/* Dynamic header text fading in */}
        <div className="success-text-fade mt-5 flex flex-col items-center">
          <h1 className="display text-paper text-[1.75rem] font-bold">
            Payment Successful
          </h1>
          <p className="text-paper/70 mt-1.5 text-[0.8125rem]">
            {timestamp}
          </p>
        </div>
      </div>

      {/* ── Slide Up Receipt Card ── */}
      <div className="success-receipt-card bg-paper absolute bottom-0 left-0 right-0 z-20 flex h-[66vh] flex-col rounded-t-[28px] border-t border-border px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-sm">
        {/* Drag handle decoration */}
        <div className="bg-foreground/10 mx-auto mb-5 h-1.5 w-12 rounded-full shrink-0" />

        {/* Scrollable details container */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1">
          {/* Merchant header */}
          <div className="flex flex-col items-center text-center">
            <Avatar name={payment.merchant} size="lg" />
            <h2 className="text-foreground mt-3 text-[1.0625rem] font-bold">
              {payment.merchant}
            </h2>
            <p className="display text-foreground mt-2 text-[2.75rem] tabular-nums leading-none">
              {whole}
              <span className="text-muted-foreground text-[1.375rem]">.{fraction}</span>
            </p>
            <p className="text-success mt-1.5 text-[0.9375rem] font-semibold">
              you kept {formatAud(payment.savedCents)}
            </p>
          </div>

          {/* Details list */}
          <div className="border-border mt-6 border-t pt-5">
            <h3 className="text-muted-foreground text-[0.8125rem] font-semibold uppercase tracking-wider">
              Payment Details
            </h3>
            
            <dl className="mt-3 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <dt className="text-muted-foreground text-[0.9375rem]">Message</dt>
                <dd className="text-foreground text-[0.9375rem] font-medium text-right">
                  Payment for goods
                </dd>
              </div>

              <div className="flex items-start justify-between">
                <dt className="text-muted-foreground text-[0.9375rem]">Transaction ID</dt>
                <dd className="text-foreground flex items-center gap-1.5 text-[0.9375rem] font-semibold text-right">
                  <span className="font-mono tracking-[0.04em]">{ref}</span>
                  <button
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-md hover:bg-foreground/5"
                    title="Copy Transaction ID"
                  >
                    <HugeiconsIcon icon={CopyIcon} size={15} strokeWidth={1.8} />
                  </button>
                </dd>
              </div>

              <div className="flex items-start justify-between">
                <dt className="text-muted-foreground text-[0.9375rem]">Debited from</dt>
                <dd className="text-foreground flex flex-col items-end text-[0.9375rem] text-right font-medium">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={BankIcon} size={15} strokeWidth={1.8} className="text-muted-foreground" />
                    Up Bank · XXXX 8891
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[0.8125rem] tabular-nums">
                    {formatAud(payment.paidCents)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions Row */}
          <div className="mt-8 flex justify-around border-t border-border pt-6">
            <button
              onClick={() => router.push("/pay")}
              className="flex flex-col items-center gap-1.5 cursor-pointer text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors">
                <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={18} strokeWidth={2} />
              </span>
              <span className="text-[0.8125rem] font-semibold text-muted-foreground">Send Again</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 cursor-pointer text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors">
                <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={2} />
              </span>
              <span className="text-[0.8125rem] font-semibold text-muted-foreground">Share Receipt</span>
            </button>

            <button
              onClick={() => router.push("/activity")}
              className="flex flex-col items-center gap-1.5 cursor-pointer text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors">
                <HugeiconsIcon icon={ReceiptIcon} size={18} strokeWidth={2} />
              </span>
              <span className="text-[0.8125rem] font-semibold text-muted-foreground">View History</span>
            </button>

            <button
              onClick={() => router.push(`/payment/${ref}`)}
              className="flex flex-col items-center gap-1.5 cursor-pointer text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors">
                <HugeiconsIcon icon={UserCircleIcon} size={18} strokeWidth={2} />
              </span>
              <span className="text-[0.8125rem] font-semibold text-muted-foreground">Split Expense</span>
            </button>
          </div>

          {/* Support row */}
          <Link
            href="/account"
            className="mt-6 flex min-h-12 items-center justify-between rounded-xl bg-foreground/5 hover:bg-foreground/8 px-4 py-3 transition-colors"
          >
            <span className="text-foreground text-[0.9375rem] font-semibold">
              Contact CLEVR Support
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-muted-foreground"
            />
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-5 border-t border-border pt-4 text-center shrink-0">
          <p className="text-muted-foreground text-[0.75rem] font-medium tracking-wide uppercase">
            Powered by CLEVR · Australia&rsquo;s Instant Rail
          </p>
        </div>
      </div>
    </main>
  );
}
