import {
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  BankIcon,
  FlashIcon,
  LockIcon,
  PercentIcon,
  QrCodeIcon,
  SafeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { getSession, signOut, switchRole } from "@/lib/session";

// Native <details> rather than more routes: these are disclosures, not
// destinations, and a chevron that opens a stub screen is worse than one that
// opens the answer.
type Row = {
  icon: IconSvgElement;
  title: string;
  status?: string;
  body: string;
};

const SETTING: Row = {
  icon: FlashIcon,
  title: "One-tap payments",
  status: "Not set up",
  body: "Authorise CLEVR once in your banking app and every payment after that is a single tap. Your bank holds the authorisation, not us. Coming after launch.",
};

const FAQ: Row[] = [
  {
    icon: QrCodeIcon,
    title: "How do I pay?",
    body: "Find the QR code at the counter and scan it with your phone's camera — no app and no signup needed. Your banking app opens with the amount already filled in. Once you pay, the shop's screen confirms before you leave.",
  },
  {
    icon: BankIcon,
    title: "How does it work?",
    body: "Scan the shop's QR and pay from your bank. The shop avoids the card fee and hands part of it back to you. Your money goes straight to the shop, never through us.",
  },
  {
    icon: PercentIcon,
    title: "What does a card tap cost the shop?",
    body: "About 1.4% of the sale. Paying from your bank avoids that fee, so the shop keeps most of it and hands you the rest at the till.",
  },
  {
    icon: ArrowReloadHorizontalIcon,
    title: "How do refunds work?",
    body: "Refunds come back the same way, in seconds rather than the days a card takes. There are no chargebacks, which is part of why shops can afford the discount.",
  },
  {
    icon: SafeIcon,
    title: "Does CLEVR hold my money?",
    body: "No. Payments go straight from your account to the shop's. We are not a bank and we never hold your funds.",
  },
  {
    icon: LockIcon,
    title: "What happens to my data?",
    body: "We do not sell it, to shops or to anyone. Shops see only their own sales. Your history stays on this device until you make an account.",
  },
];

function Disclosure({ icon, title, status, body }: Row) {
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          >
            <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
          </span>
          <span className="text-foreground flex-1 text-[1.0625rem] font-semibold">
            {title}
          </span>
          {status && (
            <span className="text-foreground bg-card shrink-0 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium">
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
        <p className="text-muted-foreground pb-5 text-[0.9375rem] leading-relaxed">
          {body}
        </p>
      </details>
    </li>
  );
}

export default async function Account() {
  const session = await getSession();

  return (
    <main className="pt-6 pb-28">
      <h1 className="display text-foreground text-[3.5rem]">Account</h1>

      {/* Session info */}
      {session && (
        <div className="mt-6 rounded-2xl bg-foreground/6 px-4 py-4">
          <p className="text-foreground font-semibold">{session.name}</p>
          <p className="text-muted-foreground mt-0.5 text-[0.875rem]">{session.email}</p>
        </div>
      )}

      <ul className="border-border mt-8 divide-y divide-[rgb(0_0_0/0.16)] border-y">
        <Disclosure {...SETTING} />
      </ul>

      {/* Session actions */}
      <div className="mt-6 flex flex-col gap-3">
        <form action={switchRole}>
          <button
            type="submit"
            className="bg-foreground/8 text-foreground flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-medium"
          >
            Switch to business view
          </button>
        </form>
        {session && (
          <form action={signOut}>
            <button
              type="submit"
              className="border-border text-foreground flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-medium"
            >
              Sign out
            </button>
          </form>
        )}
      </div>

      <h2 className="display text-foreground mt-12 text-[1.5rem]">
        Common questions
      </h2>
      <ul className="border-border mt-4 divide-y divide-[rgb(0_0_0/0.16)] border-y">
        {FAQ.map((row) => (
          <Disclosure key={row.title} {...row} />
        ))}
      </ul>
    </main>
  );
}
