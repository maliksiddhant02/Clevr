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
    // Changed bg-foreground to bg-background (Sun yellow) and text-paper to text-foreground (Ink black).
    <main className="bg-background text-foreground -mx-5 flex min-h-dvh flex-col justify-between">
      {/* Pinned top header: relative z-20 to sit above the camera dark overlay mask */}
      <header className="relative z-20 bg-background border-b border-border flex items-center gap-4 pt-4 pb-3 px-5">
        <Link
          href="/"
          aria-label="Close"
          className="border-foreground/15 text-foreground hover:bg-foreground/5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} aria-hidden />
        </Link>
        <div>
          <h1 className="text-foreground text-[1.25rem] font-bold leading-tight">
            Scan to pay
          </h1>
          <p className="text-muted-foreground mt-0.5 text-[0.8125rem]">
            Any CLEVR shop code
          </p>
        </div>
      </header>

      {/* Camera and Aim framing in the middle */}
      <ScannerFrame />

      {/* Pinned bottom footer: relative z-20 to sit above the dark overlay mask */}
      <footer className="relative z-20 bg-background pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-5">
        <Link href="/landing" className="mx-auto block text-center">
          {/* Removed invert class so the logo draws as black on the yellow ground */}
          <Image
            src="/logo.png"
            alt="CLEVR"
            width={1774}
            height={887}
            sizes="128px"
            className="mx-auto h-5 w-auto opacity-35 cursor-pointer"
          />
        </Link>
      </footer>

      <MvpDialog />
    </main>
  );
}
