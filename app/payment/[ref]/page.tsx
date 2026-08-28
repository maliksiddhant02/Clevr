import { notFound } from "next/navigation";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { cardFeeCents, formatAud } from "@/lib/money";
import { findPayment } from "@/lib/sample";

export default async function PaymentDetail({
  params,
}: PageProps<"/payment/[ref]">) {
  const { ref } = await params;
  const payment = findPayment(ref);
  if (!payment) notFound();

  const listPrice = payment.paidCents + payment.savedCents;
  const rows = [
    { label: "Shop asked for", value: formatAud(listPrice) },
    { label: "You paid", value: formatAud(payment.paidCents) },
    { label: "You kept", value: `+${formatAud(payment.savedCents)}` },
    { label: "Reference", value: payment.ref },
    { label: "Settled in", value: `${payment.settledSeconds}s` },
  ];

  return (
    <main className="flex flex-col gap-6 pb-10">
      <ScreenHeader title="Payment" back="/activity" />

      <Card tone="paper" radius={1} tilt="left" className="text-center">
        <span
          aria-hidden
          className="border-ink mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl"
        >
          {payment.emoji}
        </span>
        <p className="font-display text-2xl leading-tight">
          {payment.merchant}
        </p>
        <p className="text-base opacity-60">
          {payment.day} · {payment.time}
        </p>
        <p className="font-money mt-4 text-6xl leading-none">
          {formatAud(payment.paidCents)}
        </p>
        <p className="text-marker font-display mt-2 text-xl">
          you kept {formatAud(payment.savedCents)}
        </p>
      </Card>

      <dl className="border-ink rounded-wobble-2 border-2 bg-white px-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${
              i > 0 ? "border-ink border-t-2 border-dashed" : ""
            }`}
          >
            <dt className="text-lg opacity-70">{row.label}</dt>
            <dd className="font-exact text-lg">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="px-1 text-base leading-relaxed opacity-70">
        Paid straight from your bank account to {payment.merchant} over
        Australia&rsquo;s instant payment rail. No card, no fee, no waiting until
        tomorrow — and{" "}
        <span className="font-display opacity-100">
          {formatAud(cardFeeCents(listPrice))}
        </span>{" "}
        that a card network would have taken stayed in the shop.
      </p>
    </main>
  );
}
