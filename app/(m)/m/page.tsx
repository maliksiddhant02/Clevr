import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MockDisclaimer } from "@/components/MockDisclaimer";
import { formatAud, splitAud } from "@/lib/money";
import { BIZ_PAYMENTS, BIZ_MERCHANT, localDay } from "@/lib/biz-sample";
import { Card } from "@/components/Card";
import { Keypad } from "@/components/Keypad";
import { ScanRow } from "@/components/ScanRow";

export const metadata: Metadata = {
  title: "CLEVR: Till",
};

export default function TillPage() {
  const settled = BIZ_PAYMENTS.filter((p) => p.status === "settled");
  const today = localDay();
  const todaySettled = settled.filter((p) => p.settledAt?.startsWith(today));
  const todayScans = BIZ_PAYMENTS.filter((p) =>
    p.createdAt.startsWith(today),
  ).length;

  const todayGross = todaySettled.reduce((n, p) => n + p.amountCents, 0);
  const todayDiscount = todaySettled.reduce((n, p) => n + p.discountCents, 0);
  const { whole, fraction } = splitAud(todayGross);

  const recent = settled
    .filter((p) => p.settledAt)
    .sort((a, b) => b.settledAt!.localeCompare(a.settledAt!))
    .slice(0, 4);

  return (
    <main className="pt-5 pb-28">
      <MockDisclaimer />

      {/* The same header the shopper's home carries, pointed at the merchant's
          own account. Two views of one product should not open differently. */}
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="CLEVR home" className="-my-2 -ml-[19px] py-2">
          <Image
            src="/logo.png"
            alt=""
            width={1774}
            height={887}
            priority
            className="h-16 w-auto"
          />
        </Link>
        <Link
          href="/m/account"
          aria-label="Account"
          className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon icon={UserCircleIcon} size={19} strokeWidth={1.8} aria-hidden />
        </Link>
      </header>

      {/* The number is the screen, the same way Total kept is the shopper's.
          No tiles around it: three grey boxes under a hero number is the
          dashboard template, and it says less than one sentence does. */}
      <section className="pt-12 pb-8">
        <h1 className="text-muted-foreground text-[0.8125rem] font-semibold tracking-[0.12em] uppercase">
          Taken today
        </h1>
        <p className="display text-foreground mt-3 text-[4.5rem] tabular-nums">
          {whole}
          <span className="text-muted-foreground text-[2rem]">.{fraction}</span>
        </p>
        <p className="text-muted-foreground mt-4 text-[1.0625rem]">
          {todaySettled.length} of{" "}
          <span className="text-foreground font-semibold tabular-nums">
            {todayScans}
          </span>{" "}
          {todayScans === 1 ? "scan" : "scans"} paid
          {todayDiscount > 0 && (
            <>
              , {formatAud(todayDiscount)} handed back
            </>
          )}
          .
        </p>
      </section>

      <section aria-labelledby="charge-heading" className="pt-12">
        <h2 id="charge-heading" className="display text-foreground text-[1.5rem]">
          Ring it up
        </h2>
        <div className="mt-5">
          <Keypad />
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="pt-12">
          <div className="mb-3 flex items-baseline justify-between">
            <h2
              id="recent-heading"
              className="display text-foreground text-[1.5rem]"
            >
              Recent
            </h2>
            <Link
              href="/m/activity"
              className="text-foreground -my-3.5 py-3.5 text-[0.9375rem] font-medium underline underline-offset-4"
            >
              See all
            </Link>
          </div>
          <Card className="divide-border divide-y py-1">
            {recent.map((p) => (
              <ScanRow key={p.ref} payment={p} />
            ))}
          </Card>
        </section>
      )}

      <p className="text-muted-foreground mt-10 text-[0.8125rem] leading-relaxed">
        Money lands in the {BIZ_MERCHANT.name} account at PayID{" "}
        {BIZ_MERCHANT.payid}. CLEVR never holds it.
      </p>
    </main>
  );
}
