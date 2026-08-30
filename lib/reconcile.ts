// Pure arithmetic — no I/O. Groups settled payments by settlement date,
// sums gross / discounts given / card fees avoided.
//
// Card fee reference: 1.40% (TECHNICAL.md §9).
// "Fees avoided" is what the merchant would have paid on card vs what they
// actually paid via CLEVR (zero — the merchant receives the full shopper amount).

import type { BizPayment } from "./biz-sample";

export type DayRecord = {
  date: string; // ISO date yyyy-mm-dd
  grossCents: number; // sum of amount_cents for settled payments
  discountGivenCents: number; // sum of discount_cents (given to shoppers)
  cardFeesAvoidedCents: number; // what card would have cost at 1.40%
  settledCount: number;
  status: "settled" | "pending"; // pending = today / not yet fully reconciled
};

const CARD_BPS = 140; // 1.40%

function toDate(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Today in the reader's own day. Not `toISOString().slice(0, 10)`: that is the
 * UTC day, so west of Greenwich an evening settlement is filed under tomorrow
 * and "pending today" lands on the wrong row. Written out rather than imported
 * to keep this module free of anything but arithmetic.
 */
function localDay(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function reconcile(payments: BizPayment[]): DayRecord[] {
  const settled = payments.filter((p) => p.status === "settled" && p.settledAt);

  const map = new Map<string, DayRecord>();

  for (const p of settled) {
    const date = toDate(p.settledAt!);
    const rec = map.get(date) ?? {
      date,
      grossCents: 0,
      discountGivenCents: 0,
      cardFeesAvoidedCents: 0,
      settledCount: 0,
      status: "settled" as const,
    };

    rec.grossCents += p.amountCents;
    rec.discountGivenCents += p.discountCents;
    rec.cardFeesAvoidedCents += Math.round((p.amountCents * CARD_BPS) / 10000);
    rec.settledCount += 1;
    map.set(date, rec);
  }

  const today = localDay();
  const records = [...map.values()].sort((a, b) => b.date.localeCompare(a.date));

  // Mark today's record as pending until a real settlement batch closes it.
  return records.map((r) => ({
    ...r,
    status: r.date === today ? "pending" : "settled",
  }));
}

/** Month-to-date totals for the hero number. */
export function monthTotals(records: DayRecord[]): {
  grossCents: number;
  discountGivenCents: number;
  cardFeesAvoidedCents: number;
} {
  const thisMonth = localDay().slice(0, 7);
  const month = records.filter((r) => r.date.startsWith(thisMonth));
  return {
    grossCents: month.reduce((n, r) => n + r.grossCents, 0),
    discountGivenCents: month.reduce((n, r) => n + r.discountGivenCents, 0),
    cardFeesAvoidedCents: month.reduce((n, r) => n + r.cardFeesAvoidedCents, 0),
  };
}
