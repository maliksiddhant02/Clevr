import { PaymentRow } from "@/components/PaymentRow";
import { formatAud } from "@/lib/money";
import { PAYMENTS, SAVED_CENTS, SPENT_CENTS, byDay } from "@/lib/sample";

export default function Activity() {
  const days = byDay(PAYMENTS);

  return (
    <main className="flex flex-col gap-6 py-6">
      <h1 className="font-display text-4xl">Activity</h1>

      {/* Summary strip rather than a filter control: with one account and one
          rail there is nothing honest to filter by yet. */}
      <div className="border-ink rounded-wobble-2 flex items-center justify-between border-2 bg-white px-5 py-4">
        <div>
          <p className="font-money text-3xl leading-none">{PAYMENTS.length}</p>
          <p className="text-base opacity-70">payments</p>
        </div>
        <div className="border-ink h-10 border-l-2 border-dashed" aria-hidden />
        <div>
          <p className="font-money text-3xl leading-none">
            {formatAud(SPENT_CENTS)}
          </p>
          <p className="text-base opacity-70">spent</p>
        </div>
        <div className="border-ink h-10 border-l-2 border-dashed" aria-hidden />
        <div>
          <p className="font-money text-marker text-3xl leading-none">
            {formatAud(SAVED_CENTS)}
          </p>
          <p className="text-base opacity-70">kept</p>
        </div>
      </div>

      {days.map(([day, payments]) => (
        <section key={day} aria-labelledby={`day-${day.replace(/\s/g, "-")}`}>
          <h2
            id={`day-${day.replace(/\s/g, "-")}`}
            className="mb-3 text-base tracking-wide uppercase opacity-60"
          >
            {day}
          </h2>
          <ul className="flex flex-col gap-3">
            {payments.map((p) => (
              <PaymentRow key={p.ref} payment={p} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
