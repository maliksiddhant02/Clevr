// Merchant-side payment records.
// All fields are from TECHNICAL.md §10 schema. first_viewed_at is the
// moment the shopper's /p/[ref] page loaded — used to calculate time-to-settle
// and to show "seen but not paid" rows on the activity screen.
//
// Day/time stored as ISO strings (not Date objects) so server and client agree.
// ponytail: replaced by a Supabase query on payments WHERE merchant_id = seed.

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

function iso(daysAgo: number, h: number, m = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

// ~3 weeks of history for Brew & Co.
// Conversion rate: ~70% — one clump of abandoned payments on Wed 13 Aug
// to demonstrate the "seen not paid" pattern.
export const BIZ_PAYMENTS: BizPayment[] = [
  // Today
  { ref: "CLVR7K2QX", amountCents: 500,  discountCents: 3,  status: "settled", payerName: "Jane M",      firstViewedAt: iso(0, 9, 22),  createdAt: iso(0, 9, 21),  settledAt: iso(0, 9, 24) },
  { ref: "CLVR4M8ZT", amountCents: 1850, discountCents: 9,  status: "settled", payerName: "Priya K",     firstViewedAt: iso(0, 8, 49),  createdAt: iso(0, 8, 48),  settledAt: iso(0, 8, 51) },
  { ref: "CLVRJ9N1P", amountCents: 1200, discountCents: 6,  status: "expired", payerName: null,          firstViewedAt: iso(0, 8, 5),   createdAt: iso(0, 8, 2),   settledAt: null },

  // Yesterday
  { ref: "CLVRQ3W7N", amountCents: 1200, discountCents: 6,  status: "settled", payerName: "Sam T",       firstViewedAt: iso(1, 12, 5),  createdAt: iso(1, 12, 4),  settledAt: iso(1, 12, 8) },
  { ref: "CLVRB6HY2", amountCents: 500,  discountCents: 3,  status: "settled", payerName: "Anna L",      firstViewedAt: iso(1, 8, 31),  createdAt: iso(1, 8, 30),  settledAt: iso(1, 8, 33) },

  // 2 days ago
  { ref: "CLVRD9F4K", amountCents: 3500, discountCents: 18, status: "settled", payerName: "Thomas R",    firstViewedAt: iso(2, 16, 18), createdAt: iso(2, 16, 17), settledAt: iso(2, 16, 22) },
  { ref: "CLVRS2P8V", amountCents: 2260, discountCents: 11, status: "settled", payerName: "Mei C",       firstViewedAt: iso(2, 9, 0),   createdAt: iso(2, 8, 59),  settledAt: iso(2, 9, 2) },
  { ref: "CLVRT5J1M", amountCents: 950,  discountCents: 5,  status: "expired", payerName: null,          firstViewedAt: iso(2, 8, 45),  createdAt: iso(2, 8, 43),  settledAt: null },

  // 3 days ago
  { ref: "CLVR8K3MZ", amountCents: 1850, discountCents: 9,  status: "settled", payerName: "Raj B",       firstViewedAt: iso(3, 15, 11), createdAt: iso(3, 15, 10), settledAt: iso(3, 15, 13) },
  { ref: "CLVR6Y2XQ", amountCents: 500,  discountCents: 3,  status: "settled", payerName: "Lily H",      firstViewedAt: iso(3, 8, 58),  createdAt: iso(3, 8, 57),  settledAt: iso(3, 9, 0) },

  // 5 days ago — "clump" morning: 4 scans, 2 paid
  { ref: "CLVR2N7FP", amountCents: 1200, discountCents: 6,  status: "settled", payerName: "Oliver G",    firstViewedAt: iso(5, 9, 3),   createdAt: iso(5, 9, 1),   settledAt: iso(5, 9, 6) },
  { ref: "CLVR1M5WK", amountCents: 500,  discountCents: 3,  status: "expired", payerName: null,          firstViewedAt: iso(5, 9, 35),  createdAt: iso(5, 9, 34),  settledAt: null },
  { ref: "CLVR3H8NQ", amountCents: 500,  discountCents: 3,  status: "expired", payerName: null,          firstViewedAt: iso(5, 9, 52),  createdAt: iso(5, 9, 51),  settledAt: null },
  { ref: "CLVR9V4KT", amountCents: 1850, discountCents: 9,  status: "settled", payerName: "Chloe W",     firstViewedAt: iso(5, 10, 12), createdAt: iso(5, 10, 10), settledAt: iso(5, 10, 14) },

  // 7 days ago
  { ref: "CLVRX6J3P", amountCents: 1200, discountCents: 6,  status: "settled", payerName: "Noah E",      firstViewedAt: iso(7, 14, 22), createdAt: iso(7, 14, 20), settledAt: iso(7, 14, 24) },
  { ref: "CLVRY8M2N", amountCents: 2260, discountCents: 11, status: "settled", payerName: "Isla F",      firstViewedAt: iso(7, 8, 43),  createdAt: iso(7, 8, 42),  settledAt: iso(7, 8, 45) },

  // 10 days ago
  { ref: "CLVR5T9VZ", amountCents: 3500, discountCents: 18, status: "settled", payerName: "Ethan M",     firstViewedAt: iso(10, 16, 5), createdAt: iso(10, 16, 4), settledAt: iso(10, 16, 8) },
  { ref: "CLVRP2W4J", amountCents: 500,  discountCents: 3,  status: "settled", payerName: "Ava S",       firstViewedAt: iso(10, 8, 31), createdAt: iso(10, 8, 30), settledAt: iso(10, 8, 33) },
  { ref: "CLVR4K6NY", amountCents: 1200, discountCents: 6,  status: "expired", payerName: null,          firstViewedAt: iso(10, 9, 14), createdAt: iso(10, 9, 12), settledAt: null },

  // 14 days ago
  { ref: "CLVRH7R3Q", amountCents: 1850, discountCents: 9,  status: "settled", payerName: "Mia J",       firstViewedAt: iso(14, 12, 3), createdAt: iso(14, 12, 2), settledAt: iso(14, 12, 5) },
  { ref: "CLVRG5Z8W", amountCents: 950,  discountCents: 5,  status: "settled", payerName: "Liam B",      firstViewedAt: iso(14, 8, 47), createdAt: iso(14, 8, 46), settledAt: iso(14, 8, 49) },
];

export const BIZ_MERCHANT = {
  name: "Brew & Co",
  payid: "brewco@up.com.au",
  discountBps: 50,
};
