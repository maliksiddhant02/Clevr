import { ScreenHeader } from "@/components/ScreenHeader";

const STEPS = [
  {
    title: "Point your camera",
    body: "Scan the card on the counter. Your phone's camera is enough, with no app and no signup.",
  },
  {
    title: "Check the amount",
    body: "Your banking app opens with the amount filled in, already lower than the sticker price.",
  },
  {
    title: "Pay",
    body: "The shop's screen confirms the payment before you leave the counter.",
  },
];

export default function Pay() {
  return (
    <main className="pb-12">
      <ScreenHeader title="Pay by bank" back="/" />

      <p className="display text-foreground pt-8 text-[2.75rem] leading-[0.9]">
        Look for the card on the counter.
      </p>
      <p className="text-muted-foreground mt-5 text-[1.0625rem] leading-relaxed">
        You don&rsquo;t need this app open to pay. Everything below happens in
        your own banking app.
      </p>

      <ol className="border-border mt-10 divide-y divide-[rgb(14_15_12/0.12)] border-y">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4 py-5">
            <span
              aria-hidden
              className="bg-muted text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.9375rem] font-semibold tabular-nums"
            >
              {i + 1}
            </span>
            <div className="pt-0.5">
              <p className="text-foreground text-[1.0625rem] font-semibold">
                {step.title}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[0.9375rem] leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* ponytail: no manual code entry yet. It would submit into /p/[ref],
          which doesn't exist. Add the field when the pay page lands. */}
      <p className="text-muted-foreground mt-8 text-[0.9375rem] leading-relaxed">
        Manual code entry is coming. Until then, ask the shop to show the code
        on their screen.
      </p>
    </main>
  );
}
