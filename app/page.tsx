// Token smoke check. Not a designed screen — it exists so `npm run dev` fails
// loudly if a font or token stops resolving. Delete once /m and /p exist.
export default function Home() {
  return (
    <main className="flex flex-col gap-8 py-12">
      <h1 className="font-display text-5xl">CLEVR</h1>
      <p>Pay by bank, pay less. Tokens below should all look hand-drawn.</p>

      <div className="flex items-baseline gap-3">
        <span className="text-marker font-display text-2xl line-through">
          $10.00
        </span>
        <span className="font-display text-6xl">$9.95</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Literal class strings — Tailwind only scans source for whole names,
            so `rounded-wobble-${n}` would silently render square. */}
        {["rounded-wobble-1", "rounded-wobble-2", "rounded-wobble-3"].map(
          (radius) => (
            <div
              key={radius}
              className={`border-ink shadow-paper border-2 bg-white p-4 ${radius}`}
            >
              {radius}
            </div>
          ),
        )}
      </div>

      <div className="border-ink rounded-wobble-sm shadow-hard-sm border-2 bg-white p-4">
        <span className="font-exact text-2xl tracking-wide">CLVR7K2QX</span>
      </div>

      <button
        type="button"
        className="border-ink rounded-wobble-sm shadow-hard hover:bg-marker hover:shadow-hard-sm min-h-12 border-[3px] bg-white px-6 text-xl transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        Charge $10.00
      </button>
    </main>
  );
}
