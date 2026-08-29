import { Card } from "@/components/Card";
import { DonutChart } from "@/components/DonutChart";
import { SavingsChart } from "@/components/SavingsChart";
import { cardFeeCents, formatAud } from "@/lib/money";
import { PAYMENTS, SAVED_CENTS, topMerchants } from "@/lib/sample";

export default function Insights() {
  // What a card acquirer would have taken on the same baskets, less what we
  // handed back to the shopper. The remainder stayed with the business.
  const feesKept = PAYMENTS.reduce(
    (n, p) => n + cardFeeCents(p.paidCents) - p.savedCents,
    0,
  );
  const avgSaved = Math.round(SAVED_CENTS / PAYMENTS.length);
  const merchants = topMerchants();

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Insights</h1>

      <div className="pt-8">
        <SavingsChart />
      </div>

      {/* Two numbers, not two more boxes. Rules carry the division. */}
      <div className="border-border mt-8 grid grid-cols-2 border-y">
        <div className="border-border border-r py-5 pr-4">
          <p className="display text-foreground text-[1.75rem] tabular-nums">
            {formatAud(avgSaved)}
          </p>
          <p className="text-muted-foreground mt-1.5 text-[0.8125rem]">
            kept per payment
          </p>
        </div>
        <div className="py-5 pl-5">
          <p className="display text-foreground text-[1.75rem] tabular-nums">
            {PAYMENTS.length}
          </p>
          <p className="text-muted-foreground mt-1.5 text-[0.8125rem]">
            payments by bank
          </p>
        </div>
      </div>

      <section aria-labelledby="where-heading" className="pt-10">
        <h2
          id="where-heading"
          className="display text-foreground mb-4 text-[1.5rem]"
        >
          Where you shop
        </h2>
        <Card>
          <DonutChart
            segments={merchants.map((m) => ({ label: m.merchant, cents: m.cents }))}
            totalCents={SAVED_CENTS}
            caption={`Kept by shop. ${merchants
              .map((m) => `${m.merchant} ${formatAud(m.cents)}`)
              .join(", ")}.`}
          />
        </Card>
      </section>

      {/* The merchant-side number, which the shopper sees nowhere else. Full
          bleed to the bottom edge, with the tab-bar clearance inside it. */}
      <section className="bg-foreground text-paper -mx-5 -mb-28 mt-12 px-5 pt-12 pb-32">
        <p className="display text-sun text-[4rem] tabular-nums">
          {formatAud(feesKept)}
        </p>
        <p className="text-on-ink mt-5 text-[0.9375rem] leading-relaxed">
          in card fees your shops avoided on these sales. That money stayed with
          the businesses you bought from rather than the card networks.
        </p>
      </section>
    </main>
  );
}
