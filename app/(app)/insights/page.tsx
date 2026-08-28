import { Card } from "@/components/Card";
import { DonutChart } from "@/components/DonutChart";
import { SavingsChart } from "@/components/SavingsChart";
import { SectionLabel } from "@/components/SectionLabel";
import { cardFeeCents, formatAud } from "@/lib/money";
import { PAYMENTS, SAVED_CENTS, topMerchants } from "@/lib/sample";

export default function Insights() {
  // What a card acquirer would have taken on the same baskets, less what we
  // handed back to the shopper — the part that stayed with the business.
  const feesKept = PAYMENTS.reduce(
    (n, p) => n + cardFeeCents(p.paidCents) - p.savedCents,
    0,
  );
  const avgSaved = Math.round(SAVED_CENTS / PAYMENTS.length);
  const merchants = topMerchants();

  return (
    <main className="stagger flex flex-col gap-6 pt-6 pb-4">
      <h1 className="font-display text-2xl">Insights</h1>

      <SavingsChart />

      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-4">
          <p className="font-mono text-xl font-medium">
            {formatAud(avgSaved)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[0.75rem]">
            kept per payment
          </p>
        </Card>
        <Card className="!p-4">
          <p className="font-mono text-xl font-medium">{PAYMENTS.length}</p>
          <p className="text-muted-foreground mt-0.5 text-[0.75rem]">
            payments by bank
          </p>
        </Card>
      </div>

      <section aria-labelledby="where-heading">
        <h2 id="where-heading" className="mb-2 text-base font-semibold">
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

      {/* Inverted spotlight — the merchant-side number, which is the part the
          shopper never sees anywhere else. */}
      <Card tone="inverted">
        <SectionLabel>Your shops kept</SectionLabel>
        <p className="mt-3 text-4xl leading-none font-semibold tracking-[-0.02em]">
          {formatAud(feesKept)}
        </p>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-white/70">
          in card fees they would have paid on these sales. That money stayed in
          the business instead of the card networks.
        </p>
      </Card>

    </main>
  );
}
