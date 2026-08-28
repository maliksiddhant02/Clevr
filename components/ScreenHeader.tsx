import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ScreenHeader({ title, back }: { title: string; back: string }) {
  return (
    <header className="flex items-center gap-3 py-4">
      <Link
        href={back}
        aria-label="Go back"
        className="border-border bg-card text-foreground hover:border-accent/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:-translate-x-0.5"
      >
        <ChevronLeft size={20} strokeWidth={2} aria-hidden />
      </Link>
      <h1 className="flex-1 text-center text-base font-semibold">{title}</h1>
      {/* Optical spacer so the title centres against the back button. */}
      <span aria-hidden className="h-10 w-10 shrink-0" />
    </header>
  );
}
