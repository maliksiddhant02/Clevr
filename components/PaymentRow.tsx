import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { formatAud } from "@/lib/money";
import type { SamplePayment } from "@/lib/sample";

export function PaymentRow({ payment }: { payment: SamplePayment }) {
  return (
    <li>
      <Link
        href={`/payment/${payment.ref}`}
        className="hover:bg-card -mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors duration-200"
      >
        <Avatar name={payment.merchant} />
        <span className="min-w-0 flex-1">
          <span className="text-foreground block truncate text-[1.0625rem] font-semibold tracking-[-0.01em]">
            {payment.merchant}
          </span>
          <span className="text-muted-foreground block text-[0.9375rem]">
            {payment.day} · {payment.time}
          </span>
        </span>
        <span className="shrink-0 text-right tabular-nums">
          <span className="text-foreground block text-[1.0625rem] font-semibold">
            {formatAud(payment.paidCents)}
          </span>
          <span className="text-success block text-[0.9375rem] font-medium">
            +{formatAud(payment.savedCents)}
          </span>
        </span>
      </Link>
    </li>
  );
}
