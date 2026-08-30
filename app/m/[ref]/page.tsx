import type { Metadata } from "next";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MerchantPoller } from "@/components/MerchantPoller";
import { QrCode } from "@/components/QrCode";

export const metadata: Metadata = {
  title: "CLEVR: Scan to pay",
};

export default async function MerchantWaitPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <main className="flex min-h-dvh flex-col">
      <ScreenHeader title="Scan to pay" back="/m" />

      {/* The QR is drawn on the server and handed down as a child: `qrcode`
          is a Node-side library and bundling it for the browser would ship
          20KB to render one static mark. The poller only positions it. */}
      <MerchantPoller paymentRef={ref}>
        <QrCode url={`${base}/p/${ref}`} className="text-foreground w-full" />
      </MerchantPoller>
    </main>
  );
}
