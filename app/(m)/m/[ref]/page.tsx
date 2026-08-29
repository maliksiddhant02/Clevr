import type { Metadata } from "next";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MerchantPoller } from "@/components/MerchantPoller";
import { STORE } from "@/app/api/payments/route";
import { formatAud } from "@/lib/money";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "CLEVR: Waiting for payment",
};

export default async function MerchantWaitPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  // Check the in-process store — if the ref was just created, it's there.
  // On a cold load (page refresh) the store is empty; we still render with
  // sample data so the UI is always coherent.
  const payment = STORE.get(ref);

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const url = `${base}/p/${ref}`;
  let qrSvg = "";
  try {
    const QRCode = await import("qrcode");
    qrSvg = await QRCode.toString(url, {
      type: "svg",
      width: 220,
      margin: 0,
    });
  } catch {
    qrSvg = `<svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="220" rx="12" fill="#f0f0f0"/>
      <text x="110" y="115" text-anchor="middle" font-size="14" fill="#999">QR unavailable</text>
    </svg>`;
  }

  const amountStr = payment ? formatAud(payment.shopperPaysCents) : "–";

  return (
    <main className="flex min-h-dvh flex-col">
      <ScreenHeader title={amountStr} back="/m" />

      <div className="-mx-5 flex flex-1 flex-col px-5 pt-6">
        <MerchantPoller ref={ref} qrSvg={qrSvg} />
      </div>
    </main>
  );
}
