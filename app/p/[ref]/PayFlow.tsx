"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HoldToPay } from "@/components/HoldToPay";

// Client component: polls /api/payments/[ref] and navigates to /done on settle.
// Also renders the HoldToPay control which simulates the payment confirmation.
export function PayFlow({ ref }: { ref: string }) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  // Mock confirmation: mark payment as "paid" client-side then poll.
  async function handleConfirm() {
    setConfirmed(true);
    // Fire a POST to simulate the shopper confirming — mock rail handles settle.
    try {
      await fetch(`/api/payments/${ref}/confirm`, { method: "POST" });
    } catch {
      // best-effort; the poll will catch the settled status anyway
    }
  }

  // Poll every 1.5s while not yet confirmed.
  useEffect(() => {
    if (!confirmed) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/${ref}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "settled") {
          clearInterval(id);
          router.push(`/p/${ref}/done`);
        }
      } catch {
        // network error — keep polling
      }
    }, 1500);
    return () => clearInterval(id);
  }, [confirmed, ref, router]);

  return (
    <HoldToPay
      onConfirm={handleConfirm}
      label="Hold to pay"
      disabled={confirmed}
    />
  );
}
