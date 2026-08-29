import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The dev door. Not a security boundary — nothing behind it is real.
// A bookmarked link, not a login: open /?key=<CLEVR_KEY> once per device,
// and the cookie carries you from then on.
//
// CLEVR_KEY unset → everything redirects to /landing. Correct fail-shut
// behaviour: a missing var locks the door rather than opening it.
//
// ponytail: shared key in a cookie, no revocation. If this ever guards
// something real, that is a different problem and a different file.

const COOKIE = "clevr_dev";
const YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Always let the landing page and its assets through.
  if (pathname === "/landing") return NextResponse.next();

  const key = process.env.CLEVR_KEY;

  // Key in the URL: set cookie and redirect to the same path without it.
  // The key is in the address bar for one frame; every recorded URL after
  // this is clean.
  if (key && searchParams.get("key") === key) {
    const dest = new URL(request.url);
    dest.searchParams.delete("key");
    const res = NextResponse.redirect(dest);
    res.cookies.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: YEAR,
      path: "/",
    });
    return res;
  }

  // Cookie present → through.
  if (request.cookies.has(COOKIE)) return NextResponse.next();

  // Otherwise → /landing.
  return NextResponse.redirect(new URL("/landing", request.url));
}

export const config = {
  matcher: [
    // Run on everything except static assets and metadata files. Anything
    // with a file extension is an asset; the routes here have none.
    "/((?!_next/static|_next/image|.*\\.[a-z0-9]+$).*)",
  ],
};
