"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { Button } from "@/components/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full font-outfit"
      aria-disabled={pending}
      onClick={(e) => pending && e.preventDefault()}
    >
      {pending ? "Joining…" : "Join the waitlist"}
    </Button>
  );
}

// The bare form panel — used standalone on /waitlist (QR target) and inside
// the dialog on the landing page. Shared so the flow is identical in both.
export function WaitlistPanel() {
  const [state, action] = useActionState<WaitlistState, FormData>(joinWaitlist, null);

  return (
    <section className="bg-card text-foreground w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center">
      {state?.ok ? (
        <>
          <h1 className="display text-[1.5rem]">{state.message}</h1>
          <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
            We will email you when CLEVR opens.
          </p>
        </>
      ) : (
        <>
          <h1 className="display text-[1.5rem]">Join the waitlist</h1>
          <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
            One field, one tap.
          </p>
          <form action={action} className="mt-5 flex flex-col gap-3">
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-label="Email"
              className="border-muted-foreground text-foreground placeholder:text-muted-foreground focus:border-foreground h-14 w-full rounded-full border bg-transparent px-5 text-center text-[1rem]"
            />
            <SubmitButton />
          </form>
          {state && !state.ok && (
            <p role="alert" className="text-foreground mt-3 text-[0.9375rem] font-medium">
              {state.message}
            </p>
          )}
        </>
      )}
    </section>
  );
}
