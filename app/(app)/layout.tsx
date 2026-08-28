import { TabBar } from "@/components/TabBar";

// The tab shell. Pushed screens (payment detail, pay) live outside this group
// so they render full-height with a back header instead of a tab bar.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* pb-32 clears the fixed tab bar so the last row is never trapped. */}
      <div className="flex-1 pb-32">{children}</div>
      <TabBar />
    </>
  );
}
