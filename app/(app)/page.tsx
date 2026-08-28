import Link from "next/link";
import {
  ChartPie,
  QrCode,
  Receipt,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { PaymentRow } from "@/components/PaymentRow";
import { formatAud, splitAud, yearlyRateCents } from "@/lib/money";
import { DAYS_ACTIVE, PAYMENTS, PAYMENT_COUNT, SAVED_CENTS } from "@/lib/sample";

const ACTIONS = [
  { href: "/pay", label: "Pay", Icon: QrCode },
  { href: "/activity", label: "Activity", Icon: Receipt },
  { href: "/insights", label: "Insights", Icon: ChartPie },
  { href: "/account", label: "One-tap", Icon: Zap },
] as const;

export default function Home() {
  const rate = yearlyRateCents(SAVED_CENTS, PAYMENT_COUNT, DAYS_ACTIVE);
  const { whole, fraction } = splitAud(SAVED_CENTS);

  return (
    <main className="stagger flex flex-col gap-6 pt-5 pb-4">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-xl tracking-[-0.01em]">CLEVR</h1>
        <Link
          href="/account"
          aria-label="Account"
          className="border-border bg-card text-muted-foreground hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors duration-200"
        >
          <UserRound size={19} strokeWidth={1.8} aria-hidden />
        </Link>
      </header>

      {/* Balance hero. White surface with a soft accent bloom, per the
          reference — the gradient is atmosphere, never behind text. */}
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="from-accent/25 pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br to-transparent blur-2xl"
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-[0.8125rem] font-medium">
              Total kept
            </p>
            <span className="text-success bg-success/10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-semibold">
              <TrendingUp size={12} strokeWidth={2.5} aria-hidden />
              +8.6%
            </span>
          </div>
          <p className="mt-1 text-[2.75rem] leading-none font-semibold tracking-[-0.03em]">
            {whole}
            <span className="text-muted-foreground text-2xl">.{fraction}</span>
          </p>
          {rate && (
            <p className="text-muted-foreground mt-3 text-[0.8125rem]">
              About{" "}
              <span className="text-foreground font-mono font-medium">
                {formatAud(rate)}
              </span>{" "}
              a year at this pace
            </p>
          )}
        </div>
      </Card>

      <nav aria-label="Quick actions">
        <ul className="grid grid-cols-4 gap-3">
          {ACTIONS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="border-border bg-card hover:border-accent/30 flex flex-col items-center gap-2 rounded-xl border py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden />
                <span className="text-[0.75rem] font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="recent-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="recent-heading" className="text-base font-semibold">
            Recent
          </h2>
          <Link
            href="/activity"
            className="text-accent text-[0.8125rem] font-medium"
          >
            See all
          </Link>
        </div>
        <ul>
          {PAYMENTS.slice(0, 4).map((p) => (
            <PaymentRow key={p.ref} payment={p} />
          ))}
        </ul>
      </section>

      {/* Inverted section: the one moment that deserves the spotlight. */}
      <Card tone="inverted">
        <SectionLabel pulse>The hidden fee</SectionLabel>
        <p className="font-display mt-3 text-[1.375rem] leading-tight">
          Every card tap costs the shop about{" "}
          <span className="text-accent-secondary">1.4%</span>.
        </p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-white/70">
          Nobody has ever shown it to you. Paying from your bank keeps a slice
          of it with you, and the rest with them.
        </p>
      </Card>
    </main>
  );
}
