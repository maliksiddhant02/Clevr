"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartPie, House, Receipt, UserRound } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/activity", label: "Activity", Icon: Receipt },
  { href: "/insights", label: "Insights", Icon: ChartPie },
  { href: "/account", label: "Account", Icon: UserRound },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="border-border bg-card/85 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-xl"
    >
      <ul className="mx-auto flex w-full max-w-[430px] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-200 ${
                  active
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={active ? 2.4 : 1.8}
                  aria-hidden
                  className="transition-transform duration-200"
                />
                <span
                  className={`text-[0.6875rem] leading-none ${active ? "font-semibold" : "font-medium"}`}
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
