import type { Metadata } from "next";
import Image from "next/image";
import { AppleMark, GooglePlayMark } from "@/components/StoreMarks";
import { ButtonLink } from "@/components/Button";
import { CardRail } from "@/components/CardRail";
import { MvpButton, MvpDialog } from "@/components/Mvp";
import { NavSheet } from "@/components/NavSheet";
import { HeroCopy } from "@/components/HeroCopy";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "CLEVR: Pay by bank, pay less",
  description:
    "Pay a shop straight from your bank and keep a share of the card fee the shop just avoided.",
};

const SLIDES = [
  {
    title: "Track your spend",
    note: "Every payment, every fee",
    photo: "/photos/shopping.jpg",
  },
  {
    title: "See what you kept",
    note: "Every fee, every payment, itemised",
    photo: "/photos/coffee.jpg",
  },
  {
    title: "Pay in two taps",
    note: "Scan the code, confirm in your bank app",
    photo: "/photos/petrol.jpg",
  },
] as const;

const FOOTER = [
  ["Support", "How it works", "Merchants"],
  ["Privacy policy", "Privacy notice", "Terms of service"],
] as const;

// Three things a shop owner asks in the first minute, answered in the order
// they ask them. Not features: the objections.
const BUSINESS_FACTS = [
  ["No terminal", "A printed code on the counter, or the amount typed into a phone."],
  ["No lock-in", "No monthly fee, no contract, no minimum turnover."],
  ["Same day", "Money lands in your bank account, not in a processor's."],
] as const;

const STORES = [
  ["App Store", AppleMark],
  ["Google Play", GooglePlayMark],
] as const;

export default function Landing() {
  return (
    <main>
      <NavSheet />

      {/* Hero */}
      <section className="bg-foreground relative -mx-[calc(1.25rem-11px)] flex h-[calc(100svh-5rem-11px)] min-h-[34rem] flex-col overflow-hidden rounded-[52px] px-7 pb-10 text-center">
        <Image
          src="/photos/hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover"
        />
        <span aria-hidden className="bg-foreground/55 absolute inset-0" />
        <div aria-hidden className="relative grow-[52]" />
        <div className="relative">
          <HeroCopy />
        </div>
        <div aria-hidden className="relative grow-[48]" />
        <ButtonLink href="#waitlist" variant="paper" className="relative self-center">
          Get CLEVR
        </ButtonLink>
      </section>

      {/* The claim */}
      <section id="waitlist" className="pt-20 text-center">
        <span className="border-foreground text-foreground inline-flex h-7 items-center rounded-full border px-4 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase">
          New
        </span>
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

        <p className="text-foreground mx-auto mt-14 max-w-[21rem] text-[1.0625rem] font-bold">
          No annual fee, no interest, no credit check. Pay from the account
          you already have.
        </p>

        {/* One pill. "Get the App" sat under this one making the same promise
            at the same size, and two 64px pills in a column is a stack, not a
            hierarchy. The store marks still live in the nav sheet and the
            footer, which is where a reader looks for them. */}
        <div className="mt-8 flex justify-center">
          <WaitlistForm />
        </div>

        <p className="text-muted-foreground mt-10 text-left text-[0.8125rem] leading-relaxed">
          Joining the waitlist is not an application.
          CLEVR is not a bank and does not hold deposits.
        </p>
      </section>

      {/* Explore */}
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
        <p className="text-foreground mx-auto mt-8 max-w-[19rem] text-[1.0625rem] font-bold">
          Every payment shows exactly what you kept and where.
        </p>
      </section>

      {/* For business — the Ink band.

          The other half of this market is the shop, and until now the page did
          not say a word to it. That is what earns the band: not composition
          looking for content, but a reader the page owes an answer. It is the
          system's own emphasis device, Paper type on Ink with one Sun mark,
          and it puts the second ask somewhere it cannot be mistaken for a
          second version of the first.

          It takes the hero's inset rather than full bleed: a 40px corner needs
          a gutter to read as a corner, and this band answers the hero. */}
      <section
        aria-labelledby="business"
        className="bg-foreground text-paper -mx-[calc(1.25rem-11px)] mt-24 rounded-[40px] px-7 pt-16 pb-14"
      >
        <h2 id="business" className="section-title text-paper text-[2.625rem]">
          Stop paying
          <br />
          to get paid
        </h2>
        <p className="text-on-ink mt-6 text-[1.0625rem] leading-relaxed">
          Card fees take about{" "}
          <span className="text-sun font-bold tabular-nums">1.4%</span> of every
          sale before you see it. CLEVR settles to your bank, and you decide how
          much of what you save goes back to the shopper.
        </p>

        <dl className="border-paper/20 divide-paper/20 mt-10 divide-y border-y">
          {BUSINESS_FACTS.map(([term, detail]) => (
            <div key={term} className="flex items-baseline gap-4 py-4">
              <dt className="text-paper w-28 shrink-0 text-[1.0625rem] font-bold">
                {term}
              </dt>
              <dd className="text-on-ink text-[0.9375rem] leading-relaxed">
                {detail}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex justify-center">
          <WaitlistForm audience="business" variant="paper" className="w-full max-w-72" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground -mx-5 mt-24 px-5 pt-[4.5rem] pb-10">
        <Image
          src="/icon.png"
          alt=""
          width={1254}
          height={1254}
          sizes="48px"
          className="h-12 w-12 rounded-[0.875rem]"
        />

        <div className="mt-10 grid grid-cols-2 items-start gap-x-4">
          <ul>
            {FOOTER[0].map((item) => (
              <li key={item}>
                <MvpButton
                  className="text-foreground flex min-h-11 items-center text-[1.0625rem] font-semibold"
                >
                  {item}
                </MvpButton>
              </li>
            ))}
          </ul>

          <div className="flex h-full flex-col">
            <ul>
              {FOOTER[1].map((item) => (
                <li key={item}>
                  <MvpButton
                    className="text-foreground flex min-h-11 items-center text-[1.0625rem] font-semibold"
                  >
                    {item}
                  </MvpButton>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex justify-end gap-2 pt-8">
              {STORES.map(([name, Mark]) => (
                <MvpButton
                  key={name}
                  aria-label={name}
                  className="text-foreground flex h-11 w-11 items-center justify-center"
                >
                  <Mark size={24} />
                </MvpButton>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border mt-10 flex justify-center border-t pt-14">
          <Image
            src="/logo.png"
            alt=""
            aria-hidden
            width={1774}
            height={887}
            sizes="(max-width: 430px) 70vw, 272px"
            className="h-[clamp(3.5rem,35vw,8.5rem)] w-auto"
          />
        </div>
        <p className="text-muted-foreground mt-6 text-center text-[0.9375rem] font-medium">
          © 2026 CLEVR
        </p>
      </footer>

      <MvpDialog />
    </main>
  );
}
