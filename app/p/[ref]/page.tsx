import type { Metadata } from "next";
import { findPayment } from "@/lib/sample";
import { formatAud } from "@/lib/money";
import { PayFlow } from "./PayFlow";

export const metadata: Metadata = {
  title: "CLEVR — Pay",
};

// Slow-lane rule (TECHNICAL.md §11): everyone renders the pay page. No app,
// no signup — that is the whole point of the slow lane.
export default async function ShopperPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  // Fall back to a stub when ref is unknown — any ref works on sample data.
  const payment = findPayment(ref) ?? {
    ref,
    merchant: "Brew & Co",
    paidCents: 995,
    savedCents: 5,
    day: "Today",
    time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
    settledSeconds: 4,
  };

  const amountCents = payment.paidCents + payment.savedCents;
  const shopperPaysCents = payment.paidCents;
  const discountCents = payment.savedCents;

  // Sample PayID — replaced by the merchant's real PayID when DB lands.
  const payid = "clevr@up.com.au";

  return (
    <main className="flex min-h-dvh flex-col">
      {/* ── Shopper info band ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-8 pt-10">
        {/* Merchant avatar */}
        <div className="bg-foreground text-paper mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-[1.5rem] font-bold">
          {payment.merchant.slice(0, 1)}
        </div>
        <p className="text-foreground mt-3 text-center text-[1.0625rem] font-semibold">
          {payment.merchant}
        </p>

        {/* Amount arithmetic */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-[1rem]">
            <span className="line-through">{formatAud(amountCents)}</span>
            {"  "}asked
          </p>
          <p className="display text-foreground mt-1 text-[3.5rem] leading-none tabular-nums">
            {formatAud(shopperPaysCents)}
          </p>
          <p className="text-success mt-2 text-[1.0625rem] font-semibold">
            You keep {formatAud(discountCents)}
          </p>
        </div>

        {/* Copy fields */}
        <div className="mt-10 flex flex-col gap-4">
          <CopyRow label="PayID" value={payid} />
          <CopyRow label="Amount" value={formatAud(shopperPaysCents)} />
          <CopyRow label="Reference" value={ref} mono />
        </div>

        <p className="text-muted-foreground mt-5 text-center text-[0.8125rem] leading-relaxed">
          Open your banking app and pay to the PayID above.
          <br />
          The shop{"'"}s screen confirms when it lands.
        </p>
      </div>

      {/* ── Hold-to-pay band ─────────────────────────────────────────── */}
      <div className="bg-foreground -mx-5 flex flex-col items-center pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
        <PayFlow ref={ref} />
      </div>
    </main>
  );
}

function CopyRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-border flex items-center justify-between rounded-2xl border bg-white/60 px-4 py-3">
      <div>
        <p className="text-muted-foreground text-[0.75rem] font-medium">{label}</p>
        <p
          className={`text-foreground mt-0.5 text-[1rem] font-semibold ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={() => navigator.clipboard.writeText(value)}
        className="text-muted-foreground hover:text-foreground ml-3 shrink-0 text-[0.8125rem] font-medium"
      >
        Copy
      </button>
    </div>
  );
}
