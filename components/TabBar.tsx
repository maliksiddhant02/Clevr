"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, House, Receipt, UserRound } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/activity", label: "Activity", Icon: Receipt },
  { href: "/insights", label: "Insights", Icon: ChartNoAxesColumn },
  { href: "/account", label: "Account", Icon: UserRound },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 px-6 pb-5"
    >
      <ul className="border-ink rounded-wobble-sm shadow-hard flex border-[3px] bg-white p-1">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-wobble-sm flex min-h-14 flex-col items-center justify-center gap-0.5 transition-all duration-100 ${
                  active ? "bg-ink text-paper" : "hover:bg-muted"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} aria-hidden />
                <span className="text-sm leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
