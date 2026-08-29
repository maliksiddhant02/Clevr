import assert from "node:assert/strict";
import { test } from "node:test";
import { reconcile, monthTotals } from "./reconcile.ts";
import type { BizPayment } from "./biz-sample.ts";

function makePayment(overrides: Partial<BizPayment> = {}): BizPayment {
  return {
    ref: "CLVR000001",
    amountCents: 1000,
    discountCents: 5,
    status: "settled",
    payerName: "Test User",
    firstViewedAt: "2025-08-01T09:00:00.000Z",
    createdAt: "2025-08-01T09:00:00.000Z",
    settledAt: "2025-08-01T09:05:00.000Z",
    ...overrides,
  };
}

test("groups payments by settlement date", () => {
  const payments: BizPayment[] = [
    makePayment({ ref: "A", amountCents: 1000, discountCents: 5, settledAt: "2025-08-01T09:00:00.000Z" }),
    makePayment({ ref: "B", amountCents: 2000, discountCents: 10, settledAt: "2025-08-01T10:00:00.000Z" }),
    makePayment({ ref: "C", amountCents: 500, discountCents: 3, settledAt: "2025-08-02T09:00:00.000Z" }),
  ];
  const records = reconcile(payments);
  assert.equal(records.length, 2);
  // Most recent date first
  assert.equal(records[0].date, "2025-08-02");
  assert.equal(records[1].date, "2025-08-01");
  // Day 1 totals
  assert.equal(records[1].grossCents, 3000);
  assert.equal(records[1].discountGivenCents, 15);
  assert.equal(records[1].settledCount, 2);
});

test("card fees avoided at 1.40%", () => {
  const payments: BizPayment[] = [
    makePayment({ amountCents: 10000, discountCents: 50, settledAt: "2025-08-01T09:00:00.000Z" }),
  ];
  const [record] = reconcile(payments);
  // 10000 * 140 / 10000 = 140
  assert.equal(record.cardFeesAvoidedCents, 140);
});

test("ignores non-settled and expired payments", () => {
  const payments: BizPayment[] = [
    makePayment({ status: "pending", settledAt: null }),
    makePayment({ status: "expired", settledAt: null }),
    makePayment({ status: "settled", settledAt: "2025-08-01T09:00:00.000Z" }),
  ];
  const records = reconcile(payments);
  assert.equal(records.length, 1);
  assert.equal(records[0].settledCount, 1);
});

test("monthTotals sums only current month", () => {
  // Use a date far in the past so none of these match the current month.
  const payments: BizPayment[] = [
    makePayment({ amountCents: 1000, discountCents: 5, settledAt: "2020-01-15T09:00:00.000Z" }),
    makePayment({ amountCents: 2000, discountCents: 10, settledAt: "2020-01-16T09:00:00.000Z" }),
  ];
  const records = reconcile(payments);
  const totals = monthTotals(records);
  // Jan 2020 is not the current month, so totals should be zero.
  assert.equal(totals.grossCents, 0);
  assert.equal(totals.discountGivenCents, 0);
});
