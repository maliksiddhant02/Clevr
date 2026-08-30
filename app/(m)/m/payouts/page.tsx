import type { Metadata } from "next";
import { BIZ_PAYMENTS, BIZ_MERCHANT } from "@/lib/biz-sample";
import { reconcile, monthTotals } from "@/lib/reconcile";
import { formatAud, splitAud } from "@/lib/money";

export const metadata: Metadata = {
  title: "CLEVR: Reconcile",
};

export default function PayoutsPage() {
  const records = reconcile(BIZ_PAYMENTS);
  const totals = monthTotals(records);
  const { whole, fraction } = splitAud(totals.cardFeesAvoidedCents);

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Reconcile</h1>

      {/* The Ink band, the system's emphasis device, carrying the one number a
          shop opens this screen for: what not paying card fees was worth. Sun
          appears once inside it, on that number's own qualifier. */}
      <section className="bg-foreground -mx-5 mt-8 rounded-3xl px-5 pt-8 pb-7">
        <h2 className="text-on-ink text-[0.8125rem] font-semibold tracking-[0.12em] uppercase">
          Card fees avoided this month
        </h2>
        <p className="display text-paper mt-3 text-[3.5rem] tabular-nums">
          {whole}
          <span className="text-on-ink text-[1.75rem]">.{fraction}</span>
        </p>
        <dl className="border-paper/20 divide-paper/20 mt-7 divide-y border-t">
          {[
            ["Banked", formatAud(totals.grossCents - totals.discountGivenCents)],
            ["Handed back to shoppers", formatAud(totals.discountGivenCents)],
            ["Rate you set", `${(BIZ_MERCHANT.discountBps / 100).toFixed(2)}%`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between py-3.5">
              <dt className="text-on-ink text-[0.9375rem]">{label}</dt>
              <dd className="text-paper text-[0.9375rem] font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="daily" className="pt-10">
        <h2 id="daily" className="display text-foreground mb-3 text-[1.5rem]">
          Day by day
        </h2>
        <ul className="border-border divide-border divide-y border-y">
          {records.map((r) => (
            <li key={r.date} className="flex items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground flex items-center gap-2 text-[1.0625rem] font-semibold">
                  {new Date(r.date + "T00:00:00").toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  {r.status === "pending" && (
                    <span className="bg-muted text-foreground rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium">
                      today
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[0.9375rem]">
                  {r.settledCount} payment{r.settledCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="shrink-0 text-right tabular-nums">
                <p className="text-foreground text-[1.0625rem] font-semibold">
                  {formatAud(r.grossCents - r.discountGivenCents)}
                </p>
                <p className="text-success mt-0.5 text-[0.9375rem] font-medium">
                  +{formatAud(r.cardFeesAvoidedCents)} not lost to fees
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-muted-foreground mt-8 text-[0.9375rem] leading-relaxed">
        Every payment settles straight into {BIZ_MERCHANT.name}&rsquo;s account at
        PayID {BIZ_MERCHANT.payid}. There is no payout run to wait for, because
        the money never sat anywhere else. Fees avoided are counted at the
        1.40% a card acquirer would have taken on the same sale.
      </p>
    </main>
  );
}
