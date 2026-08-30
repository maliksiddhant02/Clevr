import { NextResponse } from "next/server";
import { STORE } from "../route";

// The mock rail settles on a POST and on nothing else.
//
// It used to settle itself four seconds after creation, which meant the till
// ticked over whether or not anyone had paid: the merchant's "Confirm
// purchase" button and the shopper's PIN were both decoration on top of a
// timer. Now both of them post here, and a payment nobody touches stays
// pending until it expires — which is what an unpaid payment is.

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

/**
 * Settle. Posted by the shopper's PIN screen and by the merchant's "Confirm
 * purchase" button, which are the demo's two ways of standing in for the rail
 * seeing the transfer land. Idempotent: a second post on a settled payment is
 * a double-tap, not an error.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  const payment = STORE.get(ref);
  if (!payment || payment.status !== "pending") {
    return NextResponse.json({ ok: true });
  }
  payment.status = "settled";
  payment.settledAt = Date.now();
  // First name and last initial: the whole of what a shop is shown.
  payment.payerName = "Nina K";
  STORE.set(ref, payment);
  return NextResponse.json({ ok: true });
}
