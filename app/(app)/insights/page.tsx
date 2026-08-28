import { Card } from "@/components/Card";
import { SavingsChart } from "@/components/SavingsChart";
import { cardFeeCents, formatAud } from "@/lib/money";
import { PAYMENTS, SAVED_CENTS, SPENT_CENTS, topMerchants } from "@/lib/sample";

export default function Insights() {
  // What the shops would have lost to a card acquirer on the same baskets.
  const feesKept = PAYMENTS.reduce(
    (n, p) => n + cardFeeCents(p.paidCents) - p.savedCents,
    0,
  );
  const avgSaved = Math.round(SAVED_CENTS / PAYMENTS.length);

  return (
    <main className="flex flex-col gap-7 py-6">
      <h1 className="font-display text-4xl">Insights</h1>

      <SavingsChart />

      <div className="grid grid-cols-2 gap-4">
        <Card radius={2} tilt="right" className="!p-4">
          <p className="font-money text-3xl leading-none">
            {formatAud(avgSaved)}
          </p>
          <p className="mt-1 text-base opacity-70">kept per payment</p>
        </Card>
        <Card radius={3} className="!p-4">
          <p className="font-money text-3xl leading-none">
            {formatAud(SPENT_CENTS)}
          </p>
          <p className="mt-1 text-base opacity-70">paid by bank</p>
        </Card>
      </div>

      <Card tone="ink" radius={1} tilt="left">
        <p className="text-lg opacity-80">Your shops kept</p>
        <p className="font-money mt-1 text-5xl leading-none">
          {formatAud(feesKept)}
        </p>
        <p className="mt-3 text-lg opacity-80">
          in card fees they would have paid on these sales. That money stayed in
          the business instead of the card networks.
        </p>
      </Card>

      <section aria-labelledby="merchants-heading">
        <h2 id="merchants-heading" className="font-display mb-3 text-2xl">
          Where you shop
        </h2>
        <ul className="flex flex-col gap-3">
          {topMerchants().map((m) => (
            <li
              key={m.merchant}
              className="border-ink rounded-wobble-sm shadow-paper flex items-center gap-3 border-2 bg-white p-3"
            >
              <span
                aria-hidden
                className="border-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xl"
              >
                {m.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg leading-tight">
                  {m.merchant}
                </span>
                <span className="block text-base opacity-60">
                  {m.visits} {m.visits === 1 ? "visit" : "visits"}
                </span>
              </span>
              <span className="font-exact shrink-0 text-lg">
                {formatAud(m.cents)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
