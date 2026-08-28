import { Card } from "@/components/Card";
import { PaymentRow } from "@/components/PaymentRow";
import { formatAud, splitAud } from "@/lib/money";
import { PAYMENTS, SAVED_CENTS, SPENT_CENTS, byDay } from "@/lib/sample";

export default function Activity() {
  const days = byDay(PAYMENTS);
  const { whole, fraction } = splitAud(SPENT_CENTS);

  return (
    <main className="stagger flex flex-col gap-6 pt-6 pb-4">
      <h1 className="font-display text-2xl">Activity</h1>

      <Card>
        <p className="text-muted-foreground text-[0.8125rem] font-medium">
          Paid by bank
        </p>
        <p className="mt-1 text-3xl leading-none font-semibold tracking-[-0.02em]">
          {whole}
          <span className="text-muted-foreground text-lg">.{fraction}</span>
        </p>
        <div className="border-border mt-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="font-mono text-lg font-medium">{PAYMENTS.length}</p>
            <p className="text-muted-foreground text-[0.75rem]">payments</p>
          </div>
          <div>
            <p className="text-success font-mono text-lg font-medium">
              {formatAud(SAVED_CENTS)}
            </p>
            <p className="text-muted-foreground text-[0.75rem]">kept by you</p>
          </div>
        </div>
      </Card>

      {days.map(([day, payments]) => (
        <section key={day} aria-labelledby={`day-${day.replace(/\s/g, "-")}`}>
          <h2
            id={`day-${day.replace(/\s/g, "-")}`}
            className="text-muted-foreground mb-1 font-mono text-[0.6875rem] tracking-[0.15em] uppercase"
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
    </main>
  );
}
