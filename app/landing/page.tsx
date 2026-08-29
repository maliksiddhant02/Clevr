import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppleMark, GooglePlayMark } from "@/components/StoreMarks";
import { Button, ButtonLink } from "@/components/Button";
import { CardRail } from "@/components/CardRail";
import { NavSheet } from "@/components/NavSheet";

export const metadata: Metadata = {
  title: "CLEVR — Pay by bank, pay less",
  description:
    "Pay a shop straight from your bank and keep a share of the card fee the shop just avoided.",
};

const SLIDES = [
  { title: "Track your spend", note: "Every payment, every fee" },
  { title: "See what you kept", note: "Down to the cent" },
  { title: "Pay in two taps", note: "Scan, confirm, done" },
] as const;

// Two columns, long one first, exactly as the reference stacks them.
const FOOTER = [
  [
    "CLEVR card",
    "Support",
    "How it works",
    "Privacy policy",
    "Terms of service",
    "Card terms",
  ],
  ["Merchants", "Privacy notice"],
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

        {/* Floating QR code — Ink on Sun, slightly rotated. */}
        <div className="mt-12 flex justify-center">
          <svg
            viewBox="0 0 120 120"
            className="qr-float h-48 w-48 text-foreground"
            fill="currentColor"
            aria-hidden
          >
            {/* Top-left finder */}
            <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="16" y="16" width="16" height="16" rx="2" />
            {/* Top-right finder */}
            <rect x="80" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="88" y="16" width="16" height="16" rx="2" />
            {/* Bottom-left finder */}
            <rect x="8" y="80" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="16" y="88" width="16" height="16" rx="2" />
            {/* Data modules */}
            <rect x="48" y="10" width="7" height="7" rx="1" />
            <rect x="58" y="10" width="10" height="7" rx="1" />
            <rect x="48" y="20" width="14" height="7" rx="1" />
            <rect x="65" y="20" width="5" height="10" rx="1" />
            <rect x="48" y="31" width="10" height="5" rx="1" />
            <rect x="10" y="48" width="7" height="10" rx="1" />
            <rect x="21" y="48" width="14" height="7" rx="1" />
            <rect x="48" y="48" width="10" height="7" rx="1" />
            <rect x="61" y="48" width="7" height="7" rx="1" />
            <rect x="71" y="48" width="10" height="14" rx="1" />
            <rect x="85" y="48" width="7" height="10" rx="1" />
            <rect x="95" y="48" width="10" height="7" rx="1" />
            <rect x="48" y="61" width="20" height="7" rx="1" />
            <rect x="48" y="71" width="7" height="14" rx="1" />
            <rect x="58" y="71" width="14" height="7" rx="1" />
            <rect x="85" y="61" width="7" height="7" rx="1" />
            <rect x="95" y="61" width="10" height="10" rx="1" />
            <rect x="85" y="75" width="14" height="7" rx="1" />
            <rect x="85" y="85" width="7" height="10" rx="1" />
            <rect x="95" y="85" width="10" height="7" rx="1" />
            <rect x="71" y="61" width="7" height="28" rx="1" />
          </svg>
        </div>

        <p className="text-foreground mx-auto mt-14 max-w-[19rem] text-[0.9375rem] font-bold">
          No annual fee, no interest, no credit check. Pay from the account you
          already have and keep a share of what the shop saves.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button className="w-64 font-outfit">Join the waitlist</Button>
          <ButtonLink
            href="https://apps.apple.com/us/app/coverd-win-purchases-back/id6741347396"
            variant="outline"
            className="w-64 font-outfit"
            target="_blank"
            rel="noopener"
          >
            <AppleMark size={20} />
            Get the App
          </ButtonLink>
        </div>



        {/* The claims about money, written the way a bank would write them. */}
        <p className="text-muted-foreground mt-10 text-left text-[0.6875rem] leading-relaxed">
          * Joining the waitlist is not an application.
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
        <p className="text-foreground mx-auto mt-8 max-w-[17rem] text-[0.9375rem] font-bold">
          See how much you keep on every purchase.
        </p>
      </section>



      {/* The footer is a Paper band: the page's one release from Sun, running
          full bleed to the bottom edge. See DESIGN.md 1. */}
      <footer className="bg-card text-foreground -mx-5 mt-24 px-5 pt-[4.5rem] pb-10">
        {/* The mark on a Sun tile, which is the only Sun left once the ground
            has gone Paper, so it reads as the accent rather than as more page. */}
        {/* The app icon itself: a Sun tile carrying the mark, which is the
            only Sun left once the ground has gone Paper. */}
        <Image
          src="/icon.png"
          alt=""
          width={1254}
          height={1254}
          className="h-12 w-12 rounded-[0.875rem]"
        />

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
