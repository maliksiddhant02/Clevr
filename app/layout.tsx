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
// LICENCE: the local cuts are Fontspring DEMO files, trial-licensed for
// evaluation only. Not licensed for production or for redistribution.
//
// The demo cuts are also sabotaged on purpose, which is the point of the
// unicode-range below. They draw a "DEMO" pineapple instead of the real glyph
// for every one of:
//
//     ! " # $ % & ' ( ) * + - / 4 < = > @ [ \ ] ^ _ ` { | } ~
//
// `$` and the digit `4` are in that list, and this is a payments app. So the
// local family is restricted to the characters it actually draws: letters,
// space, and the five punctuation marks that survived. Everything else falls
// through to Outfit, which is geometric, spans the same 100-900, and is close
// enough that the seam does not read as a second typeface.
//
// All ten digits go to Outfit, not just the broken `4`. Nine correct digits
// beside one from a different face is worse in a column of money than ten
// consistent ones.
//
// Buying the licensed family means deleting this unicode-range and the Outfit
// fallback with it. See DESIGN.md 3.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const ceraRound = localFont({
  variable: "--font-cera-round",
  display: "swap",
  // Off, deliberately. Next otherwise generates a metric-adjusted local face
  // and inserts it directly after this family, which would catch every glyph
  // this range gives up before Outfit ever gets a chance at them.
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      // space , . : ; ? A-Z a-z. Nothing else in the demo cuts is trustworthy.
      value:
        "U+0020, U+002C, U+002E, U+003A-003B, U+003F, U+0041-005A, U+0061-007A",
    },
  ],
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
