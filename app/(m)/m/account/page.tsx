import type { Metadata } from "next";
import { BIZ_MERCHANT } from "@/lib/biz-sample";
import { switchRole, signOut } from "@/lib/session";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "CLEVR — Merchant account",
};

export default async function MerchantAccountPage() {
  const session = await getSession();

  return (
    <main className="pb-28 pt-10">
      <h1 className="display text-foreground text-[2rem] leading-none">
        Account
      </h1>

      {/* Shop details */}
      <section className="mt-8">
        <p className="text-muted-foreground mb-2 text-[0.8125rem] font-medium uppercase tracking-wide">
          Shop
        </p>
        <div className="border-border divide-border divide-y rounded-2xl border">
          <Row label="Name" value={BIZ_MERCHANT.name} />
          <Row label="PayID" value={BIZ_MERCHANT.payid} mono />
          <Row label="Discount offered" value="0.50%" />
        </div>
      </section>

      {/* Session */}
      {session && (
        <section className="mt-8">
          <p className="text-muted-foreground mb-2 text-[0.8125rem] font-medium uppercase tracking-wide">
            Signed in as
          </p>
          <div className="border-border divide-border divide-y rounded-2xl border">
            <Row label="Name" value={session.name} />
            <Row label="Email" value={session.email} />
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="mt-8 flex flex-col gap-3">
        <form action={switchRole}>
          <button
            type="submit"
            className="bg-foreground/8 text-foreground flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-medium"
          >
            Switch to shopper view
          </button>
        </form>
        <form action={signOut}>
          <button
            type="submit"
            className="border-border text-foreground flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-medium"
          >
            Sign out
          </button>
        </form>
      </section>

      <p className="text-muted-foreground mt-8 text-[0.75rem] leading-relaxed">
        ponytail: one seeded merchant row. Add Supabase magic-link when a second
        merchant exists.
      </p>
    </main>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-muted-foreground text-[0.875rem]">{label}</p>
      <p
        className={`text-foreground text-[0.9375rem] font-medium ${mono ? "font-mono text-[0.8125rem]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
