import {
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  BankIcon,
  FlashIcon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

// Native <details> rather than four more routes: these are disclosures, not
// destinations, and a chevron that opens a stub screen is worse than one that
// opens the answer.
const ROWS: {
  icon: IconSvgElement;
  title: string;
  status?: string;
  body: string;
}[] = [
  {
    icon: FlashIcon,
    title: "One-tap payments",
    status: "Not set up",
    body: "Authorise CLEVR once inside your own banking app and every future payment becomes a single tap, at card speed, still with the discount. The authorisation is held by your bank, not by CLEVR. Rolling out after launch.",
  },
  {
    icon: BankIcon,
    title: "How CLEVR works",
    body: "Scan the shop's QR, pay from your own bank account over Australia's instant payment rail, and keep a slice of the card fee the shop just avoided. The money goes straight from you to the shop. It never passes through CLEVR.",
  },
  {
    icon: ArrowReloadHorizontalIcon,
    title: "Refunds",
    body: "A shop pushes a refund back over the same rail, so it lands in seconds rather than the days a card refund takes. There are no chargebacks on this rail, which is part of why shops can afford the discount.",
  },
  {
    icon: LockIcon,
    title: "Your data",
    body: "CLEVR does not sell shopper data, to merchants or to anyone else. Shops only ever see their own sales. Your payment history stays on this device unless you set up an account.",
  },
];

export default function Account() {
  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Account</h1>

      <ul className="border-border mt-8 divide-y divide-[rgb(14_15_12/0.12)] border-y">
        {ROWS.map(({ icon, title, status, body }) => (
          <li key={title}>
            <details className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                >
                  <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
                </span>
                <span className="text-foreground flex-1 text-[0.9375rem] font-semibold">
                  {title}
                </span>
                {status && (
                  <span className="text-foreground bg-card shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium">
                    {status}
                  </span>
                )}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={17}
                  strokeWidth={2}
                  aria-hidden
                  className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90"
                />
              </summary>
              <p className="text-muted-foreground pb-5 text-[0.875rem] leading-relaxed">
                {body}
              </p>
            </details>
          </li>
        ))}
      </ul>

      {/* Full bleed to the bottom edge, tab-bar clearance inside. */}
      <section
        aria-labelledby="money-heading"
        className="bg-muted -mx-5 -mb-28 mt-12 px-5 pt-12 pb-32"
      >
        <h2
          id="money-heading"
          className="display text-foreground text-[2.125rem] leading-[0.9]"
        >
          CLEVR never touches your money.
        </h2>
        <p className="mt-5 text-[0.9375rem] leading-relaxed">
          Payments go straight from your bank account to the shop&rsquo;s. We
          are not a bank, and we never hold your funds.
        </p>
      </section>
    </main>
  );
}
