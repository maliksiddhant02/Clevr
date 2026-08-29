import type { Metadata } from "next";
import { BIZ_PAYMENTS, BIZ_MERCHANT } from "@/lib/biz-sample";
import { reconcile, monthTotals } from "@/lib/reconcile";
import { formatAud } from "@/lib/money";

export const metadata: Metadata = {
  title: "CLEVR: Reconcile",
};

export default function PayoutsPage() {
  const records = reconcile(BIZ_PAYMENTS);
  const totals = monthTotals(records);

  return (
    <main className="pb-28 pt-10">
      {/* Hero band */}
      <div className="bg-foreground -mx-5 rounded-b-3xl px-5 pb-8 pt-6">
        <p className="text-paper/60 text-[0.875rem] font-medium">
          Card fees avoided this month
        </p>
        <p className="text-paper display mt-1 text-[3rem] tabular-nums leading-none">
          {formatAud(totals.cardFeesAvoidedCents)}
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-paper/50 text-[0.75rem]">Gross</p>
            <p className="text-paper mt-0.5 text-[1rem] font-semibold tabular-nums">
              {formatAud(totals.grossCents)}
            </p>
          </div>
          <div>
            <p className="text-paper/50 text-[0.75rem]">Given back</p>
            <p className="text-paper mt-0.5 text-[1rem] font-semibold tabular-nums">
              {formatAud(totals.discountGivenCents)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily rows */}
      <div className="mt-8">
        <p className="text-muted-foreground mb-3 text-[0.8125rem] font-medium uppercase tracking-wide">
          Daily breakdown
        </p>
        <ul className="border-border divide-border divide-y border-y">
          {records.map((r) => (
            <li key={r.date} className="flex items-center gap-3 py-4">
              <div className="flex-1">
                <p className="text-foreground text-[0.9375rem] font-semibold">
                  {new Date(r.date + "T00:00:00").toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[0.8125rem]">
                  {r.settledCount} payment{r.settledCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-foreground tabular-nums text-[0.9375rem] font-semibold">
                  {formatAud(r.grossCents)}
                </p>
                <p className="text-success mt-0.5 text-[0.8125rem] font-semibold tabular-nums">
                  +{formatAud(r.cardFeesAvoidedCents)} saved
                </p>
              </div>
              {r.status === "pending" && (
                <span className="bg-foreground/10 text-foreground rounded-full px-2 py-0.5 text-[0.6875rem] font-medium">
                  pending
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground mt-6 text-[0.8125rem] leading-relaxed">
        {BIZ_MERCHANT.name} · PayID {BIZ_MERCHANT.payid}
      </p>
    </main>
  );
}
