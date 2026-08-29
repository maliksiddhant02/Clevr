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

export default function Pay() {
  return (
    // Reverted back to bg-foreground (black) and text-paper (white).
    <main className="bg-foreground text-paper -mx-5 flex min-h-dvh flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-4 pt-4 pb-2">
        <Link
          href="/"
          aria-label="Close"
          className="border-paper/25 text-paper [--focus-ring:var(--color-paper)] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border hover:bg-white/10 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <div>
          {/* Made the header text bright white and clear so it is not dark */}
          <h1 className="text-white text-[1.25rem] font-bold leading-tight">
            Scan to pay
          </h1>
          <p className="text-white/70 mt-0.5 text-[0.8125rem]">
            Any CLEVR shop code
          </p>
        </div>
      </header>

      <ScannerFrame />

      {/* Reverted back to using invert class on logo for black background */}
      <Link href="/landing" className="mx-auto mt-10 block">
        <Image
          src="/logo.png"
          alt="CLEVR"
          width={1774}
          height={887}
          sizes="128px"
          className="h-5 w-auto opacity-35 invert cursor-pointer"
        />
      </Link>

      <MvpDialog />
    </main>
  );
}
