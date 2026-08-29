import { Suspense } from "react";
import { TabBar } from "@/components/TabBar";

// The tab shell. Pushed screens (payment detail, pay) live outside this group
// so they render full-height with a back header instead of a tab bar.
//
// Clearance for the fixed tab bar is set per screen rather than here, so a
// screen that ends in a full-bleed band can run the band to the bottom edge
// and put the clearance inside it.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <Suspense fallback={null}>
        <TabBar scan />
      </Suspense>
    </>
  );
}
