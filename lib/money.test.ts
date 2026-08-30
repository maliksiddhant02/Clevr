import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cardFeeCents,
  discountCents,
  formatAud,
  shopperPays,
  splitAud,
  yearlyRateCents,
} from "./money.ts";

test("the $10 sale from the pitch", () => {
  assert.equal(discountCents(1000, 50), 5);
  assert.equal(shopperPays(1000, 50), 995);
  // Merchant nets more than they would on cards, and a day earlier.
  assert.ok(shopperPays(1000, 50) > 1000 - cardFeeCents(1000));
});

test("a sale can never become free", () => {
  // 1c at 50bps rounds up to a 1c discount, which would leave nothing to pay.
  assert.equal(discountCents(1, 50), 0);
  assert.equal(shopperPays(1, 50), 1);
});

test("discount never exceeds the sale and never rounds to zero", () => {
  for (const amount of [1, 2, 5, 99, 100, 1000, 99999]) {
    const d = discountCents(amount, 50);
    assert.ok(d >= 0, `${amount}: negative discount`);
    assert.ok(d < amount, `${amount}: discount swallowed the sale`);
    if (amount > 1) assert.ok(d >= 1, `${amount}: discount rounded away`);
  }
});

test("rejects junk amounts rather than quietly coercing them", () => {
  for (const bad of [0, -100, 9.5, NaN, Infinity]) {
    assert.throws(() => discountCents(bad, 50), RangeError, `accepted ${bad}`);
  }
});

test("formats cents as AUD", () => {
  assert.equal(formatAud(995), "$9.95");
  assert.equal(formatAud(5), "$0.05");
  assert.equal(formatAud(100000), "$1,000.00");
  assert.equal(formatAud(148401), "$1,484.01");
});

test("no annual projection from a single payment", () => {
  assert.equal(yearlyRateCents(5, 1, 1), null);
  assert.equal(yearlyRateCents(235, 12, 14), Math.round((235 / 14) * 365));
  // Same day as the first payment must not divide by zero.
  assert.equal(yearlyRateCents(10, 2, 0), 3650);
});

test("splits money for display", () => {
  assert.deepEqual(splitAud(876050), { whole: "$8,760", fraction: "50" });
  assert.deepEqual(splitAud(5), { whole: "$0", fraction: "05" });
});
