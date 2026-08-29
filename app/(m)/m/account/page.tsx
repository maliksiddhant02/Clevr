"use client";

import { useState, useEffect } from "react";
import { BIZ_MERCHANT } from "@/lib/biz-sample";
import { getSession, switchRole, signOut, type Session } from "@/lib/session";

export default function MerchantAccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-foreground">
        <span className="text-[1.0625rem] font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <main className="pt-6 pb-28 text-foreground bg-background">
      {/* Title (Business Mode badge removed) */}
      <h1 className="display text-foreground text-[3.5rem]">Account</h1>

      {/* Switch to customer view Button below the title */}
      <div className="mt-3 mb-6">
        <form action={switchRole}>
          <button
            type="submit"
            className="bg-foreground text-paper hover:opacity-90 flex h-10 px-5 items-center justify-center rounded-full text-[0.8125rem] font-bold transition-all cursor-pointer"
          >
            Switch to customer view
          </button>
        </form>
      </div>

      {/* Shop details in a unified Clevr theme container */}
      <section className="mt-6">
        <h2 className="text-muted-foreground mb-2 text-[0.8125rem] font-semibold uppercase tracking-widest">
          Shop Details
        </h2>
        <div className="rounded-2xl bg-foreground/6 px-4 py-4 flex flex-col gap-2">
          <p className="text-foreground text-[0.9375rem] font-semibold">
            <span className="text-muted-foreground font-normal">Name:</span> {BIZ_MERCHANT.name}
          </p>
          <p className="text-foreground text-[0.9375rem] font-semibold">
            <span className="text-muted-foreground font-normal">PayID:</span> {BIZ_MERCHANT.payid}
          </p>
          <p className="text-foreground text-[0.9375rem] font-semibold">
            <span className="text-muted-foreground font-normal">Discount offered:</span> 0.50%
          </p>
        </div>
      </section>

      {/* Signed-in Session details */}
      {session && (
        <section className="mt-6">
          <h2 className="text-muted-foreground mb-2 text-[0.8125rem] font-semibold uppercase tracking-widest">
            Signed in as
          </h2>
          <div className="rounded-2xl bg-foreground/6 px-4 py-4 flex flex-col gap-2">
            <p className="text-foreground text-[0.9375rem] font-semibold">
              <span className="text-muted-foreground font-normal">Name:</span> {session.name}
            </p>
            <p className="text-foreground text-[0.9375rem] font-semibold">
              <span className="text-muted-foreground font-normal">Email:</span> {session.email}
            </p>
          </div>
        </section>
      )}

      {/* Logout Action Button at the bottom */}
      <section className="mt-8 flex flex-col gap-3">
        <form
          action={signOut}
          onSubmit={(e) => {
            if (!confirm("Are you sure you want to sign out?")) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="border-foreground/18 text-foreground hover:bg-foreground/5 flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-medium transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
