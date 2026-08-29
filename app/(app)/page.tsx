import Image from "next/image";
import Link from "next/link";
import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/Card";
import { PaymentRow } from "@/components/PaymentRow";
import { formatAud, splitAud, yearlyRateCents } from "@/lib/money";
import {
  DAYS_ACTIVE,
  PAYMENTS,
  PAYMENT_COUNT,
  SAVED_CENTS,
} from "@/lib/sample";

import { MockDisclaimer } from "@/components/MockDisclaimer";

export default function Home() {
  const rate = yearlyRateCents(SAVED_CENTS, PAYMENT_COUNT, DAYS_ACTIVE);
  const { whole, fraction } = splitAud(SAVED_CENTS);

  return (
    <main className="pt-5 pb-28">
      <MockDisclaimer />
      <header className="flex items-center justify-between">
        {/* The mark is the way back out to the landing page, which is the
            convention everywhere else and the only exit the app otherwise
            does not offer. `-my-2 py-2` gives it a 44px target without
            changing how the header sits. */}
        <Link
          href="/landing"
          aria-label="CLEVR home"
          className="-my-2 -ml-[19px] py-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={1774}
            height={887}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <Link
          href="/account"
          aria-label="Account"
          className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon
            icon={UserCircleIcon}
            size={19}
            strokeWidth={1.8}
            aria-hidden
          />
        </Link>
      </header>

      {/* The number is the screen. No card around it: white space is the frame,
          and a box here would make it one more tile in a stack of tiles. */}
      <section className="pt-12 pb-8">
        <h1 className="text-muted-foreground text-[0.8125rem] font-semibold tracking-[0.12em] uppercase">
          Total kept
        </h1>
        <p className="display text-foreground mt-3 text-[4.5rem] tabular-nums">
          {whole}
          <span className="text-muted-foreground text-[2rem]">.{fraction}</span>
        </p>
        {rate && (
          <p className="text-muted-foreground mt-4 text-[1.0625rem]">
            About{" "}
            <span className="text-foreground font-semibold tabular-nums">
              {formatAud(rate)}
            </span>{" "}
            a year at this pace.
          </p>
        )}
      </section>

      <section aria-labelledby="recent-heading" className="pt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2
            id="recent-heading"
            className="display text-foreground text-[1.5rem]"
          >
            Recent
          </h2>
          <Link
            href="/activity"
            className="text-foreground -my-3.5 py-3.5 text-[0.9375rem] font-medium underline underline-offset-4"
          >
            See all
          </Link>
        </div>
        <Card>
          <ul>
            {PAYMENTS.slice(0, 4).map((p) => (
              <PaymentRow key={p.ref} payment={p} />
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
}
