"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatAud } from "@/lib/money";

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

// Merchant-side poller. Polls every 1.5s until settled/expired.
// On settle: renders the tick inline rather than navigating — the merchant
// stays at the till rather than landing on a separate page.
export function MerchantPoller({
  ref,
  qrSvg,
}: {
  ref: string;
  qrSvg: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<PollData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/payments/${ref}`);
        if (!res.ok) { setError(true); return; }
        const d: PollData = await res.json();
        setData(d);
        if (d.status === "settled" || d.status === "expired") return;
        setTimeout(poll, 1500);
      } catch {
        setTimeout(poll, 3000); // back off on network error
      }
    }
    poll();
  }, [ref]);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground text-[0.9375rem]">Connecting…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-foreground text-center text-[0.9375rem]">
          Connection error. Waiting for payment.
        </p>
      </div>
    );
  }

  // ── Settled ─────────────────────────────────────────────────────────────
  if (data.status === "settled") {
    return (
      <div className="bg-foreground -mx-5 flex flex-1 flex-col items-center justify-center gap-6 rounded-t-3xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fff401]">
          <svg
            width={48}
            height={48}
            viewBox="0 0 48 48"
            fill="none"
            stroke="#000"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Payment received"
          >
            <polyline points="10,25 20,35 38,15" />
          </svg>
        </div>
        <h2 className="text-paper display text-[2.25rem] leading-none">
          {formatAud(data.shopperPaysCents)}
        </h2>
        {data.payerName && (
          <p className="text-paper/70 text-[1rem]">{data.payerName}</p>
        )}
        <p className="text-paper/50 font-mono text-[0.8125rem]">{ref}</p>
        <button
          type="button"
          onClick={() => router.push("/m")}
          className="bg-paper text-foreground mt-4 flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-semibold"
        >
          New charge
        </button>
      </div>
    );
  }

  // ── Expired ─────────────────────────────────────────────────────────────
  if (data.status === "expired") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
        <p className="text-foreground text-center text-[1.125rem] font-semibold">
          Payment expired
        </p>
        <p className="text-muted-foreground text-center text-[0.9375rem]">
          The QR code timed out after 10 minutes.
        </p>
        <button
          type="button"
          onClick={() => router.push("/m")}
          className="bg-foreground text-paper mt-4 flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-semibold"
        >
          New charge
        </button>
      </div>
    );
  }

  // ── Pending ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col items-center gap-6">
      {/* QR */}
      <div
        className="rounded-2xl bg-white p-4 shadow-sm"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
        aria-label={`QR code for payment ${ref}`}
      />
      <p className="text-muted-foreground text-center text-[0.875rem]">
        Waiting for payment…
      </p>
      <div className="border-border w-full rounded-2xl border px-4 py-3 text-center">
        <p className="text-muted-foreground text-[0.75rem]">Amount</p>
        <p className="text-foreground mt-0.5 text-[1.375rem] font-bold tabular-nums">
          {formatAud(data.shopperPaysCents)}
        </p>
      </div>
    </div>
  );
}
