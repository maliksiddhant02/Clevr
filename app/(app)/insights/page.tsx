import { Card } from "@/components/Card";
import { DonutChart } from "@/components/DonutChart";
import { SavingsChart } from "@/components/SavingsChart";
import { formatAud } from "@/lib/money";
import { PAYMENT_COUNT, SAVED_CENTS, topMerchants } from "@/lib/sample";

export default function Insights() {
  // Averaged over lifetime payments, not just the visible 7-row week snapshot.
  const avgSaved = Math.round(SAVED_CENTS / PAYMENT_COUNT);
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
          <p className="text-muted-foreground mt-1.5 text-[0.9375rem]">
            kept per payment
          </p>
        </div>
        <div className="py-5 pl-5">
          <p className="display text-foreground text-[1.75rem] tabular-nums">
            {PAYMENT_COUNT}
          </p>
          <p className="text-muted-foreground mt-1.5 text-[0.9375rem]">
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
    </main>
  );
}
