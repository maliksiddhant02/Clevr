import Link from "next/link";
import { BadgePercent, ChartNoAxesColumn, QrCode, Receipt } from "lucide-react";
import { Card } from "@/components/Card";
import { PaymentRow } from "@/components/PaymentRow";
import { formatAud, yearlyRateCents } from "@/lib/money";
import { DAYS_ACTIVE, PAYMENTS, PAYMENT_COUNT, SAVED_CENTS } from "@/lib/sample";

const ACTIONS = [
  { href: "/pay", label: "Pay", Icon: QrCode },
  { href: "/activity", label: "Activity", Icon: Receipt },
  { href: "/insights", label: "Insights", Icon: ChartNoAxesColumn },
  { href: "/account", label: "One-tap", Icon: BadgePercent },
] as const;

export default function Home() {
  const rate = yearlyRateCents(SAVED_CENTS, PAYMENT_COUNT, DAYS_ACTIVE);

  return (
    <main className="flex flex-col gap-7 py-6">
      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="border-ink flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white text-2xl"
        >
          🙂
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight">Hey there 👋</h1>
          <p className="text-base opacity-70">You pay by bank now.</p>
        </div>
      </header>

      <Card tone="postit" tilt="left" radius={1} decoration="tape">
        <p className="text-lg">You&rsquo;ve earned back</p>
        <p className="font-money mt-1 text-6xl leading-none">
          {formatAud(SAVED_CENTS)}
        </p>
        {rate && (
          <p className="mt-3 text-lg opacity-80">
            about <span className="font-exact">{formatAud(rate)}</span>/year at
            this pace
          </p>
        )}
      </Card>

      <ul className="flex justify-between gap-2">
        {ACTIONS.map(({ href, label, Icon }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="border-ink rounded-wobble-sm shadow-hard-sm flex h-14 w-full items-center justify-center border-2 bg-white transition-all duration-100 hover:-translate-y-[2px] hover:shadow-hard">
                <Icon size={22} strokeWidth={2.5} aria-hidden />
              </span>
              <span className="text-base leading-none">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="recent-heading" className="font-display text-2xl">
            Recent
          </h2>
          <Link href="/activity" className="text-base underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {PAYMENTS.slice(0, 3).map((p) => (
            <PaymentRow key={p.ref} payment={p} />
          ))}
        </ul>
      </section>

      {/* The Discover moment: naming the fee nobody has ever been shown. */}
      <Card tone="ink" radius={2} tilt="right">
        <p className="font-display text-2xl leading-tight">
          Every card tap costs the shop about 1.4%.
        </p>
        <p className="mt-2 text-lg opacity-80">
          You&rsquo;ve never been shown that number. Now you keep a slice of it
          instead.
        </p>
      </Card>
    </main>
  );
}
