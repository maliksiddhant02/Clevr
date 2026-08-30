import QRCode from "qrcode";

/**
 * The payment QR, drawn rather than pasted.
 *
 * `qrcode`'s own `toString` returns one black path of hard squares on white,
 * which is a foreign object on a Sun page: it brings its own white card, its
 * own corners and its own idea of contrast. Taking the module matrix instead
 * and drawing the SVG here costs about thirty lines and gives back a mark in
 * the system's own language — Ink on Sun at 19:1, rounded modules, and the
 * finders as a ring and a dot rather than three nested squares.
 *
 * Error correction is M, the library default. H would survive a logo in the
 * middle; there is no logo in the middle, and the extra modules only make the
 * mark denser to scan from across a counter.
 */
export async function QrCode({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const QUIET = 2; // modules of margin. Below 2 the scanner loses the edge.
  const box = size + QUIET * 2;

  // The three 7x7 finder patterns are drawn as shapes, not as modules, so
  // their corners round as one piece instead of twenty-four.
  const finders = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ] as const;
  const inFinder = (x: number, y: number) =>
    finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

  const dots: string[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!modules.data[y * size + x] || inFinder(x, y)) continue;
      dots.push(`M${x + QUIET} ${y + QUIET}h1v1h-1z`);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      className={className}
      role="img"
      aria-label="QR code. Scan with a phone camera to pay."
      shapeRendering="geometricPrecision"
    >
      {/* One path for every data module. Per-module `rx` would need a rect
          each; a single path with rounded joins draws the same dots in one
          node, which matters at ~600 of them. */}
      <path
        d={dots.join("")}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.28}
        strokeLinejoin="round"
      />
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} transform={`translate(${fx + QUIET} ${fy + QUIET})`}>
          <rect
            x={0.6}
            y={0.6}
            width={5.8}
            height={5.8}
            rx={1.7}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
          />
          <rect x={2} y={2} width={3} height={3} rx={0.9} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
