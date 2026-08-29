import { TabBar, type TabDef } from "@/components/TabBar";
import {
  ReceiptIcon,
  BanknoteArrowUpIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

// Merchant shell — separate tab set from the shopper shell.
// Route group /m keeps the merchant paths without exposing /m in the
// shopper view.
//
// The central Till action is placed in the center circle button just like
// the scan button in the shopper view.
const MERCHANT_TABS: readonly TabDef[] = [
  { href: "/m/activity", label: "Activity", icon: ReceiptIcon },
  { href: "/m/payouts", label: "Reconcile", icon: BanknoteArrowUpIcon },
  { href: "/m/account", label: "Account", icon: UserCircleIcon },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <TabBar tabs={MERCHANT_TABS} scan={true} />
    </>
  );
}
