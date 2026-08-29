"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home01Icon,
  PieChartIcon,
  QrCodeIcon,
  ReceiptIcon,
  UserCircleIcon,
  BanknoteArrowUpIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export type TabDef = {
  href: string;
  label: string;
  icon: IconSvgElement;
};

const SHOPPER_TABS: readonly TabDef[] = [
  { href: "/app", label: "Home", icon: Home01Icon },
  { href: "/activity", label: "Activity", icon: ReceiptIcon },
  { href: "/insights", label: "Insights", icon: PieChartIcon },
  { href: "/account", label: "Account", icon: UserCircleIcon },
];

const MERCHANT_TABS: readonly TabDef[] = [
  { href: "/m", label: "Till", icon: Home01Icon },
  { href: "/m/activity", label: "Activity", icon: ReceiptIcon },
  { href: "/m/payouts", label: "Reconcile", icon: BanknoteArrowUpIcon },
  { href: "/m/account", label: "Account", icon: UserCircleIcon },
];

export function TabBar({
  tabs: customTabs,
  scan = false,
}: {
  tabs?: readonly TabDef[];
  scan?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  // Determine if we should display the merchant/business tabs
  const isMerchant = pathname?.startsWith("/m") || pathname === "/m" || roleParam === "business";
  const tabs = customTabs ?? (isMerchant ? MERCHANT_TABS : SHOPPER_TABS);
  const shouldShowScan = customTabs ? scan : !isMerchant;

  const half = Math.ceil(tabs.length / 2);

  return (
    <nav
      aria-label="Main"
      className="border-border bg-background fixed inset-x-0 bottom-0 z-20 border-t"
    >
      <ul className="mx-auto flex w-full max-w-[430px] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ href, label, icon }, i) => {
          // Align active checks for redirected roles
          const active = pathname === href || (href === "/m/account" && pathname === "/account");
          const item = (
            <li key={href} className="relative flex-1">
              {active && (
                <span
                  aria-hidden
                  className="bg-foreground absolute top-[-1px] left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full"
                />
              )}
              {/* Keep the active search params when switching tabs in role preview */}
              <Link
                href={roleParam ? `${href}?role=${roleParam}` : href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 pt-1 ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <HugeiconsIcon
                  icon={icon}
                  size={22}
                  strokeWidth={active ? 2.2 : 1.7}
                  aria-hidden
                />
                <span
                  className={`text-[0.8125rem] leading-none ${active ? "font-bold" : "font-medium"}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );

          if (shouldShowScan && i === half - 1) {
            return (
              <Fragment key={href}>
                {item}
                <li key="scan" className="flex flex-1 justify-center">
                  <Link
                    href={isMerchant ? "/m" : "/pay"}
                    aria-label={isMerchant ? "Till" : "Scan to pay"}
                    className="border-background bg-foreground text-sun -mt-5 flex h-16 w-16 items-center justify-center rounded-full border-4 [--focus-ring:var(--color-paper)] [--focus-ring-offset:-7px]"
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
