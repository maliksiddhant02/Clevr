import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// One face, every job: Cera Round Pro, self-hosted. Four weights, because only
// four are used; the Thin and Light of the family are not shipped.
//
// There is no 600 in the family as supplied. CSS font matching resolves a
// `font-semibold` request upward to 700, which is the intended reading here:
// the system's emphasis steps are 400, 500, 700 and 900.
//
// The cuts in app/fonts carry printable ASCII only, so anything outside that
// set falls through to the next family in the stack. Outfit is there to catch
// it: geometric, the same 100-900 range, close enough that a stray copyright
// mark or curly quote does not read as a different typeface mid-sentence.
// System sans was doing that job before and it showed.
//
// LICENCE: the local cuts are Fontspring DEMO files, trial-licensed for
// evaluation only. Not licensed for production or for redistribution. Dropping
// the purchased family in over the same four filenames also makes the Outfit
// fallback dead weight, and it can go. See DESIGN.md 3.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const ceraRound = localFont({
  variable: "--font-cera-round",
  display: "swap",
  // Off, deliberately. Next otherwise generates a metric-adjusted local face
  // and inserts it directly after this family, which would catch every glyph
  // the cuts are missing before Outfit ever gets a chance at them.
  adjustFontFallback: false,
  src: [
    {
      path: "./fonts/CeraRoundPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CeraRoundPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    { path: "./fonts/CeraRoundPro-Bold.woff2", weight: "700", style: "normal" },
    {
      path: "./fonts/CeraRoundPro-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "CLEVR",
  description: "Pay by bank, pay less.",
};

export const viewport: Viewport = {
  themeColor: "#fff401",
  // No maximumScale or userScalable:false. Never block pinch zoom.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ceraRound.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Mobile-only. Both real surfaces are phones: a stall owner's handset
            and a stranger's handset. On anything wider this stays a centred
            phone-width column, which is also what a screen-mirrored pitch
            projects. No desktop layout exists on purpose. */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5">
          {children}
        </div>
      </body>
    </html>
  );
}
