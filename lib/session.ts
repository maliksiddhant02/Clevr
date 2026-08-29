"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Mock session. One cookie, clevr_session: who you are.
//
// id becomes shopper_cookie in payments.shopper_cookie when the DB lands.
// Signing up does not create a new identity — it names the one the browser
// already had, so history survives signup rather than resetting at it.
//
// ponytail: session cookie is an unsigned, forgeable JSON blob. Fine — it
// names a visitor over sample data, it does not guard anything. Swap for
// Supabase magic-link when a second merchant exists, per TECHNICAL.md §10;
// getSession() is the only call site.

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
  const role = (formData.get("role") as Role) || "shopper";
  const existing = await getSession();
  await setSession({
    id: existing?.id ?? makeId(),
    name,
    email,
    role,
  });
  const next = role === "business" ? "/m" : "/app";
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
  redirect("/app");
}

export async function signInProvider(formData: FormData): Promise<void> {
  const provider = String(formData.get("provider") ?? "Google");
  const role = (formData.get("role") as Role) || "shopper";
  const existing = await getSession();
  await setSession({
    id: existing?.id ?? makeId(),
    name: `${provider} User`,
    email: `demo+${provider.toLowerCase()}@clevr.app`,
    role,
  });
  const next = role === "business" ? "/m" : "/app";
  redirect(next);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/");
}

export async function switchRole(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/join");
  const next: Role = session.role === "shopper" ? "business" : "shopper";
  await setSession({ ...session, role: next });
  redirect(next === "business" ? "/m" : "/app");
}
