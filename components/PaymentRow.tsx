import Link from "next/link";
import { formatAud } from "@/lib/money";
import type { SamplePayment } from "@/lib/sample";

export function PaymentRow({ payment }: { payment: SamplePayment }) {
  return (
    <li>
      <Link
        href={`/payment/${payment.ref}`}
        className="hover:bg-muted/60 -mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors duration-200"
      >
        <span
          aria-hidden
          className="bg-muted border-border flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg"
        >
          {payment.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] font-semibold tracking-[-0.01em]">
            {payment.merchant}
          </span>
          <span className="text-muted-foreground block text-[0.8125rem]">
            {payment.day} · {payment.time}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-[0.9375rem] font-semibold">
            {formatAud(payment.paidCents)}
          </span>
          <span className="text-success block text-[0.8125rem] font-medium">
            +{formatAud(payment.savedCents)}
          </span>
        </span>
      </Link>
    </li>
  );
}
