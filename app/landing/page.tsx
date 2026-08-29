import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

        {/* The product illustration: a QR code pay card. */}
        <div className="mt-12 flex justify-center">
          <div className="bg-foreground flex h-[13.5rem] w-[21rem] max-w-full -rotate-6 items-center justify-between rounded-3xl p-6 text-left">
            <div className="flex flex-col justify-between h-full">
              <span aria-hidden className="bg-sun block h-8 w-11 rounded-lg" />
              <div>
                <Image
                  src="/logo.png"
                  alt=""
                  width={1774}
                  height={887}
                  className="h-6 w-auto invert"
                />
                <p className="text-on-ink mt-2 text-[0.8125rem] font-medium font-outfit">
                  Scan to pay
                </p>
              </div>
            </div>
            
            {/* Stylized QR Code Scanner */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-black/40 p-2">
              <span className="border-sun absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" />
              <span className="border-sun absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" />
              <span className="border-sun absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" />
              <span className="border-sun absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" />
              
              <svg viewBox="0 0 120 120" className="h-full w-full text-sun" fill="currentColor">
                <rect x="10" y="10" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="17" y="17" width="16" height="16" rx="1" fill="currentColor" />
                
                <rect x="80" y="10" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="87" y="17" width="16" height="16" rx="1" fill="currentColor" />
                
                <rect x="10" y="80" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="17" y="87" width="16" height="16" rx="1" fill="currentColor" />
                
                <rect x="50" y="15" width="8" height="8" rx="1" />
                <rect x="62" y="15" width="12" height="8" rx="1" />
                <rect x="50" y="27" width="16" height="8" rx="1" />
                <rect x="70" y="27" width="6" height="12" rx="1" />
                <rect x="50" y="39" width="12" height="6" rx="1" />
                
                <rect x="15" y="50" width="8" height="12" rx="1" />
                <rect x="27" y="50" width="16" height="8" rx="1" />
                
                <rect x="85" y="50" width="12" height="8" rx="1" />
                <rect x="101" y="50" width="8" height="16" rx="1" />
                
                <rect x="50" y="65" width="24" height="8" rx="1" />
                <rect x="50" y="77" width="8" height="16" rx="1" />
                <rect x="62" y="77" width="16" height="8" rx="1" />
                
                <rect x="85" y="70" width="8" height="8" rx="1" />
                <rect x="97" y="70" width="12" height="12" rx="1" />
                
                <rect x="85" y="85" width="16" height="8" rx="1" />
                <rect x="85" y="97" width="8" height="12" rx="1" />
                <rect x="97" y="97" width="12" height="8" rx="1" />
              </svg>
            </div>
          </div>
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
