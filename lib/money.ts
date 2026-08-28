// Pure arithmetic. Imports nothing, touches no I/O — which is why its test
// needs no mocks, no DB and no fixtures. See TECHNICAL.md §3, §9.

export type Cents = number;

/**
 * The shopper's cut of the merchant's saved card fee.
 *
 * Always leaves the shopper paying at least 1c: a "free" sale is a bug, not a
 * generous discount. Always at least 1c off where the sale can afford it, so a
 * discount never rounds away to nothing and makes the promise a lie.
 */
export function discountCents(amount: Cents, bps: number): Cents {
  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new RangeError(`amount must be a positive integer of cents: ${amount}`);
  }
  const raw = Math.max(1, Math.round((amount * bps) / 10000));
  return Math.min(raw, amount - 1);
}

export function shopperPays(amount: Cents, bps: number): Cents {
  return amount - discountCents(amount, bps);
}

/** What a card acquirer would have taken on the same sale, for comparison. */
export function cardFeeCents(amount: Cents, bps = 140): Cents {
  return Math.round((amount * bps) / 10000);
}

export function formatAud(cents: Cents): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

/**
 * Naive linear projection from the shopper's history so far.
 *
 * ponytail: linear extrapolation from first payment. Fine for a demo counter,
 * not a forecast. Needs a rolling window once there's more than a weekend of
 * data. Returns null below two payments — an annual figure extrapolated from a
 * single $1 payment is absurd and instantly discreditable on stage.
 */
export function yearlyRateCents(
  totalSaved: Cents,
  paymentCount: number,
  daysActive: number,
): Cents | null {
  if (paymentCount < 2) return null;
  return Math.round((totalSaved / Math.max(daysActive, 1)) * 365);
}
