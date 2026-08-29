import type { Metadata } from "next";
import Link from "next/link";
import { findPayment } from "@/lib/sample";
import { formatAud } from "@/lib/money";

export const metadata: Metadata = {
  title: "CLEVR: Payment complete",
};

export default async function DonePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const payment = findPayment(ref) ?? {
    ref,
    merchant: "Brew & Co",
    paidCents: 995,
    savedCents: 5,
    day: "Today",
    time: "now",
    settledSeconds: 4,
  };

  return (
    <main className="bg-foreground text-paper flex min-h-dvh flex-col items-center justify-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10">
      {/* Sun tick */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff401]">
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          fill="none"
          stroke="#000"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="8,21 16,29 32,13" />
        </svg>
      </div>

      <h1 className="display mt-8 text-center text-[2.5rem] leading-[0.95]">
        Paid.
      </h1>

      <div className="mt-8 w-full rounded-2xl bg-white/10 p-5 text-center">
        <p className="text-on-ink text-[0.875rem]">{payment.merchant}</p>
        <p className="mt-3 text-[2.25rem] font-bold tabular-nums">
          {formatAud(payment.paidCents)}
        </p>
        <p className="text-[#fff401] mt-2 text-[1.0625rem] font-semibold">
          You kept {formatAud(payment.savedCents)}
        </p>
        <p className="text-on-ink mt-4 font-mono text-[0.8125rem]">{ref}</p>
      </div>

      <div className="mt-10 flex w-full flex-col gap-3">
        <Link
          href="/"
          className="bg-paper text-foreground flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-semibold"
        >
          Done
        </Link>
        <Link
          href={`/payment/${ref}`}
          className="border-paper/30 text-paper flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-medium"
        >
          View receipt
        </Link>
      </div>
    </main>
  );
}
