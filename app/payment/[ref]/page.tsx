import { notFound } from "next/navigation";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { cardFeeCents, formatAud, splitAud } from "@/lib/money";
import { findPayment } from "@/lib/sample";

export default async function PaymentDetail({
  params,
}: PageProps<"/payment/[ref]">) {
  const { ref } = await params;
  const payment = findPayment(ref);
  if (!payment) notFound();

  const listPrice = payment.paidCents + payment.savedCents;
  const { whole, fraction } = splitAud(payment.paidCents);

  const rows = [
    { label: "Shop asked for", value: formatAud(listPrice), strike: true },
    { label: "You paid", value: formatAud(payment.paidCents) },
    { label: "You kept", value: `+${formatAud(payment.savedCents)}`, good: true },
    { label: "Reference", value: payment.ref },
    { label: "Settled in", value: `${payment.settledSeconds}s` },
  ];

  return (
    <main className="stagger flex flex-col gap-5 pb-10">
      <ScreenHeader title="Payment" back="/activity" />

      <Card className="relative overflow-hidden text-center">
        <div
          aria-hidden
          className="from-accent/20 pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-2xl"
        />
        <div className="relative">
          <span
            aria-hidden
            className="bg-muted border-border mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border text-2xl"
          >
            {payment.emoji}
          </span>
          <p className="text-[0.9375rem] font-semibold">{payment.merchant}</p>
          <p className="text-muted-foreground text-[0.8125rem]">
            {payment.day} · {payment.time}
          </p>
          <p className="mt-4 text-[2.75rem] leading-none font-semibold tracking-[-0.03em]">
            {whole}
            <span className="text-muted-foreground text-2xl">.{fraction}</span>
          </p>
          <p className="text-success mt-2 text-[0.875rem] font-semibold">
            you kept {formatAud(payment.savedCents)}
          </p>
        </div>
      </Card>

      <dl className="border-border bg-card divide-border divide-y rounded-2xl border px-4 shadow-md">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-3.5"
          >
            <dt className="text-muted-foreground text-[0.875rem]">
              {row.label}
            </dt>
            <dd
              className={`font-mono text-[0.875rem] font-medium ${
                row.good ? "text-success" : ""
              } ${row.strike ? "text-muted-foreground line-through" : ""}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-muted-foreground px-1 text-[0.8125rem] leading-relaxed">
        Paid straight from your bank account to {payment.merchant} over
        Australia&rsquo;s instant payment rail. No card, no waiting until
        tomorrow — and{" "}
        <span className="text-foreground font-mono font-medium">
          {formatAud(cardFeeCents(listPrice))}
        </span>{" "}
        that a card network would have taken stayed in the shop.
      </p>
    </main>
  );
}
