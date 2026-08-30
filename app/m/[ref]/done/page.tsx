"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Cancel01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@/components/Avatar";
import { SuccessBurst } from "@/components/SuccessBurst";
import { BIZ_MERCHANT } from "@/lib/biz-sample";
import { cardFeeCents, formatAud, splitAud } from "@/lib/money";

type Receipt = {
  status: string;
  amountCents: number;
  shopperPaysCents: number;
  payerName?: string;
  settledAt?: string;
};

/**
 * The merchant's half of the receipt.
 *
 * It answers the two questions a shop actually has at the counter — did it
 * land, and how much of it is mine — and then says plainly what it knows
 * about the person who paid, because "what does the shop see about me" is the
 * question every shopper asks and no payments screen ever answers.
 */
export default function MerchantDonePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [data, setData] = useState<Receipt | null>(null);

  useEffect(() => {
    fetch(`/api/payments/${ref}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [ref]);

  // The store is in-process, so a refresh after a restart has nothing to show.
  // The amount falls back to a dash rather than to a plausible invention.
  const received = data?.shopperPaysCents;
  const given = data ? data.amountCents - data.shopperPaysCents : 0;
  const { whole, fraction } = splitAud(received ?? 0);
  const settledAt = data?.settledAt ? new Date(data.settledAt) : null;

  const shared = [
    ["Paid by", data?.payerName ?? "—"],
    ["Reference", ref],
    [
      "Received",
      settledAt
        ? settledAt.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
    ],
  ] as const;

  return (
    <main className="flex min-h-dvh flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
      <SuccessBurst phase="cover" label="Payment received" />

      <header className="flex items-center gap-3">
        <Link
          href="/m"
          aria-label="Close and go back to the till"
          className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <h1 className="text-foreground flex-1 text-center text-[1.0625rem] font-semibold">
          Payment received
        </h1>
        <span aria-hidden className="h-11 w-11 shrink-0" />
      </header>

      <section className="pt-12 text-center">
        <p className="display text-foreground text-[4rem] tabular-nums">
          {received == null ? "—" : whole}
          {received != null && (
            <span className="text-muted-foreground text-[1.75rem]">
              .{fraction}
            </span>
          )}
        </p>
        <p className="text-muted-foreground mt-3 text-[1.0625rem]">
          in your {BIZ_MERCHANT.name} account
        </p>
        <p className="text-success mt-1.5 text-[1.0625rem] font-semibold tabular-nums">
          {formatAud(cardFeeCents(data?.amountCents ?? 0))} of card fee avoided
        </p>
      </section>

      {/* What the shop is shown, and the sentence that says it is all of it.
          A shop reading this screen out loud to a curious customer should not
          have to add a disclaimer of their own. */}
      <section aria-labelledby="shared" className="pt-12">
        <div className="flex items-center gap-3">
          <Avatar name={data?.payerName ?? "CLEVR"} size="lg" />
          <div>
            <h2 id="shared" className="text-foreground text-[1.0625rem] font-semibold">
              {data?.payerName ?? "Shopper"}
            </h2>
            <p className="text-muted-foreground text-[0.9375rem]">
              paid from their bank
            </p>
          </div>
        </div>

        <dl className="border-border divide-border mt-6 divide-y border-y">
          {shared.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-4">
              <dt className="text-muted-foreground text-[0.9375rem]">{label}</dt>
              <dd
                className={`text-foreground text-[0.9375rem] font-semibold ${
                  label === "Reference" ? "font-mono tracking-[0.04em]" : "tabular-nums"
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-4">
            <dt className="text-muted-foreground text-[0.9375rem]">
              Given back to them
            </dt>
            <dd className="text-success text-[0.9375rem] font-semibold tabular-nums">
              −{formatAud(given)}
            </dd>
          </div>
        </dl>

        <p className="text-muted-foreground mt-5 flex gap-2.5 text-[0.8125rem] leading-relaxed">
          <HugeiconsIcon
            icon={LockIcon}
            size={16}
            strokeWidth={2}
            aria-hidden
            className="mt-0.5 shrink-0"
          />
          A display name, the amount, the reference and the time. That is
          everything CLEVR shares with you: no account number, no card, no
          address, and nothing about where else they shop.
        </p>
      </section>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <Link
          href="/m"
          className="bg-foreground text-paper flex h-16 w-full items-center justify-center rounded-full text-[1.0625rem] font-semibold hover:opacity-90"
        >
          New charge
        </Link>
        <Link
          href="/m/activity"
          className="border-foreground text-foreground hover:bg-muted flex h-16 w-full items-center justify-center rounded-full border text-[1.0625rem] font-semibold transition-colors duration-200"
        >
          See today&rsquo;s activity
        </Link>
      </div>
    </main>
  );
}
