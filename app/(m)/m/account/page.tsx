"use client";

import { useState, useEffect } from "react";
import {
  BankIcon,
  LockIcon,
  PercentIcon,
  QrCodeIcon,
  ReceiptIcon,
  SafeIcon,
} from "@hugeicons/core-free-icons";
import { Disclosure, type DisclosureRow } from "@/components/Disclosure";
import { BIZ_MERCHANT } from "@/lib/biz-sample";
import { getSession, switchRole, signOut, type Session } from "@/lib/session";

const RATE = `${(BIZ_MERCHANT.discountBps / 100).toFixed(2)}%`;

// The questions a shop owner actually asks, in the order they ask them.
const FAQ: DisclosureRow[] = [
  {
    icon: QrCodeIcon,
    title: "How do I take a payment?",
    body: "Type the amount on the Till screen and hold the phone out. The customer scans the code with their camera, pays from their banking app, and this screen confirms before they walk away. No terminal, no card reader, no app for them to install.",
  },
  {
    icon: BankIcon,
    title: "When does the money arrive?",
    body: "Straight away, and straight into your own account. There is no payout run and no settlement window, because the payment never passes through CLEVR. It goes from their bank to yours on Australia's instant rail.",
  },
  {
    icon: PercentIcon,
    title: "What does this cost me?",
    body: `Nothing per sale and nothing per month. A card tap costs about 1.40% of the sale; you avoid that, and you choose how much of it to hand back to the customer. You are set to ${RATE}, so you keep the rest.`,
  },
  {
    icon: ReceiptIcon,
    title: "What if nobody pays?",
    body: "The code expires after ten minutes and the sale never opens. Those show on Activity as abandoned, so a busy morning where four people scanned and two paid is something you can see rather than guess at.",
  },
  {
    icon: SafeIcon,
    title: "What do I see about the customer?",
    body: "A display name, the amount, the reference and the time. That is the whole of it. No account number, no card, no address, and nothing about where else they shop.",
  },
  {
    icon: LockIcon,
    title: "Can other shops see my sales?",
    body: "No. Your takings are yours. We do not sell them, aggregate them into a product, or show them to another merchant.",
  },
];

export default function MerchantAccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <span className="text-foreground text-[1.0625rem] font-semibold">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Account</h1>

      <div className="mt-3 mb-6">
        <form action={switchRole}>
          <button
            type="submit"
            className="bg-foreground text-paper hover:opacity-90 flex h-10 cursor-pointer items-center justify-center rounded-full px-5 text-[0.8125rem] font-bold transition-opacity"
          >
            Switch to customer view
          </button>
        </form>
      </div>

      {/* Shop details as a list of facts, not a tinted box. The rules do the
          dividing here the same way they do on Insights. */}
      <section aria-labelledby="shop">
        <h2
          id="shop"
          className="text-muted-foreground text-[0.8125rem] font-semibold tracking-[0.12em] uppercase"
        >
          Your shop
        </h2>
        <dl className="border-border divide-border mt-3 divide-y border-y">
          {[
            ["Name", BIZ_MERCHANT.name],
            ["PayID", BIZ_MERCHANT.payid],
            ["Handed back to shoppers", RATE],
            ...(session ? [["Signed in as", session.email] as const] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground shrink-0 text-[0.9375rem]">
                {label}
              </dt>
              <dd className="text-foreground min-w-0 truncate text-[0.9375rem] font-semibold">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <h2 className="display text-foreground mt-12 text-[1.5rem]">
        Common questions
      </h2>
      <ul className="border-border divide-border mt-4 divide-y border-y">
        {FAQ.map((row) => (
          <Disclosure key={row.title} {...row} />
        ))}
      </ul>

      <div className="mt-8">
        <form
          action={signOut}
          onSubmit={(e) => {
            if (!confirm("Are you sure you want to sign out?")) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="border-foreground text-foreground hover:bg-muted flex h-16 w-full cursor-pointer items-center justify-center rounded-full border text-[1.0625rem] font-semibold transition-colors duration-200"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
