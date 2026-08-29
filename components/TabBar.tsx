"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home01Icon,
  PieChartIcon,
  ReceiptIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const TABS = [
  { href: "/", label: "Home", icon: Home01Icon },
  { href: "/activity", label: "Activity", icon: ReceiptIcon },
  { href: "/insights", label: "Insights", icon: PieChartIcon },
  { href: "/account", label: "Account", icon: UserCircleIcon },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="border-border bg-background fixed inset-x-0 bottom-0 z-20 border-t"
    >
      <ul className="mx-auto flex w-full max-w-[430px] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {/* The Ink pill is the app's single active-state signal, and
                    only one tab can be active at a time. */}
                <span
                  aria-hidden
                  className={`flex h-7 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                    active ? "bg-foreground text-paper" : "bg-transparent"
                  }`}
                >
                  <HugeiconsIcon icon={icon} size={20} strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span
                  className={`text-[0.8125rem] leading-none ${active ? "font-semibold" : "font-medium"}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
