import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";

const STEPS = [
  "Point your phone camera at the shop's QR code. No app, no signup.",
  "Your own banking app opens. Check the amount — it's already lower than the sticker price.",
  "Pay. The shop's screen ticks green while you're still standing there.",
];

export default function Pay() {
  return (
    <main className="flex flex-col gap-6 pb-10">
      <ScreenHeader title="Pay by bank" back="/" />

      <Card tone="postit" radius={2} tilt="right" decoration="tack">
        <p className="font-display text-2xl leading-tight">
          Look for the CLEVR card on the counter.
        </p>
        <p className="mt-2 text-lg opacity-80">
          Any camera works. You don&rsquo;t need this app open to pay.
        </p>
      </Card>

      <ol className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span
              aria-hidden
              className="border-ink font-money rounded-wobble-sm shadow-hard-sm flex h-11 w-11 shrink-0 items-center justify-center border-2 bg-white text-xl"
            >
              {i + 1}
            </span>
            <p className="pt-1 text-lg leading-snug">{step}</p>
          </li>
        ))}
      </ol>

      {/* ponytail: no manual code entry yet — it would submit into /p/[ref],
          which doesn't exist. Add the field when the pay page lands. */}
      <p className="border-ink rounded-wobble-sm border-2 border-dashed p-4 text-base leading-relaxed opacity-70">
        Camera not cooperating? Typing the shop&rsquo;s code by hand is coming —
        for now, the shop can show the code on their screen.
      </p>
    </main>
  );
}
