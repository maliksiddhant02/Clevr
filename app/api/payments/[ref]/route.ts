import { NextResponse } from "next/server";
import { STORE } from "../route";

const MOCK_SETTLE_MS = 4000; // mock rail settles 4s after creation

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  const payment = STORE.get(ref);

  if (!payment) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const now = Date.now();

  // Lazy expiry — flip to expired on read.
  if (payment.status === "pending" && now > payment.expiresAt) {
    payment.status = "expired";
    STORE.set(ref, payment);
  }

  // Mock rail: settle 4s after creation (TECHNICAL.md §7 — rail/mock.ts).
  if (payment.status === "pending" && now - payment.createdAt >= MOCK_SETTLE_MS) {
    payment.status = "settled";
    payment.settledAt = now;
    payment.payerName = "Demo Shopper";
    STORE.set(ref, payment);
  }

  return NextResponse.json({
    status: payment.status,
    amountCents: payment.amountCents,
    shopperPaysCents: payment.shopperPaysCents,
    payid: payment.payid,
    expiresAt: new Date(payment.expiresAt).toISOString(),
    ...(payment.payerName ? { payerName: payment.payerName } : {}),
    ...(payment.settledAt ? { settledAt: new Date(payment.settledAt).toISOString() } : {}),
  });
}

// Confirm endpoint used by the shopper's PayFlow to trigger mock settlement.
// In production, settlement happens when the rail detects the bank transfer.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  const payment = STORE.get(ref);
  if (!payment || payment.status !== "pending") {
    return NextResponse.json({ ok: true }); // idempotent
  }
  // Accelerate settlement to now (the shopper tapped confirm).
  payment.createdAt = Date.now() - MOCK_SETTLE_MS;
  STORE.set(ref, payment);
  return NextResponse.json({ ok: true });
}
