import { ChevronRight, Landmark, Lock, RotateCcw, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";

// Native <details> rather than four more routes: these are disclosures, not
// destinations, and a chevron that opens a stub screen is worse than one that
// opens the answer.
const ROWS: {
  Icon: LucideIcon;
  title: string;
  status?: string;
  body: string;
}[] = [
  {
    Icon: Zap,
    title: "One-tap payments",
    status: "Not set up",
    body: "Authorise CLEVR once inside your own banking app and every future payment becomes a single tap, at card speed, still with the discount. The authorisation lives at your bank — we never hold it. Rolling out after launch.",
  },
  {
    Icon: Landmark,
    title: "How CLEVR works",
    body: "Scan the shop's QR, pay from your own bank account over Australia's instant payment rail, and keep a slice of the card fee the shop just avoided. The money goes straight from you to them — it never passes through CLEVR.",
  },
  {
    Icon: RotateCcw,
    title: "Refunds",
    body: "A shop pushes a refund back over the same rail, so it lands in seconds rather than the days a card refund takes. There are no chargebacks on this rail, which is part of why shops can afford the discount.",
  },
  {
    Icon: Lock,
    title: "Your data",
    body: "We never sell shopper data — not to merchants, not to anyone. Shops only ever see their own sales. Your payment history stays on this device unless you set up an account.",
  },
];

export default function Account() {
  return (
    <main className="stagger flex flex-col gap-6 pt-6 pb-4">
      <header>
        <h1 className="font-display text-2xl">Account</h1>
        <p className="text-muted-foreground text-[0.8125rem]">
          How this works, and what we do with your data.
        </p>
      </header>

      <ul className="border-border bg-card divide-border divide-y overflow-hidden rounded-2xl border shadow-md">
        {ROWS.map(({ Icon, title, status, body }) => (
          <li key={title}>
            <details className="group">
              <summary className="hover:bg-muted/60 flex min-h-14 cursor-pointer list-none items-center gap-3 p-4 transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="bg-muted text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                >
                  <Icon size={17} strokeWidth={2} />
                </span>
                <span className="flex-1 text-[0.9375rem] font-medium">
                  {title}
                </span>
                {status && (
                  <span className="text-muted-foreground bg-muted shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.6875rem]">
                    {status}
                  </span>
                )}
                <ChevronRight
                  size={17}
                  strokeWidth={2}
                  aria-hidden
                  className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90"
                />
              </summary>
              <p className="text-muted-foreground px-4 pb-4 text-[0.8125rem] leading-relaxed">
                {body}
              </p>
            </details>
          </li>
        ))}
      </ul>

      <div className="border-accent/20 bg-accent/5 rounded-2xl border p-5">
        <SectionLabel>Where your money sits</SectionLabel>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">
          <span className="font-semibold">
            CLEVR never touches your money.
          </span>{" "}
          <span className="text-muted-foreground">
            Payments go straight from your bank account to the shop&rsquo;s. We
            are not a bank, and we never hold your funds.
          </span>
        </p>
      </div>
    </main>
  );
}
