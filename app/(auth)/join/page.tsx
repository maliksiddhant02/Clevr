import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signIn, signInWith } from "@/lib/session";
import { GoogleMark, AppleMark, FacebookMark } from "@/components/StoreMarks";

export const metadata: Metadata = {
  title: "CLEVR: Join",
  description: "Create an account or sign in to CLEVR.",
};

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Mark: GoogleMark },
  { id: "apple", label: "Continue with Apple", Mark: AppleMark },
  { id: "facebook", label: "Continue with Facebook", Mark: FacebookMark },
] as const;

// Extracts the merchant name and amount from a /p/[ref] next URL for the
// "waiting for payment" banner. Returns null when next is anything else.
function pendingPayment(next: string | undefined): { ref: string } | null {
  if (!next) return null;
  const m = next.match(/^\/p\/([A-Z0-9]+)/);
  return m ? { ref: m[1] } : null;
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signin" ? "signin" : "signup";
  const next = params.next ?? "/";
  const pending = pendingPayment(params.next);

  const isSignIn = mode === "signin";

  return (
    <main className="flex flex-1 flex-col px-0 pb-safe">
      {/* Mark */}
      <div className="px-5 pt-6">
        <Link href="/landing">
          <Image
            src="/logo.png"
            alt="CLEVR"
            width={1774}
            height={887}
            className="h-8 w-auto cursor-pointer"
            priority
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 pb-10 pt-8">
        {/* Payment waiting banner */}
        {pending && (
          <p className="text-foreground mb-6 text-[0.9375rem] font-medium">
            A payment is waiting. Sign in to continue.
          </p>
        )}

        {/* Headline */}
        <h1 className="display text-foreground text-[2.75rem] leading-[0.92]">
          {isSignIn ? "Welcome back." : "Pay by bank."}
        </h1>
        <p className="text-muted-foreground mt-3 text-[1rem] leading-relaxed">
          {isSignIn
            ? "Sign in to see your savings."
            : "Keep a share of every card fee the shop just avoided."}
        </p>

        {/* Provider pills */}
        <div className="mt-10 flex flex-col gap-3">
          {PROVIDERS.map(({ id, label, Mark }) => (
            <form key={id} action={signInWith.bind(null, id)}>
              <input type="hidden" name="next" value={next} />
              <button
                type="submit"
                className="border-border bg-card text-foreground flex h-14 w-full items-center gap-3 rounded-2xl border px-5 text-[1rem] font-medium"
              >
                <Mark size={22} />
                {label}
              </button>
            </form>
          ))}
        </div>

        {/* Divider */}
        <div className="border-border my-7 flex items-center gap-3 border-t">
          <span className="text-muted-foreground bg-background -mt-px px-2 text-[0.8125rem]">
            or
          </span>
        </div>

        {/* Email form */}
        <form action={signIn} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />

          {!isSignIn && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-foreground text-[0.875rem] font-medium"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required={!isSignIn}
                placeholder="Your name"
                className="border-border bg-card text-foreground h-14 rounded-2xl border px-4 text-[1rem] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-foreground text-[0.875rem] font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="border-border bg-card text-foreground h-14 rounded-2xl border px-4 text-[1rem] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-foreground text-[0.875rem] font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              required
              placeholder={isSignIn ? "Your password" : "Choose a password"}
              className="border-border bg-card text-foreground h-14 rounded-2xl border px-4 text-[1rem] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            className="bg-foreground text-paper mt-2 flex h-14 w-full items-center justify-center rounded-2xl text-[1rem] font-semibold"
          >
            {isSignIn ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Terms + mode swap */}
        <p className="text-muted-foreground mt-6 text-center text-[0.8125rem] leading-relaxed">
          {isSignIn ? (
            <>
              No account?{" "}
              <Link
                href={`/join${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="text-foreground font-medium underline"
              >
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href={`/join?mode=signin${next !== "/" ? `&next=${encodeURIComponent(next)}` : ""}`}
                className="text-foreground font-medium underline"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
        <p className="text-muted-foreground mt-3 text-center text-[0.75rem] leading-relaxed">
          By continuing you agree to our{" "}
          <Link href="/landing" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/landing" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
