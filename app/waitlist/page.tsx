import type { Metadata } from "next";
import Image from "next/image";
import { WaitlistPanel } from "@/components/WaitlistPanel";

export const metadata: Metadata = {
  title: "Join the CLEVR waitlist",
  description: "One field, one tap. We'll email you when CLEVR opens.",
};

// Dedicated landing for the QR: the form is the whole screen. No header nav,
// no scroll, no modal to open — server-rendered so it's visible on first paint.
export default function WaitlistPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 py-10">
      <Image
        src="/logo.png"
        alt="CLEVR"
        width={1774}
        height={887}
        priority
        sizes="180px"
        className="h-16 w-auto"
      />
      <WaitlistPanel />
    </main>
  );
}
