"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home01Icon,
  PieChartIcon,
  QrCodeIcon,
  ReceiptIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export type TabDef = {
  href: string;
  label: string;
  icon: IconSvgElement;
};

const SHOPPER_TABS: readonly TabDef[] = [
  { href: "/", label: "Home", icon: Home01Icon },
  { href: "/activity", label: "Activity", icon: ReceiptIcon },
  { href: "/insights", label: "Insights", icon: PieChartIcon },
  { href: "/account", label: "Account", icon: UserCircleIcon },
];

/**
 * The shopper bar carries a fifth slot in the middle: paying is the product,
 * and it was a button halfway down Home, two centimetres above a bar that had
 * room for it. It is an Ink disc with one Sun mark, which is the system's own
 * emphasis move (DESIGN.md 1) and is what keeps it from reading as a fifth
 * tab: the tabs invert to Ink pills with Paper marks, this inverts to Sun.
 *
 * The merchant bar does not get one. A till shows a code; it never scans one.
 */
export function TabBar({
  tabs = SHOPPER_TABS,
  scan = false,
}: {
  tabs?: readonly TabDef[];
  scan?: boolean;
}) {
  const pathname = usePathname();
  const half = Math.ceil(tabs.length / 2);

  return (
    <nav
      aria-label="Main"
      className="border-border bg-background fixed inset-x-0 bottom-0 z-20 border-t"
    >
      <ul className="mx-auto flex w-full max-w-[430px] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ href, label, icon }, i) => {
          const active = pathname === href;
          const item = (
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

          // The disc sits between the two halves rather than at a fixed index,
          // so it stays centred if a tab is ever added or removed.
          if (scan && i === half - 1) {
            return (
              <Fragment key={href}>
                {item}
                <li key="scan" className="flex flex-1 justify-center">
                  {/* Lifted clear of the bar. The 4px Sun border is the bar's
                      own ground, which is what breaks the hairline behind the
                      disc so it reads as raised without a shadow. */}
                  <Link
                    href="/pay"
                    aria-label="Scan to pay"
                    className="border-background bg-foreground text-sun -mt-9 flex h-16 w-16 items-center justify-center rounded-full border-4 [--focus-ring:var(--color-paper)] [--focus-ring-offset:-7px]"
                  >
                    <HugeiconsIcon icon={QrCodeIcon} size={28} strokeWidth={2} aria-hidden />
                  </Link>
                </li>
              </Fragment>
            );
          }

          return item;
        })}
      </ul>
    </nav>
  );
}
