import type { Metadata } from "next";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScannerFrame } from "./ScannerFrame";

export const metadata: Metadata = {
  title: "CLEVR: Scan to pay",
};

export default function Pay() {
  return (
    <main className="pb-12">
      <ScreenHeader title="Scan to pay" back="/" />

      <p className="text-muted-foreground mt-2 text-[0.9375rem]">
        Point your camera at the shop&apos;s QR code.
      </p>

      {/* Camera viewfinder — client component handles camera state */}
      <ScannerFrame />
    </main>
  );
}
