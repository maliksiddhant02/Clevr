import type { Metadata } from "next";
import { BIZ_PAYMENTS, BIZ_MERCHANT, localDay } from "@/lib/biz-sample";
import { formatAud, splitAud } from "@/lib/money";
import { Card } from "@/components/Card";
import { ScanRow } from "@/components/ScanRow";

export const metadata: Metadata = {
  title: "CLEVR: Activity",
};

function groupByDay(payments: typeof BIZ_PAYMENTS) {
  const map = new Map<string, typeof BIZ_PAYMENTS>();
  for (const p of payments) {
    const key = p.createdAt.slice(0, 10);
    map.set(key, [...(map.get(key) ?? []), p]);
  }
  return [...map].sort((a, b) => b[0].localeCompare(a[0]));
}

function dayLabel(day: string): string {
  if (day === localDay()) return "Today";
  if (day === localDay(new Date(Date.now() - 86400000))) return "Yesterday";
  return new Date(day + "T00:00:00").toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function ActivityPage() {
  const sorted = [...BIZ_PAYMENTS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const groups = groupByDay(sorted);

  const settled = BIZ_PAYMENTS.filter((p) => p.status === "settled");
  const takings = settled.reduce(
    (n, p) => n + p.amountCents - p.discountCents,
    0,
  );
  const givenBack = settled.reduce((n, p) => n + p.discountCents, 0);
  const { whole, fraction } = splitAud(takings);

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Activity</h1>

      {/* The same opening the shopper's Activity has: one number, then the two
          facts that qualify it, divided by rules rather than boxed. */}
      <section className="pt-8">
        <h2 className="text-muted-foreground text-[0.8125rem] font-semibold tracking-[0.12em] uppercase">
          Banked at {BIZ_MERCHANT.name}
        </h2>
        <p className="display text-foreground mt-3 text-[3.25rem] tabular-nums">
          {whole}
          <span className="text-muted-foreground text-[1.5rem]">.{fraction}</span>
        </p>
        <div className="border-border mt-6 grid grid-cols-2 border-y">
          <div className="border-border border-r py-4 pr-4">
            <p className="display text-foreground text-[1.5rem] tabular-nums">
              {settled.length}
            </p>
            <p className="text-muted-foreground mt-1.5 text-[0.9375rem]">
              payments taken
            </p>
          </div>
          <div className="py-4 pl-5">
            <p className="display text-success text-[1.5rem] tabular-nums">
              {formatAud(givenBack)}
            </p>
            <p className="text-muted-foreground mt-1.5 text-[0.9375rem]">
              handed back
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-7 pt-9">
        {groups.map(([day, payments]) => (
          <section key={day} aria-labelledby={`day-${day}`}>
            <h2
              id={`day-${day}`}
              className="text-muted-foreground mb-2 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase"
            >
              {dayLabel(day)}
            </h2>
            <Card className="divide-border divide-y py-1">
              {payments.map((p) => (
                <ScanRow key={p.ref} payment={p} />
              ))}
            </Card>
          </section>
        ))}
      </div>
    </main>
  );
}
