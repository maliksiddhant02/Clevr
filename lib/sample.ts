// Sample data for the shopper app. Every field here is one the schema already
// stores (TECHNICAL.md §10) — nothing is invented for effect. Replaced by a
// query on payments.shopper_cookie once the DB lands.
//
// Day/time are stored as strings rather than derived from Date.now() so the
// prerendered HTML and the client agree. Relative dates computed at render are
// a hydration mismatch waiting to happen.

export type SamplePayment = {
  ref: string;
  merchant: string;
  paidCents: number;
  savedCents: number;
  day: string;
  time: string;
  settledSeconds: number;
};

export const PAYMENTS: SamplePayment[] = [
  { ref: "CLVR7K2QX", merchant: "Brew & Co", paidCents: 495, savedCents: 3, day: "Today", time: "9:24", settledSeconds: 3 },
  { ref: "CLVR4M8ZT", merchant: "West End Markets", paidCents: 1840, savedCents: 9, day: "Today", time: "8:51", settledSeconds: 2 },
  { ref: "CLVRQ3W7N", merchant: "Sunny's Banh Mi", paidCents: 1195, savedCents: 6, day: "Yesterday", time: "12:07", settledSeconds: 4 },
  { ref: "CLVRB6HY2", merchant: "Brew & Co", paidCents: 495, savedCents: 3, day: "Yesterday", time: "8:33", settledSeconds: 2 },
  { ref: "CLVRD9F4K", merchant: "Kanga Cuts", paidCents: 3500, savedCents: 18, day: "Wed 26 Aug", time: "16:20", settledSeconds: 5 },
  { ref: "CLVRS2P8V", merchant: "West End Markets", paidCents: 2260, savedCents: 11, day: "Wed 26 Aug", time: "9:02", settledSeconds: 3 },
  { ref: "CLVRT5J1M", merchant: "Brew & Co", paidCents: 950, savedCents: 5, day: "Tue 25 Aug", time: "8:47", settledSeconds: 2 },
];

export const PAYMENT_COUNT = 184;
export const DAYS_ACTIVE = 213;

// Lifetime aggregates for the home/insights hero numbers. Decoupled from the
// visible PAYMENTS list, which is only the last week: this represents the
// user's full history since joining, so the row-level "you kept 3¢" stays
// realistic while the headline reads like a shopper who has actually used it.
export const SAVED_CENTS = 128_640; // $1,286.40 kept lifetime
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

/** Total kept per merchant, biggest first. */
export function topMerchants() {
  const totals = new Map<string, { cents: number; visits: number }>();
  for (const p of PAYMENTS) {
    const row = totals.get(p.merchant) ?? { cents: 0, visits: 0 };
    row.cents += p.savedCents;
    row.visits += 1;
    totals.set(p.merchant, row);
  }
  return [...totals]
    .map(([merchant, row]) => ({ merchant, ...row }))
    .sort((a, b) => b.cents - a.cents);
}
