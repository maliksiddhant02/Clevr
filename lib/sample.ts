// Sample data for the shopper app. Every field here is one the schema already
// stores (TECHNICAL.md §10) — nothing is invented for effect. Replaced by a
// query on payments.shopper_cookie once the DB lands.
//
// The shop names are real Australian retailers, used illustratively so the
// demo reads like a real week of spending. None of them are partners and none
// of these payments happened; the MVP notice on entry says so.
//
// Day/time are stored as strings rather than derived from Date.now() so the
// prerendered HTML and the client agree. Relative dates computed at render are
// a hydration mismatch waiting to happen.

import { discountCents } from "./money";

export type SamplePayment = {
  ref: string;
  merchant: string;
  paidCents: number;
  savedCents: number;
  day: string;
  time: string;
  settledSeconds: number;
};

/**
 * Each shop sets its own share, so the same $50 does not keep the same amount
 * everywhere. Every rate sits under the 140bps card fee the shop avoids
 * (lib/reconcile.ts) — a shop that gives back more than it saves is a bug in
 * the pitch, not a generous merchant.
 */
export const MERCHANT_BPS: Record<string, number> = {
  "JB Hi-Fi": 100,
  "Rebel Sport": 100,
  "Bunnings": 90,
  Officeworks: 90,
  "Chemist Warehouse": 80,
  Woolworths: 60,
  "Guzman y Gomez": 60,
  "7-Eleven": 50,
};

// Ticket price before the discount. Paid and kept are derived, so a row cannot
// drift out of step with the shop's rate.
const HISTORY = [
  { ref: "CLVR7K2QX", merchant: "JB Hi-Fi", ticketCents: 149_900, day: "Today", time: "17:42", settledSeconds: 4 },
  { ref: "CLVR4M8ZT", merchant: "Woolworths", ticketCents: 8_640, day: "Today", time: "8:51", settledSeconds: 2 },
  { ref: "CLVRQ3W7N", merchant: "Guzman y Gomez", ticketCents: 2_390, day: "Yesterday", time: "12:07", settledSeconds: 3 },
  { ref: "CLVRB6HY2", merchant: "Bunnings", ticketCents: 34_280, day: "Yesterday", time: "10:15", settledSeconds: 4 },
  { ref: "CLVRD9F4K", merchant: "Officeworks", ticketCents: 18_900, day: "Wed 26 Aug", time: "16:20", settledSeconds: 5 },
  { ref: "CLVRS2P8V", merchant: "7-Eleven", ticketCents: 6_210, day: "Wed 26 Aug", time: "7:38", settledSeconds: 2 },
  { ref: "CLVRT5J1M", merchant: "Rebel Sport", ticketCents: 22_995, day: "Tue 25 Aug", time: "13:05", settledSeconds: 3 },
  { ref: "CLVRN8G6R", merchant: "Chemist Warehouse", ticketCents: 4_175, day: "Tue 25 Aug", time: "9:12", settledSeconds: 2 },
] as const;

export const PAYMENTS: SamplePayment[] = HISTORY.map(
  ({ ticketCents, ...row }) => {
    const savedCents = discountCents(ticketCents, MERCHANT_BPS[row.merchant]);
    return { ...row, savedCents, paidCents: ticketCents - savedCents };
  },
);

export const PAYMENT_COUNT = 184;
export const DAYS_ACTIVE = 213;

// Lifetime aggregates for the home/insights hero numbers. Decoupled from the
// visible PAYMENTS list, which is only the last week: this represents the
// user's full history since joining, so the row-level "you kept 31c on fuel"
// stays realistic while the headline reads like a shopper who has actually
// used it. $418.80 on $44,321.80 is 94bps, which is where a mix of big-ticket
// shops and corner-store taps actually lands.
export const SAVED_CENTS = 41_880; // $418.80 kept lifetime
export const SPENT_CENTS = 4_432_180; // $44,321.80 paid by bank lifetime

export function findPayment(ref: string): SamplePayment | undefined {
  return PAYMENTS.find((p) => p.ref === ref);
}

/** Group payments in list order, preserving the day headings. */
export function byDay(payments: SamplePayment[]): [string, SamplePayment[]][] {
  const groups = new Map<string, SamplePayment[]>();
  for (const p of payments) {
    const bucket = groups.get(p.day) ?? [];
    bucket.push(p);
    groups.set(p.day, bucket);
  }
  return [...groups];
}

/**
 * Total kept per merchant, biggest first, rolled up to five rows.
 *
 * The donut carries five colours (components/DonutChart.tsx). A sixth shop
 * reuses the first colour and the legend stops reading as a key, so the tail
 * becomes one "Other" slice rather than a wrap.
 */
export function topMerchants() {
  const totals = new Map<string, { cents: number; visits: number }>();
  for (const p of PAYMENTS) {
    const row = totals.get(p.merchant) ?? { cents: 0, visits: 0 };
    row.cents += p.savedCents;
    row.visits += 1;
    totals.set(p.merchant, row);
  }
  const ranked = [...totals]
    .map(([merchant, row]) => ({ merchant, ...row }))
    .sort((a, b) => b.cents - a.cents);

  if (ranked.length <= 5) return ranked;
  const tail = ranked.slice(4);
  return [
    ...ranked.slice(0, 4),
    {
      merchant: "Other",
      cents: tail.reduce((n, m) => n + m.cents, 0),
      visits: tail.reduce((n, m) => n + m.visits, 0),
    },
  ];
}
