"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatAud, shopperPays } from "@/lib/money";
import { BIZ_MERCHANT } from "@/lib/biz-sample";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"] as const;

export function Keypad() {
  const router = useRouter();
  const [raw, setRaw] = useState(""); // what the user typed, e.g. "9.95"
  const [loading, setLoading] = useState(false);

  function handleKey(k: string) {
    if (k === "⌫") {
      setRaw((s) => s.slice(0, -1));
      return;
    }
    // Only one decimal point
    if (k === "." && raw.includes(".")) return;
    // Max 2 decimal places
    const dot = raw.indexOf(".");
    if (dot >= 0 && raw.length - dot > 2) return;
    // Max $9,999.99 — the till rings up televisions, not just coffees.
    if (raw.length > 7) return;
    setRaw((s) => s + k);
  }

  function toCents(s: string): number | null {
    const n = parseFloat(s);
    if (isNaN(n) || n <= 0 || n > 9999.99) return null;
    return Math.round(n * 100);
  }

  async function handleSubmit() {
    const cents = toCents(raw);
    if (!cents || loading) return;
    setLoading(true);

    // Crockford base32, same alphabet as the server's own refs.
    const CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    let suffix = "";
    for (let i = 0; i < 6; i++) {
      suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    const dataRef = "CLVR" + suffix;

    // Create first, then go. This used to navigate immediately and post in
    // the background, which raced: the charge screen would load, ask for a
    // payment that did not exist yet, and sit on "Reconnecting" with a dash
    // where the amount goes. The call is local and takes a few milliseconds.
    try {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amountCents: cents, ref: dataRef }),
      });
    } catch (err) {
      console.error("Could not create the payment:", err);
      setLoading(false);
      return;
    }
    router.push(`/m/${dataRef}`);
  }

  const display = raw ? `$${raw}` : "$0.00";
  const cents = toCents(raw);

  return (
    <div className="flex flex-col gap-6">
      {/* Amount display */}
      <div className="text-center">
        <p className="display text-foreground text-[3.5rem] tabular-nums leading-none">
          {display}
        </p>
        {cents && (
          <p className="text-muted-foreground mt-2 text-[0.9375rem]">
            Shopper pays {formatAud(shopperPays(cents, BIZ_MERCHANT.discountBps))}
          </p>
        )}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handleKey(k)}
            className={`flex h-16 items-center justify-center rounded-2xl text-[1.5rem] font-semibold ${
              k === "⌫"
                ? "bg-transparent text-muted-foreground"
                : "bg-foreground/8 text-foreground hover:bg-foreground/14"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Confirm */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!cents || loading}
        className="bg-foreground text-paper flex h-16 w-full items-center justify-center rounded-2xl text-[1.125rem] font-semibold disabled:opacity-40"
      >
        {loading ? "Creating…" : "Charge"}
      </button>
    </div>
  );
}
