import { notFound } from "next/navigation";
import Link from "next/link";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@/components/Avatar";
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
    { label: "Reference", value: payment.ref, mono: true },
    { label: "Settled in", value: `${payment.settledSeconds}s` },
  ];

  return (
    <main className="pb-12">
      {/* Custom header displaying a top-left close "X" icon returning to shopper Home */}
      <header className="flex items-center gap-3 py-4">
        <Link
          href="/app"
          aria-label="Close and go home"
          className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <h1 className="text-foreground flex-1 text-center text-[1.0625rem] font-semibold">
          Payment Details
        </h1>
        <span aria-hidden className="h-11 w-11 shrink-0" />
      </header>

      <div className="flex items-center gap-3 pt-6">
        <Avatar name={payment.merchant} size="lg" />
        <div>
          <p className="text-foreground text-[1.0625rem] font-semibold">
            {payment.merchant}
          </p>
          <p className="text-muted-foreground text-[0.9375rem]">
            {payment.day} · {payment.time}
          </p>
        </div>
      </div>

      <p className="display text-foreground mt-7 text-[4rem] tabular-nums">
        {whole}
        <span className="text-muted-foreground text-[1.75rem]">.{fraction}</span>
      </p>
      <p className="text-success mt-3 text-[1.0625rem] font-semibold tabular-nums">
        you kept {formatAud(payment.savedCents)}
      </p>

      <dl className="border-border mt-9 divide-y divide-[rgb(14_15_12/0.12)] border-y">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-4"
          >
            <dt className="text-muted-foreground text-[0.9375rem]">
              {row.label}
            </dt>
            <dd
              className={`text-[0.9375rem] ${
                row.mono ? "font-mono tracking-[0.04em]" : "tabular-nums"
              } ${
                row.strike
                  ? "text-muted-foreground font-normal line-through"
                  : row.good
                    ? "text-success font-semibold"
                    : "text-foreground font-semibold"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-muted-foreground mt-8 text-[0.9375rem] leading-relaxed">
        Paid straight from your account to {payment.merchant} and settled in
        seconds on Australia&rsquo;s instant rail. The{" "}
        <span className="text-foreground font-semibold tabular-nums">
          {formatAud(cardFeeCents(listPrice))}
        </span>{" "}
        a card network would have taken stayed with the shop.
      </p>
    </main>
  );
}
