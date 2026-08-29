import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MvpDialog } from "@/components/Mvp";
import { ScannerFrame } from "./ScannerFrame";

export const metadata: Metadata = {
  title: "CLEVR: Scan to pay",
};

// The one screen in the app that is Ink end to end. That is not a borrowed
// dark theme: a viewfinder is a dark surface everywhere because the subject is
// what the camera sees, and this system already has the move for it. Ink
// ground, Paper type, one Sun accent, which here is the aim itself.
//
// It sits outside the tab group, so it opens over the app with a close mark
// rather than a back arrow: scanning is a thing you finish or abandon.
export default function Pay() {
  return (
    <main className="bg-foreground text-paper -mx-5 flex min-h-dvh flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-4 pt-4 pb-2">
        <Link
          href="/"
          aria-label="Close"
          className="border-paper/25 text-paper [--focus-ring:var(--color-paper)] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <div>
          <h1 className="text-paper text-[1.25rem] font-bold leading-tight">
            Scan to pay
          </h1>
          <p className="text-on-ink mt-0.5 text-[0.8125rem]">
            Any CLEVR shop code
          </p>
        </div>
      </header>

      <ScannerFrame />

      {/* The mark closes the screen the way it closes the landing page. It
          carries `invert` because this is an Ink ground. */}
      <Image
        src="/logo.png"
        alt=""
        aria-hidden
        width={1774}
        height={887}
        sizes="128px"
        className="mx-auto mt-10 h-5 w-auto opacity-35 invert"
      />

      <MvpDialog />
    </main>
  );
}
