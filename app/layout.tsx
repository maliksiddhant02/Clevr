import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// One face, every job. Outfit is the free stand-in for Cera Round, which the
// reference site licenses and this repo cannot ship: same geometric skeleton,
// same 100-900 variable range, so 400/500/600 carry body and UI and 900 is the
// display voice. Swapping in a licensed Cera Round is this one declaration.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
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
