import { ChevronRight, Landmark, Lock, RotateCcw, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <main className="flex flex-col gap-6 py-6">
      <h1 className="font-display text-4xl">Account</h1>

      <ul className="flex flex-col gap-3">
        {ROWS.map(({ Icon, title, status, body }) => (
          <li key={title}>
            <details className="group border-ink rounded-wobble-sm shadow-paper border-2 bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="border-ink bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
                >
                  <Icon size={20} strokeWidth={2.5} />
                </span>
                <span className="flex-1 text-lg leading-tight">{title}</span>
                {status && (
                  <span className="border-ink rounded-wobble-sm shrink-0 border-2 border-dashed px-2 text-sm opacity-70">
                    {status}
                  </span>
                )}
                <ChevronRight
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden
                  className="shrink-0 opacity-40 transition-transform duration-100 group-open:rotate-90"
                />
              </summary>
              <p className="border-ink mx-3 mb-3 border-t-2 border-dashed pt-3 text-base leading-relaxed opacity-80">
                {body}
              </p>
            </details>
          </li>
        ))}
      </ul>

      {/* The reference's info block, doing real work: this is the sentence the
          whole business rests on. */}
      <div className="flex gap-3 px-1">
        <span aria-hidden className="text-2xl">
          ↗
        </span>
        <p className="text-base leading-relaxed opacity-70">
          <span className="font-display text-lg opacity-100">
            CLEVR never touches your money.
          </span>{" "}
          Payments go straight from your bank account to the shop&rsquo;s. We
          are not a bank, and we never hold your funds.
        </p>
      </div>
    </main>
  );
}
