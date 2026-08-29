"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight01Icon,
  BankIcon,
  FlashIcon,
  LockIcon,
  PercentIcon,
  QrCodeIcon,
  SafeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { getSession, signOut, switchRole, signIn, signInProvider, type Session } from "@/lib/session";

type Row = {
  icon: IconSvgElement;
  title: string;
  status?: string;
  body: string;
};

const SETTING: Row = {
  icon: FlashIcon,
  title: "Fast checkout",
  status: "Not set up",
  body: "Authorise CLEVR once in your banking app and every payment after that is a single tap. Your bank holds the authorisation, not us. Coming after launch.",
};

const FAQ: Row[] = [
  {
    icon: QrCodeIcon,
    title: "How do I pay?",
    body: "Find the QR code at the counter and scan it with your phone's camera. No app and no signup needed. Your banking app opens with the amount already filled in. Once you pay, the shop's screen confirms before you leave.",
  },
  {
    icon: BankIcon,
    title: "How does it work?",
    body: "Scan the shop's QR and pay from your bank. The shop avoids the card fee and hands part of it back to you. Your money goes straight to the shop, never through us.",
  },
  {
    icon: PercentIcon,
    title: "What does a card tap cost the shop?",
    body: "About 1.4% of the sale. Paying from your bank avoids that fee, so the shop keeps most of it and hands you the rest at the till.",
  },
  {
    icon: ArrowRight01Icon,
    title: "How do refunds work?",
    body: "Refunds come back the same way, in seconds rather than the days a card takes. There are no chargebacks, which is part of why shops can afford the discount.",
  },
  {
    icon: SafeIcon,
    title: "Does CLEVR hold my money?",
    body: "No. Payments go straight from your account to the shop's. We are not a bank and we never hold your funds.",
  },
  {
    icon: LockIcon,
    title: "What happens to my data?",
    body: "We do not sell it, to shops or to anyone. Shops see only their own sales. Your history stays on this device until you make an account.",
  },
];

function Disclosure({ icon, title, status, body }: Row) {
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          >
            <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
          </span>
          <span className="text-foreground flex-1 text-[1.0625rem] font-semibold">
            {title}
          </span>
          {status && (
            <span className="text-foreground bg-card shrink-0 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium">
              {status}
            </span>
          )}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={17}
            strokeWidth={2}
            aria-hidden
            className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90"
          />
        </summary>
        <p className="text-muted-foreground pb-5 text-[0.9375rem] leading-relaxed">
          {body}
        </p>
      </details>
    </li>
  );
}

export default function Account() {
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
    <main className="pt-6 pb-28">
      {/* Title */}
      <h1 className="display text-foreground text-[3.5rem]">Account</h1>

      {/* Switch to Business View Button below the title */}
      <div className="mt-3 mb-6">
        <form action={switchRole}>
          <button
            type="submit"
            className="bg-foreground text-paper hover:opacity-90 flex h-10 px-5 items-center justify-center rounded-full text-[0.8125rem] font-bold transition-all cursor-pointer"
          >
            Switch to business view
          </button>
        </form>
      </div>

      {session ? (
        // ── SIGNED IN: Profile View ──
        <>
          <div className="mt-2 rounded-2xl bg-foreground/6 px-4 py-4 flex flex-col gap-1.5">
            <p className="text-foreground text-[0.9375rem] font-semibold">
              <span className="text-muted-foreground font-normal">Name:</span> {session.name}
            </p>
            <p className="text-foreground text-[0.9375rem] font-semibold">
              <span className="text-muted-foreground font-normal">Email:</span> {session.email}
            </p>
          </div>

          <ul className="border-border mt-8 divide-y divide-[rgb(0_0_0/0.16)] border-y">
            <Disclosure {...SETTING} />
          </ul>

          <div className="mt-6 flex flex-col gap-3">
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
                className="border-border text-foreground hover:bg-foreground/5 flex h-14 w-full items-center justify-center rounded-2xl border text-[1rem] font-medium transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>

          <h2 className="display text-foreground mt-12 text-[1.5rem]">
            Common questions
          </h2>
          <ul className="border-border mt-4 divide-y divide-[rgb(0_0_0/0.16)] border-y">
            {FAQ.map((row) => (
              <Disclosure key={row.title} {...row} />
            ))}
          </ul>
        </>
      ) : (
        // ── SIGNED OUT: Sign Up Form View ──
        <div className="flex flex-col">
          {/* Heading block */}
          <h2 className="display text-foreground text-[2.75rem] leading-[1.05] font-black">
            Pay by bank.
          </h2>
          <p className="text-muted-foreground mt-3 text-[1.0625rem] font-medium leading-normal">
            Keep a share of every card fee the shop just avoided.
          </p>

          {/* Social Sign-in Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <form action={signInProvider}>
              <input type="hidden" name="provider" value="Google" />
              <button
                type="submit"
                className="bg-paper hover:bg-foreground/5 text-foreground border border-border flex h-14 w-full items-center justify-center gap-3 rounded-full text-[1.0125rem] font-semibold transition-colors cursor-pointer"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <form action={signInProvider}>
              <input type="hidden" name="provider" value="Apple" />
              <button
                type="submit"
                className="bg-paper hover:bg-foreground/5 text-foreground border border-border flex h-14 w-full items-center justify-center gap-3 rounded-full text-[1.0125rem] font-semibold transition-colors cursor-pointer"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.05-1 .04-2.22.67-2.94 1.51-.62.72-1.16 1.87-1.01 2.97 1.1.09 2.23-.55 2.96-1.43z"/>
                </svg>
                Continue with Apple
              </button>
            </form>

            <form action={signInProvider}>
              <input type="hidden" name="provider" value="Facebook" />
              <button
                type="submit"
                className="bg-paper hover:bg-foreground/5 text-foreground border border-border flex h-14 w-full items-center justify-center gap-3 rounded-full text-[1.0125rem] font-semibold transition-colors cursor-pointer"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                Continue with Facebook
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border/80"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-[0.875rem] font-semibold">or</span>
            <div className="flex-grow border-t border-border/80"></div>
          </div>

          {/* Email Signup Form */}
          <form action={signIn} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="text-foreground text-[0.875rem] font-bold tracking-wide block mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="bg-paper border border-border text-foreground placeholder:text-muted-foreground w-full h-14 rounded-full px-5 text-[1.0125rem] font-semibold focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-foreground text-[0.875rem] font-bold tracking-wide block mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-paper border border-border text-foreground placeholder:text-muted-foreground w-full h-14 rounded-full px-5 text-[1.0125rem] font-semibold focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-foreground text-[0.875rem] font-bold tracking-wide block mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Choose a password"
                required
                className="bg-paper border border-border text-foreground placeholder:text-muted-foreground w-full h-14 rounded-full px-5 text-[1.0125rem] font-semibold focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="bg-foreground text-paper border-foreground hover:opacity-95 flex h-14 w-full items-center justify-center rounded-full text-[1.0625rem] font-bold mt-3 transition-opacity cursor-pointer"
            >
              Create account
            </button>
          </form>

          {/* Footer */}
          <p className="text-muted-foreground text-center mt-6 text-[0.875rem] font-medium">
            Already have an account?{" "}
            <MvpSignBtn />
          </p>
        </div>
      )}
    </main>
  );
}

// Client action mock button to trigger sign in popup
function MvpSignBtn() {
  return (
    <button
      type="button"
      className="text-foreground font-bold underline hover:opacity-85 cursor-pointer"
      onClick={() => {
        const dialog = document.getElementById("mvp") as HTMLDialogElement | null;
        dialog?.showModal();
      }}
    >
      Sign in
    </button>
  );
}
