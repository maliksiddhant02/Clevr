import type { Metadata } from "next";
import { formatAud } from "@/lib/money";
import { BIZ_PAYMENTS, BIZ_MERCHANT } from "@/lib/biz-sample";
import { PaymentRow } from "@/components/PaymentRow";
import { Keypad } from "@/components/Keypad";

export const metadata: Metadata = {
  title: "CLEVR — Till",
};

export default function TillPage() {
  const settled = BIZ_PAYMENTS.filter((p) => p.status === "settled");
  const today = new Date().toISOString().slice(0, 10);
  const todaySettled = settled.filter((p) => p.settledAt?.startsWith(today));

  const todayGross = todaySettled.reduce((n, p) => n + p.amountCents, 0);
  const todayDiscount = todaySettled.reduce((n, p) => n + p.discountCents, 0);
  const todayScans = BIZ_PAYMENTS.filter(
    (p) => p.createdAt.startsWith(today),
  ).length;
  const convRate =
    todayScans > 0 ? Math.round((todaySettled.length / todayScans) * 100) : 0;

  const last5 = settled
    .filter((p) => p.settledAt)
    .sort((a, b) => b.settledAt!.localeCompare(a.settledAt!))
    .slice(0, 5);

  return (
    <main className="pb-28 pt-10">
      {/* Shop name */}
      <p className="text-muted-foreground text-[0.875rem] font-medium">
        {BIZ_MERCHANT.name}
      </p>

      {/* Today's hero */}
      <div className="mt-1">
        <p className="display text-foreground text-[3rem] leading-none tabular-nums">
          {formatAud(todayGross)}
        </p>
        <p className="text-muted-foreground mt-1 text-[0.9375rem]">today</p>
      </div>

      {/* Secondary stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Scans", value: todayScans },
          { label: "Paid", value: todaySettled.length },
          { label: "Conv.", value: `${convRate}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-foreground/6 rounded-2xl px-4 py-4 text-center"
          >
            <p className="text-foreground text-[1.375rem] font-bold tabular-nums">
              {value}
            </p>
            <p className="text-muted-foreground mt-0.5 text-[0.75rem] font-medium">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div className="mt-8">
        <Keypad />
      </div>

      {/* Last 5 payments */}
      {last5.length > 0 && (
        <div className="mt-10">
          <p className="text-foreground mb-3 text-[0.875rem] font-semibold">
            Recent payments
          </p>
          <ul className="border-border divide-border divide-y border-y">
            {last5.map((p) => (
              <PaymentRow
                key={p.ref}
                payment={{
                  ref: p.ref,
                  merchant: BIZ_MERCHANT.name,
                  paidCents: p.amountCents - p.discountCents,
                  savedCents: p.discountCents,
                  day: new Date(p.settledAt!).toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }),
                  time: new Date(p.settledAt!).toLocaleTimeString("en-AU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  settledSeconds: 0,
                }}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Discount given today note */}
      {todayDiscount > 0 && (
        <p className="text-muted-foreground mt-6 text-[0.8125rem] leading-relaxed">
          {formatAud(todayDiscount)} given back to shoppers today.
        </p>
      )}
    </main>
  );
}
