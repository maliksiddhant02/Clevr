"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// ponytail: no camera decode yet — the manual field takes a ref and routes
// to /p/[ref]. Add a QR decoder (e.g. jsQR) when a real QR is printed.
export function ScannerFrame() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = code.trim().toUpperCase();
    if (ref) router.push(`/p/${ref}`);
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Viewfinder */}
      <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-3xl bg-foreground/8">
        {/* Corner marks */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`border-foreground absolute h-8 w-8 ${
              pos === "tl" ? "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg" :
              pos === "tr" ? "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg" :
              pos === "bl" ? "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg" :
                             "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg"
            }`}
          />
        ))}
        <p className="text-muted-foreground text-center text-[0.875rem]">
          Camera not available
          <br />
          in this demo
        </p>
      </div>

      {/* Manual entry */}
      <div>
        <p className="text-foreground mb-3 text-center text-[0.9375rem] font-medium">
          Or enter the code manually
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CLVR7K2QX"
            aria-label="Payment reference code"
            className="border-border bg-card text-foreground flex-1 rounded-xl border px-4 py-3 font-mono text-[1rem] uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="bg-foreground text-paper rounded-xl px-5 py-3 text-[0.9375rem] font-semibold disabled:opacity-40"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
