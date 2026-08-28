import { formatAud, splitAud } from "@/lib/money";
import { PaymentRow } from "@/components/PaymentRow";
import { PAYMENTS, SAVED_CENTS, SPENT_CENTS, byDay } from "@/lib/sample";

export default function Activity() {
  const days = byDay(PAYMENTS);
  const { whole, fraction } = splitAud(SPENT_CENTS);

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Activity</h1>

      <section className="pt-8">
        <h2 className="text-muted-foreground text-[0.75rem] font-semibold tracking-[0.12em] uppercase">
          Paid by bank
        </h2>
        <p className="display text-foreground mt-3 text-[3.25rem] tabular-nums">
          {whole}
          <span className="text-muted-foreground text-[1.5rem]">.{fraction}</span>
        </p>
        <div className="border-border mt-6 grid grid-cols-2 border-y">
          <div className="border-border border-r py-4 pr-4">
            <p className="display text-foreground text-[1.5rem] tabular-nums">
              {PAYMENTS.length}
            </p>
            <p className="text-muted-foreground mt-1.5 text-[0.8125rem]">
              payments
            </p>
          </div>
          <div className="py-4 pl-5">
            <p className="display text-success text-[1.5rem] tabular-nums">
              {formatAud(SAVED_CENTS)}
            </p>
            <p className="text-muted-foreground mt-1.5 text-[0.8125rem]">
              kept by you
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-7 pt-9">
        {days.map(([day, payments]) => (
          <section key={day} aria-labelledby={`day-${day.replace(/\s/g, "-")}`}>
            <h2
              id={`day-${day.replace(/\s/g, "-")}`}
              className="text-muted-foreground mb-2 text-[0.75rem] font-semibold tracking-[0.12em] uppercase"
            >
              {day}
            </h2>
            <ul>
              {payments.map((p) => (
                <PaymentRow key={p.ref} payment={p} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
