"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { formatAud, splitAud } from "@/lib/money";
import { SuccessBurst } from "@/components/SuccessBurst";

type Status = "pending" | "settled" | "expired";

type PollData = {
  status: Status;
  amountCents: number;
  shopperPaysCents: number;
  payid: string;
  expiresAt: string;
  payerName?: string;
  settledAt?: string;
};

/**
 * The counter screen: one amount, one code, one line of state.
 *
 * It used to take a prop called `ref`, which React reserves, so every charge
 * landed on a runtime error instead of a QR code. The prop is `paymentRef`
 * now — the payment's own name for itself, which is what it always was.
 *
 * The screen stays on this route the whole time it is waiting. A merchant
 * mid-sale is holding the phone out to a stranger, and a screen that
 * navigates under their hand is a screen they have to explain.
 */
export function MerchantPoller({
  paymentRef,
  children,
}: {
  paymentRef: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [data, setData] = useState<PollData | null>(null);
  const [offline, setOffline] = useState(false);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/payments/${paymentRef}`);
        if (!live) return;
        if (!res.ok) {
          // A cold reload empties the in-process store, so an unknown ref is
          // the demo restarting, not a fault. Keep asking.
          setOffline(true);
          timer = setTimeout(poll, 3000);
          return;
        }
        setOffline(false);
        const d: PollData = await res.json();
        setData(d);
        if (d.status === "settled") {
          setSettling(true);
          return;
        }
        if (d.status === "expired") return;
        timer = setTimeout(poll, 1500);
      } catch {
        if (!live) return;
        setOffline(true);
        timer = setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [paymentRef]);

  // The demo's stand-in for the rail seeing the transfer land. The shopper's
  // PIN screen posts to the same endpoint, so the two paths settle a payment
  // exactly the same way.
  async function confirm() {
    setSettling(true);
    try {
      await fetch(`/api/payments/${paymentRef}`, { method: "POST" });
    } catch {
      // The poll will pick it up, or it will not and the screen says so.
    }
  }

  const amount = data?.shopperPaysCents;
  const { whole, fraction } = splitAud(amount ?? 0);

  // ── Expired ───────────────────────────────────────────────────────────────
  if (data?.status === "expired") {
    return (
      <div className="flex flex-1 flex-col justify-center gap-6 pb-16 text-center">
        <div>
          <h2 className="display text-foreground text-[2.25rem]">
            Code expired
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-[18rem] text-[1.0625rem] leading-relaxed">
            Nobody paid within ten minutes, so the code stopped working. Ring
            it up again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/m")}
          className="bg-foreground text-paper mx-auto flex h-16 items-center justify-center rounded-full px-8 text-[1.0625rem] font-semibold"
        >
          New charge
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {settling && (
        <SuccessBurst
          phase="enter"
          label="Payment received"
          onCovered={() => router.push(`/m/${paymentRef}/done`)}
        />
      )}

      {/* The amount is the screen. The shopper reads it across the counter
          before they read anything else. */}
      <p className="display text-foreground text-center text-[3.5rem] tabular-nums">
        {amount == null ? "—" : whole}
        {amount != null && (
          <span className="text-muted-foreground text-[1.75rem]">
            .{fraction}
          </span>
        )}
      </p>
      <p className="text-muted-foreground mt-2 text-center text-[1.0625rem]">
        {data ? `${formatAud(data.amountCents)} less the CLEVR discount` : " "}
      </p>

      {/* Ink on Sun, straight on the page. A white card under a QR is a
          scanner's habit, not a requirement: the code reads at 19:1 here and
          the mark stays part of the page instead of sitting on top of it. */}
      <div className="mx-auto mt-8 w-full max-w-[17rem]">{children}</div>

      <p
        aria-live="polite"
        className="text-foreground mt-8 text-center text-[1.0625rem] font-semibold"
      >
        {offline ? "Reconnecting…" : "Waiting for payment"}
      </p>
      <p className="text-muted-foreground mt-1 text-center font-mono text-[0.8125rem] tracking-[0.08em]">
        {paymentRef}
      </p>

      <div className="mt-auto pt-10">
        <button
          type="button"
          onClick={confirm}
          disabled={settling}
          className="bg-foreground text-paper flex h-16 w-full items-center justify-center rounded-full text-[1.0625rem] font-semibold transition-opacity duration-200 disabled:opacity-40"
        >
          {settling ? "Settling…" : "Confirm purchase"}
        </button>
        <p className="text-muted-foreground mt-3 text-center text-[0.8125rem]">
          Stands in for the bank transfer landing. Demo only.
        </p>
      </div>
    </div>
  );
}
