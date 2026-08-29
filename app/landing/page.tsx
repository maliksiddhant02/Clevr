import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight01Icon,
  BankIcon,
  FlashIcon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, ButtonLink } from "@/components/Button";
import { CardRail } from "@/components/CardRail";
import { NavSheet } from "@/components/NavSheet";
import { AppleMark, GooglePlayMark } from "@/components/StoreMarks";

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

// Two columns, long one first, exactly as the reference stacks them.
const FOOTER = [
  [
    "CLEVR card",
    "Rewards",
    "Support",
    "How it works",
    "Privacy policy",
    "Terms of service",
    "Card terms",
  ],
  ["Merchants", "Reward terms", "Privacy notice"],
] as const;

const STORES = [
  ["App Store", AppleMark],
  ["Google Play", GooglePlayMark],
] as const;

export default function Landing() {
  return (
    <main>
      <NavSheet />

      {/* Hero, at the reference's measurements: an 11px gutter rather than the
          shell's 20px, a 52px radius, and a height that runs to just short of
          the fold. The headline sits at 36% rather than at the bottom, so the
          block reads as a picture with type on it even while it is still a
          flat Ink ground. Drop a photo in behind the type and nothing else
          about this section has to change. */}
      <section className="bg-foreground -mx-[calc(1.25rem-11px)] flex h-[calc(100dvh-5rem-11px)] min-h-[34rem] flex-col rounded-[52px] px-7 pb-10 text-center">
        {/* The free space is split 52:48 above and below the type rather than
            padded by a percentage: percentage padding resolves against width,
            which puts the headline in a different place on every screen. This
            lands its top at 36% of the block, where the reference has it. */}
        <div aria-hidden className="grow-[52]" />
        <div>
          <h1 className="display text-paper text-[2.78rem]">
            Pay by bank,
            <br />
            keep the fee
          </h1>
          <p className="text-on-ink mt-4 text-[0.9375rem] font-medium">
            Nothing hidden. Your rules.
          </p>
        </div>
        <div aria-hidden className="grow-[48]" />
        <ButtonLink href="#waitlist" variant="paper" className="self-center">
          Join the waitlist
        </ButtonLink>
      </section>

      {/* The way into the product. The landing page sells the card; this row is
          the one place that admits there is a working app behind it. */}
      <Link
        href="/"
        className="border-border text-foreground -mx-5 mt-8 flex min-h-[4.5rem] items-center justify-between gap-4 border-y px-5"
      >
        <span>
          <span className="block text-[1.0625rem] font-bold">
            Open the CLEVR app
          </span>
          <span className="text-muted-foreground block text-[0.875rem]">
            Scan, pay and see what you kept
          </span>
        </span>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={22}
          strokeWidth={2.2}
          aria-hidden
        />
      </Link>

      {/* The claim. Badge, headline, the card, then the two actions. */}
      <section id="waitlist" className="pt-20 text-center">
        <span className="border-foreground text-foreground inline-flex h-7 items-center rounded-full border px-4 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
          New
        </span>
        <h2 className="section-title text-foreground mt-6 text-[2.625rem]">
          Keep up to 40%
          <br />
          of every fee
          <span className="align-super text-[1.25rem]">*</span>
        </h2>

        {/* The product, drawn rather than photographed: a card is a rectangle
            with a wordmark on it, and a stock photo would say less. */}
        <div className="mt-12 flex justify-center">
          <div className="bg-foreground flex h-[13.5rem] w-[21rem] max-w-full -rotate-6 flex-col justify-between rounded-3xl p-6 text-left">
            <div className="flex items-start justify-between">
              <span aria-hidden className="bg-sun block h-8 w-11 rounded-lg" />
              <HugeiconsIcon
                icon={BankIcon}
                className="text-on-ink"
                size={22}
                strokeWidth={1.6}
                aria-hidden
              />
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
          <Button>Join the waitlist</Button>
          <ButtonLink href="/" variant="outline">
            <HugeiconsIcon
              icon={FlashIcon}
              size={18}
              strokeWidth={2}
              aria-hidden
            />
            Open the app
          </ButtonLink>
        </div>

        <p className="text-foreground mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium">
          <HugeiconsIcon
            icon={LockIcon}
            size={14}
            strokeWidth={2}
            aria-hidden
          />
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
        <h2
          id="explore"
          className="section-title text-foreground text-[2.625rem]"
        >
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
        <h2
          id="backers"
          className="section-title text-foreground text-center text-[2.625rem]"
        >
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
              <span className="text-foreground text-[0.9375rem] font-medium">
                {name}
              </span>
              <span
                aria-hidden
                className="display text-foreground text-[1.5rem] opacity-40"
              >
                {name.slice(0, 1)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <div className="bg-foreground flex h-[13rem] items-end rounded-3xl p-6">
            <p className="text-on-ink text-[0.8125rem]">
              Seed round, March 2026
            </p>
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

      {/* The footer is a Paper band: the page's one release from Sun, running
          full bleed to the bottom edge. See DESIGN.md 1. */}
      <footer className="bg-card text-foreground -mx-5 mt-24 px-5 pt-[4.5rem] pb-10">
        {/* The mark on a Sun tile, which is the only Sun left once the ground
            has gone Paper, so it reads as the accent rather than as more page. */}
        <span
          aria-hidden
          className="bg-sun text-foreground display flex h-12 w-12 items-center justify-center rounded-[0.875rem] text-[1.75rem]"
        >
          c
        </span>

        <div className="mt-10 grid grid-cols-2 items-start gap-x-4">
          <ul>
            {FOOTER[0].map((item) => (
              <li key={item}>
                <Link
                  href="#waitlist"
                  className="text-foreground flex min-h-11 items-center text-[1.0625rem] font-semibold"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* The short column carries the store marks, so they land level with
              the last link of the long one rather than starting a new row. */}
          <div className="flex h-full flex-col">
            <ul>
              {FOOTER[1].map((item) => (
                <li key={item}>
                  <Link
                    href="#waitlist"
                    className="text-foreground flex min-h-11 items-center text-[1.0625rem] font-semibold"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex justify-end gap-2 pt-8">
              {STORES.map(([name, Mark]) => (
                <Link
                  key={name}
                  href="#waitlist"
                  aria-label={name}
                  className="text-foreground flex h-11 w-11 items-center justify-center"
                >
                  <Mark size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* The wordmark as a sign-off, sized to the column rather than set at a
            fixed size: it is a mark, not a heading, so it fills the band. */}
        <div className="border-border mt-10 flex justify-center border-t pt-14">
          <Image
            src="/logo.png"
            alt="CLEVR"
            width={1774}
            height={887}
            className="h-[clamp(3.5rem,35vw,8.5rem)] w-auto"
          />
        </div>
        <p className="text-muted-foreground mt-6 text-center text-[0.875rem] font-medium">
          © 2026 CLEVR
        </p>
      </footer>
    </main>
  );
}
