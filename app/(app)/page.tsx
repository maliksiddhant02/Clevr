import Link from "next/link";
import { UserRound } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { PaymentRow } from "@/components/PaymentRow";
import { formatAud, splitAud, yearlyRateCents } from "@/lib/money";
import { DAYS_ACTIVE, PAYMENTS, PAYMENT_COUNT, SAVED_CENTS } from "@/lib/sample";

export default function Home() {
  const rate = yearlyRateCents(SAVED_CENTS, PAYMENT_COUNT, DAYS_ACTIVE);
  const { whole, fraction } = splitAud(SAVED_CENTS);

  return (
    <main className="pt-5 pb-28">
      <header className="flex items-center justify-between">
        <span className="display text-foreground text-[1.5rem]">CLEVR</span>
        <Link
          href="/account"
          aria-label="Account"
          className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <UserRound size={19} strokeWidth={1.8} aria-hidden />
        </Link>
      </header>

      {/* The number is the screen. No card around it: white space is the frame,
          and a box here would make it one more tile in a stack of tiles. */}
      <section className="pt-12 pb-8">
        <h1 className="text-muted-foreground text-[0.75rem] font-semibold tracking-[0.12em] uppercase">
          Total kept
        </h1>
        <p className="display text-foreground mt-3 text-[4.5rem] tabular-nums">
          {whole}
          <span className="text-muted-foreground text-[2rem]">.{fraction}</span>
        </p>
        {rate && (
          <p className="text-muted-foreground mt-4 text-[0.9375rem]">
            About{" "}
            <span className="text-foreground font-semibold tabular-nums">
              {formatAud(rate)}
            </span>{" "}
            a year at this pace.
          </p>
        )}
      </section>

      {/* One action. Paying is the entire product; the old four-tile grid
          duplicated three tabs that are already two centimetres below it. */}
      <ButtonLink href="/pay" className="w-full">
        Scan to pay
      </ButtonLink>

      {/* Full bleed, so the page reads as bands rather than as a card stack. */}
      <section className="bg-foreground text-paper -mx-5 mt-12 px-5 py-12">
        <p className="display text-[2.375rem] leading-[0.88]">
          Every card tap costs the shop about{" "}
          <span className="text-sun">1.4%</span>.
        </p>
        <p className="text-on-ink mt-5 text-[0.9375rem] leading-relaxed">
          Paying from your bank avoids that fee. The shop hands part of the
          saving back to you at the till and keeps the rest.
        </p>
      </section>

      <section aria-labelledby="recent-heading" className="pt-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="recent-heading" className="display text-foreground text-[1.5rem]">
            Recent
          </h2>
          <Link
            href="/activity"
            className="text-foreground -my-3.5 py-3.5 text-[0.8125rem] font-medium underline underline-offset-4"
          >
            See all
          </Link>
        </div>
        <ul>
          {PAYMENTS.slice(0, 4).map((p) => (
            <PaymentRow key={p.ref} payment={p} />
          ))}
        </ul>
      </section>
    </main>
  );
}
