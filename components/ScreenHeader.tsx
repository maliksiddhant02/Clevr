import Link from "next/link";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ScreenHeader({ title, back }: { title: string; back: string }) {
  return (
    <header className="flex items-center gap-3 py-4">
      <Link
        href={back}
        aria-label="Go back"
        className="border-foreground text-foreground hover:bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} aria-hidden />
      </Link>
      <h1 className="text-foreground flex-1 text-center text-base font-semibold">
        {title}
      </h1>
      {/* Optical spacer so the title centres against the back button. */}
      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}
