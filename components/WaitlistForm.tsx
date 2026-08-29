"use client";

import { useActionState, useEffect, useRef } from "react";
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

/**
 * The section shows a button, not a field. Asking for an email is a question,
 * and a question the reader has not been asked yet does not need an input box
 * sitting open on the page waiting for one.
 *
 * One dialog, two states: the form, then its answer. A second dialog for the
 * confirmation would close the first and reopen somewhere else on the screen.
 */
export function WaitlistForm() {
  const [state, action] = useActionState<WaitlistState, FormData>(joinWaitlist, null);
  const ref = useRef<HTMLDialogElement>(null);

  // Auto-open when scanned from the QR (?open=waitlist). Reads location
  // directly so the page stays statically prerenderable — useSearchParams
  // would force a Suspense boundary or a CSR bailout.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("open") === "waitlist") {
      ref.current?.showModal();
    }
  }, []);

  return (
    <>
      <Button
        className="w-full max-w-64 font-outfit"
        onClick={() => ref.current?.showModal()}
      >
        Join the waitlist
      </Button>

      <dialog
        ref={ref}
        aria-labelledby="waitlist-title"
        className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-foreground/60"
      >
        {state?.ok ? (
          <>
            <h2 id="waitlist-title" className="display text-[1.5rem]">
              {state.message}
            </h2>
            <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
              We will email you when CLEVR opens.
            </p>
            {/* method="dialog" closes it: no handler, no listener. */}
            <form method="dialog">
              <Button className="mt-6 w-full">Done</Button>
            </form>
          </>
        ) : (
          <>
            <h2 id="waitlist-title" className="display text-[1.5rem]">
              Join the waitlist
            </h2>
            <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
              We will email you when CLEVR opens.
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

            {/* Ink at 15px, not red: `text-red-600` is Tailwind's default
                leaking past the token file and it measures 4.35:1 on Sun.
                There is no red in this system, and the sentence is the
                error signal. */}
            {state && !state.ok && (
              <p role="alert" className="text-foreground mt-3 text-[0.9375rem] font-medium">
                {state.message}
              </p>
            )}

            {/* A modal with no visible way out is a trap on a phone, where
                there is no Escape key. */}
            <form method="dialog">
              <Button variant="ghost" className="mt-1 h-12 w-full">
                Cancel
              </Button>
            </form>
          </>
        )}
      </dialog>
    </>
  );
}
