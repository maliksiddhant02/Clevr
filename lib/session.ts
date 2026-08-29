"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Mock session. Two cookies, never merged:
//   clevr_dev     — the door  (proxy.ts sets and checks this)
//   clevr_session — who you are (this file sets and checks this)
//
// Merging them means signing out of the mock kicks you out of the demo,
// which is the thing you would do twenty times an hour.
//
// id becomes shopper_cookie in payments.shopper_cookie when the DB lands.
// Signing up does not create a new identity — it names the one the browser
// already had, so history survives signup rather than resetting at it.
//
// ponytail: session cookie is an unsigned, forgeable JSON blob. Fine — it
// guards sample data behind a dev door. Swap for Supabase magic-link when a
// second merchant exists, per TECHNICAL.md §10; getSession() is the only
// call site.

export type Role = "shopper" | "business";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const COOKIE = "clevr_session";
const YEAR = 60 * 60 * 24 * 365;

function makeId(): string {
  // Crockford base32 alphabet, 10 chars. Matches the ref alphabet.
  const CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return id;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

async function setSession(session: Session) {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: YEAR,
    path: "/",
  });
}

export async function signIn(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim() || "Demo User";
  const email = String(formData.get("email") ?? "").trim() || "demo@clevr.app";
  const existing = await getSession();
  await setSession({
    id: existing?.id ?? makeId(),
    name,
    email,
    role: "shopper",
  });
  const next = String(formData.get("next") ?? "").trim() || "/";
  redirect(next);
}

export async function signInWith(provider: string): Promise<void> {
  const existing = await getSession();
  await setSession({
    id: existing?.id ?? makeId(),
    name: `${provider} User`,
    email: `demo+${provider.toLowerCase()}@clevr.app`,
    role: "shopper",
  });
  redirect("/");
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/landing");
}

export async function switchRole(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/join");
  const next: Role = session.role === "shopper" ? "business" : "shopper";
  await setSession({ ...session, role: next });
  redirect(next === "business" ? "/m" : "/");
}
