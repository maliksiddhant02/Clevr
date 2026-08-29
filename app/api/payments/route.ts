import { NextResponse } from "next/server";

// In-process mock store. Keyed by ref.
// Structure matches the real DB schema (TECHNICAL.md §10) so the swap is
// a data-source change, not a rewrite.
export type MockPayment = {
  ref: string;
  amountCents: number;
  discountCents: number;
  shopperPaysCents: number;
  payid: string;
  status: "pending" | "settled" | "expired";
  createdAt: number; // Date.now()
  expiresAt: number;
  settledAt: number | null;
  payerName: string | null;
};

// Module-level map — shared across requests in the same lambda instance.
export const STORE = new Map<string, MockPayment>();

const PAYID = process.env.UP_PAYID ?? "clevr@up.com.au";
const EXPIRE_MS = 10 * 60 * 1000; // 10 minutes

// Crockford base32, same alphabet as lib/money ref codes.
function makeRef(): string {
  const CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let r = "CLVR";
  for (let i = 0; i < 6; i++) r += CHARS[Math.floor(Math.random() * CHARS.length)];
  return r;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const n = (body as Record<string, unknown>)?.amountCents;
  if (!Number.isSafeInteger(n) || (n as number) < 1 || (n as number) > 100_000) {
    return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  }
  const amountCents = n as number;
  const discountCents = Math.max(1, Math.round((amountCents * 50) / 10000));
  const shopperPaysCents = amountCents - discountCents;

  const customRef = (body as Record<string, unknown>)?.ref;
  const ref = typeof customRef === "string" && customRef.startsWith("CLVR") ? customRef : makeRef();
  const now = Date.now();
  const payment: MockPayment = {
    ref,
    amountCents,
    discountCents,
    shopperPaysCents,
    payid: PAYID,
    status: "pending",
    createdAt: now,
    expiresAt: now + EXPIRE_MS,
    settledAt: null,
    payerName: null,
  };
  STORE.set(ref, payment);

  return NextResponse.json(
    {
      ref,
      payid: PAYID,
      amountCents,
      discountCents,
      shopperPaysCents,
      expiresAt: new Date(payment.expiresAt).toISOString(),
    },
    { status: 201 },
  );
}
