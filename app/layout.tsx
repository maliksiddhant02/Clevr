import type { Metadata, Viewport } from "next";
import { Anton, Kalam, Patrick_Hand, Space_Mono } from "next/font/google";
import "./globals.css";

// Four faces, one strict job each — see DESIGN.md §2.
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: "700",
});

const patrickHand = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CLEVR",
  description: "Pay by bank, pay less.",
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
  // No maximumScale / userScalable:false — never block pinch zoom.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} ${patrickHand.variable} ${anton.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Mobile-only. Both real surfaces are phones: a stall owner's handset
            and a stranger's handset. On anything wider this stays a centred
            phone-width column, which is also what a screen-mirrored pitch
            projects. No desktop layout exists on purpose. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
