import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatAud } from "@/lib/money";
import type { SamplePayment } from "@/lib/sample";

export function PaymentRow({ payment }: { payment: SamplePayment }) {
  return (
    <li>
      <Link
        href={`/payment/${payment.ref}`}
        className="border-ink rounded-wobble-sm shadow-paper flex items-center gap-3 border-2 bg-white p-3 transition-all duration-100 hover:shadow-hard-sm"
      >
        <span
          aria-hidden
          className="border-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xl"
        >
          {payment.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg leading-tight">
            {payment.merchant}
          </span>
          <span className="block text-base opacity-60">
            {payment.day} · {payment.time}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="font-exact block text-lg">
            {formatAud(payment.paidCents)}
          </span>
          <span className="bg-pen text-paper rounded-wobble-sm mt-1 inline-block px-2 text-sm">
            +{formatAud(payment.savedCents)}
          </span>
        </span>
        <ChevronRight size={18} strokeWidth={2.5} aria-hidden className="shrink-0 opacity-40" />
      </Link>
    </li>
  );
}
