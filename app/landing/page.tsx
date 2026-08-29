import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, Lock, Zap } from "lucide-react";
import { Button, ButtonLink } from "@/components/Button";
import { CardRail } from "@/components/CardRail";

export const metadata: Metadata = {
  title: "CLEVR — Pay by bank, pay less",
  description:
    "Pay a shop straight from your bank and keep a share of the card fee the shop just avoided.",
};

// Placeholder marks. Nothing here is a real endorsement: replace every name
// before this page is published anywhere.
const BACKERS = [
  "Northline Ventures",
  "Harbour Seed",
  "Fitzroy Capital",
  "Meridian Partners",
  "Southbank Labs",
] as const;

const PRESS = ["THE LEDGER", "PAYSTACK WEEKLY", "FINTECH AU"] as const;

const SLIDES = [
  { title: "Track your spend", note: "Every payment, every fee" },
  { title: "See what you kept", note: "Down to the cent" },
  { title: "Pay in two taps", note: "Scan, confirm, done" },
] as const;

const FOOTER = [
  ["CLEVR card", "Rewards", "Support", "Responsible play", "Privacy policy"],
  ["How it works", "Reward terms", "Privacy notice", "Terms of service", "Card terms"],
] as const;

export default function Landing() {
  return (
    <main>
      {/* Native disclosure, no menu state to manage. The wordmark is optically
          centred by giving both flanks the same 44px target. */}
      <header className="flex items-center justify-between pt-4 pb-6">
        <details className="relative">
          <summary className="border-foreground text-foreground flex h-11 w-11 list-none items-center justify-center rounded-full border">
            <span className="sr-only">Menu</span>
            <span aria-hidden className="flex flex-col gap-[3px]">
              <span className="bg-foreground block h-[2px] w-4 rounded-full" />
              <span className="bg-foreground block h-[2px] w-4 rounded-full" />
              <span className="bg-foreground block h-[2px] w-4 rounded-full" />
            </span>
          </summary>
          <nav
            aria-label="Site"
            className="bg-card absolute top-13 left-0 z-30 w-56 rounded-2xl p-2"
          >
            {[
              ["Open the app", "/"],
              ["Scan to pay", "/pay"],
              ["Rewards", "/insights"],
              ["Account", "/account"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-foreground flex min-h-11 items-center rounded-xl px-4 text-[0.9375rem] font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        </details>

        <span className="display text-foreground text-[1.75rem]">clevr</span>
        <span aria-hidden className="h-11 w-11" />
      </header>

      {/* Hero. An Ink block on Sun, tall enough to be the whole first screen. */}
      <section className="bg-foreground flex min-h-[30rem] flex-col justify-end rounded-2xl p-7 pb-9 text-center">
        <h1 className="display text-paper text-[2.875rem]">
          Pay by bank,
          <br />
          keep the fee
        </h1>
        <p className="text-on-ink mt-4 text-[0.9375rem]">Nothing hidden. Your rules.</p>
        <ButtonLink href="#waitlist" variant="paper" className="mt-7 self-center px-10">
          Join the waitlist
        </ButtonLink>
      </section>

      {/* The claim. Badge, headline, the card, then the two actions. */}
      <section id="waitlist" className="pt-20 text-center">
        <span className="border-foreground text-foreground inline-flex h-7 items-center rounded-full border px-4 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
          New
        </span>
        <h2 className="display text-foreground mt-6 text-[2.5rem]">
          Keep up to 40%
          <br />
          of every fee
          <span className="align-super text-[1.25rem]">*</span>
        </h2>

        {/* The product, drawn rather than photographed: a card is a rectangle
            with a wordmark on it, and a stock photo would say less. */}
        <div className="mt-12 flex justify-center">
          <div className="bg-foreground flex h-[13.5rem] w-[21rem] max-w-full -rotate-6 flex-col justify-between rounded-2xl p-6 text-left">
            <div className="flex items-start justify-between">
              <span aria-hidden className="bg-sun block h-8 w-11 rounded-lg" />
              <Landmark className="text-on-ink" size={22} strokeWidth={1.6} aria-hidden />
            </div>
            <div className="flex items-end justify-between">
              <span className="display text-paper text-[1.5rem]">clevr</span>
              <span className="text-on-ink font-mono text-[0.75rem] tracking-[0.2em]">
                4417
              </span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mx-auto mt-14 max-w-[19rem] text-[0.9375rem]">
          No annual fee, no interest, no credit check. Pay from the account you
          already have and keep a share of what the shop saves.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button className="w-full px-10">Join the waitlist</Button>
          <ButtonLink href="/" variant="outline" className="w-full px-10">
            <Zap size={16} strokeWidth={2} aria-hidden />
            Open the app
          </ButtonLink>
        </div>

        <p className="text-foreground mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium">
          <Lock size={14} strokeWidth={2} aria-hidden />
          Bank-grade, read-only access
        </p>

        {/* The claims about money, written the way a bank would write them. */}
        <p className="text-muted-foreground mt-10 text-left text-[0.6875rem] leading-relaxed">
          * The CLEVR rewards program is a limited pilot and is still under
          testing. The share you keep is set by each merchant and varies by
          store. The fee a merchant avoids depends on the card, the terminal and
          the acquirer, so 40% describes the highest share available at a
          participating merchant, not a typical result. Figures shown elsewhere
          on this page are examples. Joining the waitlist is not an application.
          CLEVR is not a bank and does not hold deposits.
        </p>
      </section>

      {/* Full-bleed rail. */}
      <section aria-labelledby="explore" className="pt-24 text-center">
        <h2 id="explore" className="display text-foreground text-[2.5rem]">
          Explore
          <br />
          the CLEVR app
        </h2>
        <div className="mt-10">
          <CardRail label="Inside the CLEVR app" slides={SLIDES} />
        </div>
        <p className="text-muted-foreground mx-auto mt-8 max-w-[17rem] text-[0.9375rem]">
          See how much you keep on every purchase.
        </p>
        <ButtonLink href="/insights" variant="outline" className="mt-6 px-10">
          View rewards
        </ButtonLink>
      </section>

      {/* Rows, not cards: a name, a mark, a hairline. */}
      <section aria-labelledby="backers" className="pt-24">
        <h2 id="backers" className="display text-foreground text-center text-[2.5rem]">
          Our investors
          <br />
          &amp; press
        </h2>
        <ul className="mt-10">
          {BACKERS.map((name) => (
            <li
              key={name}
              className="border-border flex min-h-[4.5rem] items-center justify-between border-b py-4"
            >
              <span className="text-foreground text-[0.9375rem] font-medium">{name}</span>
              <span aria-hidden className="display text-foreground text-[1.5rem] opacity-40">
                {name.slice(0, 1)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <div className="bg-foreground flex h-[13rem] items-end rounded-2xl p-6">
            <p className="text-on-ink text-[0.8125rem]">Seed round, March 2026</p>
          </div>
          <p className="display text-foreground mt-6 text-[1.375rem] leading-[1.15]">
            CLEVR raises $7.8M to pay shoppers out of the fee shops already pay
          </p>
          <ButtonLink href="#waitlist" variant="outline" className="mt-6 px-8">
            Read more
          </ButtonLink>
        </div>

        <p className="text-muted-foreground mt-16 text-center text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
          Also featured on
        </p>
        <ul className="mt-6 flex items-center justify-between gap-3">
          {PRESS.map((p) => (
            <li key={p} className="display text-foreground text-[0.8125rem]">
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer. Two columns, hairline on top. */}
      <footer className="border-border mt-24 border-t pt-10">
        <span className="bg-foreground text-sun display flex h-11 w-11 items-center justify-center rounded-full text-[1.25rem]">
          c
        </span>
        <div className="mt-8 grid grid-cols-2 gap-x-4">
          {FOOTER.map((column, i) => (
            <ul key={i}>
              {column.map((item) => (
                <li key={item}>
                  <Link
                    href="#waitlist"
                    className="text-foreground flex min-h-11 items-center text-[0.875rem]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          {["App Store", "Google Play"].map((store) => (
            <ButtonLink
              key={store}
              href="#waitlist"
              variant="outline"
              className="h-11 flex-1 px-4 text-[0.8125rem]"
            >
              {store}
            </ButtonLink>
          ))}
        </div>

        {/* The wordmark as a sign-off band, sized to the column rather than to
            the text: it is a mark, not a link. */}
        <p
          aria-hidden
          className="display text-foreground -mx-5 mt-16 overflow-hidden text-center text-[7rem] leading-none"
        >
          clevr
        </p>
        <p className="text-muted-foreground py-8 text-center text-[0.6875rem]">
          © 2026 CLEVR
        </p>
      </footer>
    </main>
  );
}
