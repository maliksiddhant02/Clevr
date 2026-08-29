import type { Metadata } from "next";
import { BIZ_PAYMENTS, BIZ_MERCHANT } from "@/lib/biz-sample";
import { ScanRow } from "@/components/ScanRow";

export const metadata: Metadata = {
  title: "CLEVR: Activity",
};

type DayGroup = [string, typeof BIZ_PAYMENTS];

function groupByDay(payments: typeof BIZ_PAYMENTS): DayGroup[] {
  const map = new Map<string, typeof BIZ_PAYMENTS>();
  for (const p of payments) {
    const key = p.createdAt.slice(0, 10);
    const bucket = map.get(key) ?? [];
    bucket.push(p);
    map.set(key, bucket);
  }
  return [...map].sort((a, b) => b[0].localeCompare(a[0]));
}

function dayLabel(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (iso === today) return "Today";
  if (iso === yesterday) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-AU", {
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

  return (
    <main className="pb-28 pt-10">
      <h1 className="display text-foreground text-[2rem] leading-none">
        Activity
      </h1>
      <p className="text-muted-foreground mt-1 text-[0.9375rem]">
        {BIZ_MERCHANT.name}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {groups.map(([day, payments]) => (
          <section key={day}>
            <p className="text-foreground mb-1 text-[0.8125rem] font-semibold">
              {dayLabel(day)}
            </p>
            <ul className="border-border divide-border divide-y border-y">
              {payments.map((p) => (
                <li key={p.ref}>
                  <ScanRow payment={p} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
