import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// One face, two jobs. Inter at 400/500/600 carries body and UI; the same face
// at 900 with tight tracking is the display voice. The variable font ships
// every weight in one file, so the second job costs nothing.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CLEVR",
  description: "Pay by bank, pay less.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  // No maximumScale or userScalable:false. Never block pinch zoom.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
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
