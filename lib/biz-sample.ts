// Merchant-side payment records.
// All fields are from TECHNICAL.md §10 schema. first_viewed_at is the
// moment the shopper's /p/[ref] page loaded — used to calculate time-to-settle
// and to show "seen but not paid" rows on the activity screen.
//
// Day/time stored as ISO strings (not Date objects) so server and client agree.
// ponytail: replaced by a Supabase query on payments WHERE merchant_id = seed.
//
// The demo shop is a real Australian retailer, used illustratively. It is not
// a partner, its PayID is a placeholder, and none of these payments happened.

export type BizPayment = {
  ref: string;
  amountCents: number;
  discountCents: number;
  status: "pending" | "settled" | "expired";
  payerName: string | null;
  firstViewedAt: string | null; // ISO — when shopper loaded /p/[ref]
  createdAt: string; // ISO
  settledAt: string | null; // ISO
};

/**
 * Local wall-clock, written without a zone: `2026-08-30T17:42:00`.
 *
 * `toISOString()` was wrong here and the bug only showed once the tickets got
 * big. It converts to UTC, so a row authored as "today at 17:42" is stamped
 * with tomorrow's date anywhere west of Greenwich, and every screen that
 * compares `slice(0, 10)` against today then reads the wrong day. A naive
 * string sorts and slices identically and `new Date()` parses it back as the
 * same local time it was written as.
 */
function iso(daysAgo: number, h: number, m = 0, s = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, s, 0);
  return localDay(d) + `T${pad(h)}:${pad(m)}:${pad(s)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `yyyy-mm-dd` in the reader's own day, which is the day they mean. */
export function localDay(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ~3 weeks of till history. Conversion sits around 75%: the abandoned rows are
// the big tickets, which is what actually happens when someone walks a $2,199
// laptop to the counter and decides to think about it.
export const BIZ_PAYMENTS: BizPayment[] = [
  { ref: "CLVR7K2QX", amountCents: 149900, discountCents: 1499, status: "settled", payerName: "Jane M", firstViewedAt: iso(0, 17, 41), createdAt: iso(0, 17, 41), settledAt: iso(0, 17, 42, 3) },
  { ref: "CLVR4M8ZT", amountCents: 8900, discountCents: 89, status: "settled", payerName: "Priya K", firstViewedAt: iso(0, 16, 7), createdAt: iso(0, 16, 7), settledAt: iso(0, 16, 8, 3) },
  { ref: "CLVRJ9N1P", amountCents: 219900, discountCents: 2199, status: "expired", payerName: null, firstViewedAt: iso(0, 14, 1), createdAt: iso(0, 14, 1), settledAt: null },
  { ref: "CLVRW3T7C", amountCents: 2995, discountCents: 30, status: "settled", payerName: "Dan O", firstViewedAt: iso(0, 11, 25), createdAt: iso(0, 11, 25), settledAt: iso(0, 11, 26, 2) },
  { ref: "CLVRQ3W7N", amountCents: 34900, discountCents: 349, status: "settled", payerName: "Sam T", firstViewedAt: iso(1, 15, 3), createdAt: iso(1, 15, 3), settledAt: iso(1, 15, 4, 4) },
  { ref: "CLVRB6HY2", amountCents: 1999, discountCents: 20, status: "settled", payerName: "Anna L", firstViewedAt: iso(1, 12, 29), createdAt: iso(1, 12, 29), settledAt: iso(1, 12, 30, 2) },
  { ref: "CLVRZ4X8B", amountCents: 74900, discountCents: 749, status: "settled", payerName: "Hugo P", firstViewedAt: iso(1, 10, 10), createdAt: iso(1, 10, 10), settledAt: iso(1, 10, 11, 5) },
  { ref: "CLVRD9F4K", amountCents: 429900, discountCents: 4299, status: "settled", payerName: "Thomas R", firstViewedAt: iso(2, 16, 16), createdAt: iso(2, 16, 16), settledAt: iso(2, 16, 17, 6) },
  { ref: "CLVRS2P8V", amountCents: 5995, discountCents: 60, status: "settled", payerName: "Mei C", firstViewedAt: iso(2, 13, 58), createdAt: iso(2, 13, 58), settledAt: iso(2, 13, 59, 2) },
  { ref: "CLVRT5J1M", amountCents: 109900, discountCents: 1099, status: "expired", payerName: null, firstViewedAt: iso(2, 11, 42), createdAt: iso(2, 11, 42), settledAt: null },
  { ref: "CLVR8K3MZ", amountCents: 49900, discountCents: 499, status: "settled", payerName: "Raj B", firstViewedAt: iso(3, 15, 9), createdAt: iso(3, 15, 9), settledAt: iso(3, 15, 10, 3) },
  { ref: "CLVR6Y2XQ", amountCents: 15900, discountCents: 159, status: "settled", payerName: "Lily H", firstViewedAt: iso(3, 9, 56), createdAt: iso(3, 9, 56), settledAt: iso(3, 9, 57, 3) },
  { ref: "CLVR2N7FP", amountCents: 129900, discountCents: 1299, status: "settled", payerName: "Oliver G", firstViewedAt: iso(5, 12, 0), createdAt: iso(5, 12, 0), settledAt: iso(5, 12, 1, 5) },
  { ref: "CLVR1M5WK", amountCents: 3495, discountCents: 35, status: "expired", payerName: null, firstViewedAt: iso(5, 11, 33), createdAt: iso(5, 11, 33), settledAt: null },
  { ref: "CLVR3H8NQ", amountCents: 89900, discountCents: 899, status: "expired", payerName: null, firstViewedAt: iso(5, 10, 50), createdAt: iso(5, 10, 50), settledAt: null },
  { ref: "CLVR9V4KT", amountCents: 27900, discountCents: 279, status: "settled", payerName: "Chloe W", firstViewedAt: iso(5, 10, 9), createdAt: iso(5, 10, 9), settledAt: iso(5, 10, 10, 4) },
  { ref: "CLVRX6J3P", amountCents: 199900, discountCents: 1999, status: "settled", payerName: "Noah E", firstViewedAt: iso(7, 14, 19), createdAt: iso(7, 14, 19), settledAt: iso(7, 14, 20, 4) },
  { ref: "CLVRY8M2N", amountCents: 6990, discountCents: 70, status: "settled", payerName: "Isla F", firstViewedAt: iso(7, 9, 41), createdAt: iso(7, 9, 41), settledAt: iso(7, 9, 42, 2) },
  { ref: "CLVR5T9VZ", amountCents: 329900, discountCents: 3299, status: "settled", payerName: "Ethan M", firstViewedAt: iso(10, 16, 3), createdAt: iso(10, 16, 3), settledAt: iso(10, 16, 4, 6) },
  { ref: "CLVRP2W4J", amountCents: 1250, discountCents: 12, status: "settled", payerName: "Ava S", firstViewedAt: iso(10, 12, 29), createdAt: iso(10, 12, 29), settledAt: iso(10, 12, 30, 2) },
  { ref: "CLVR4K6NY", amountCents: 64900, discountCents: 649, status: "expired", payerName: null, firstViewedAt: iso(10, 9, 11), createdAt: iso(10, 9, 11), settledAt: null },
  { ref: "CLVRH7R3Q", amountCents: 89900, discountCents: 899, status: "settled", payerName: "Mia J", firstViewedAt: iso(14, 12, 1), createdAt: iso(14, 12, 1), settledAt: iso(14, 12, 2, 3) },
  { ref: "CLVRG5Z8W", amountCents: 24900, discountCents: 249, status: "settled", payerName: "Liam B", firstViewedAt: iso(14, 10, 45), createdAt: iso(14, 10, 45), settledAt: iso(14, 10, 46, 3) },
];

export const BIZ_MERCHANT = {
  name: "JB Hi-Fi",
  payid: "jbhifi.demo@up.com.au",
  // 1.00%. Deliberately under the 140bps card fee this shop avoids
  // (lib/reconcile.ts): the shopper's cut comes out of the saving, so a rate
  // above it would cost the merchant money on every sale.
  discountBps: 100,
};
