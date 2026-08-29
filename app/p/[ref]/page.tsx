import type { Metadata } from "next";
import { findPayment } from "@/lib/sample";
import { PinFlow } from "./PinFlow";

export const metadata: Metadata = {
  title: "CLEVR: Enter PIN",
};

// Slow-lane rule (TECHNICAL.md §11): everyone renders the pay page. No app,
// no signup — that is the whole point of the slow lane.
export default async function ShopperPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  // Fall back to a stub when ref is unknown — any ref works on sample data.
  const payment = findPayment(ref) ?? {
    ref,
    merchant: "Brew & Co",
    paidCents: 995,
    savedCents: 5,
    day: "Today",
    time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
    settledSeconds: 4,
  };

  return <PinFlow payment={payment} />;
}
