import type { BizPayment } from "@/lib/biz-sample";
import { formatAud } from "@/lib/money";
import Link from "next/link";

// Completed (settled) row — delegates to the shopper PaymentRow style.
// Abandoned (expired) row — muted, struck-through amount, no chevron.

function dateLabel(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const date = iso.slice(0, 10);
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScanRow({ payment }: { payment: BizPayment }) {
  const viewedAt = payment.firstViewedAt ?? payment.createdAt;
  const isAbandoned = payment.status !== "settled";

  if (isAbandoned) {
    // Abandoned: muted, no link, amount struck-through
    return (
      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 overflow-hidden">
          <p className="text-muted-foreground truncate text-[0.9375rem] line-through tabular-nums">
            {formatAud(payment.amountCents)}
          </p>
          <p className="text-muted-foreground mt-0.5 font-mono text-[0.75rem]">
            {payment.ref}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-muted-foreground text-[0.8125rem]">
            {dateLabel(viewedAt)} {timeLabel(viewedAt)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[0.75rem]">abandoned</p>
        </div>
      </div>
    );
  }

  // Settled
  return (
    <Link
      href={`/payment/${payment.ref}`}
      className="flex items-center gap-4 py-4"
    >
      <div className="flex-1 overflow-hidden">
        <p className="text-foreground truncate text-[0.9375rem] font-semibold tabular-nums">
          {formatAud(payment.amountCents - payment.discountCents)}
        </p>
        <p className="text-muted-foreground mt-0.5 text-[0.875rem]">
          {payment.payerName ?? "Unknown payer"}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-muted-foreground text-[0.8125rem]">
          {dateLabel(payment.settledAt!)} {timeLabel(payment.settledAt!)}
        </p>
        {/* Changed text-[#16a34a] to text-success, and added tabular-nums & font-semibold */}
        <p className="text-success mt-0.5 text-[0.8125rem] font-semibold tabular-nums">
          −{formatAud(payment.discountCents)} given back
        </p>
      </div>
      <span aria-hidden className="text-muted-foreground text-[0.875rem]">›</span>
    </Link>
  );
}
