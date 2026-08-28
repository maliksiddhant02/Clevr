import type { Metadata, Viewport } from "next";
import { Calistoga, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Dual-font system: Calistoga carries personality in headlines, Inter carries
// clarity everywhere else. JetBrains Mono handles labels and any value a human
// has to read back exactly (payment references, PayIDs).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const calistoga = Calistoga({
  variable: "--font-calistoga",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CLEVR",
  description: "Pay by bank, pay less.",
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  // No maximumScale / userScalable:false — never block pinch zoom.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Ambient accent glow — texture over flatness. Fixed so it doesn't
            scroll away and never intercepts a tap. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(0,82,255,0.08),transparent_70%)]"
        />
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
