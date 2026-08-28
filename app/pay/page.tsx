import { ScanLine } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";

const STEPS = [
  {
    title: "Point your camera",
    body: "Find the CLEVR card on the counter and scan it. No app, no signup — your normal camera is enough.",
  },
  {
    title: "Check the amount",
    body: "Your own banking app opens with the amount already filled in, and it's lower than the sticker price.",
  },
  {
    title: "Pay",
    body: "The shop's screen confirms while you're still standing there. Money moves bank to bank in seconds.",
  },
];

export default function Pay() {
  return (
    <main className="stagger flex flex-col gap-5 pb-10">
      <ScreenHeader title="Pay by bank" back="/" />

      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="from-accent/25 pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-gradient-to-br to-transparent blur-2xl"
        />
        <div className="relative flex items-center gap-4">
          <span
            aria-hidden
            className="from-accent to-accent-secondary shadow-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white"
          >
            <ScanLine size={22} strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-lg leading-tight">
              Look for the card on the counter
            </p>
            <p className="text-muted-foreground mt-0.5 text-[0.8125rem]">
              You don&rsquo;t need this app open to pay.
            </p>
          </div>
        </div>
      </Card>

      <section aria-labelledby="steps-heading">
        <div className="mb-3">
          <SectionLabel>Three steps</SectionLabel>
        </div>
        <h2 id="steps-heading" className="sr-only">
          How to pay
        </h2>
        <ol className="border-border bg-card divide-border divide-y rounded-2xl border shadow-md">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3 p-4">
              <span
                aria-hidden
                className="bg-muted text-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.75rem] font-medium"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium">{step.title}</p>
                <p className="text-muted-foreground mt-0.5 text-[0.8125rem] leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ponytail: no manual code entry yet — it would submit into /p/[ref],
          which doesn't exist. Add the field when the pay page lands. */}
      <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-4 text-[0.8125rem] leading-relaxed">
        Camera not cooperating? Typing the shop&rsquo;s code by hand is coming —
        for now, the shop can show the code on their screen.
      </p>
    </main>
  );
}
