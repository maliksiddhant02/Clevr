import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ScreenHeader({ title, back }: { title: string; back: string }) {
  return (
    <header className="flex items-center gap-3 py-5">
      <Link
        href={back}
        aria-label="Go back"
        className="border-ink rounded-wobble-sm shadow-hard-sm flex h-11 w-11 shrink-0 items-center justify-center border-2 bg-white transition-all duration-100 hover:-translate-x-[2px] hover:shadow-none"
      >
        <ArrowLeft size={20} strokeWidth={2.5} aria-hidden />
      </Link>
      <h1 className="font-display flex-1 text-center text-2xl">{title}</h1>
      {/* Spacer keeps the title optically centred against the back button. */}
      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}
