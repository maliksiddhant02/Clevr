"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { Button } from "@/components/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-64 font-outfit" disabled={pending}>
      {pending ? "Joining…" : "Join the waitlist"}
    </Button>
  );
}

export function WaitlistForm() {
  const [state, action] = useActionState<WaitlistState, FormData>(joinWaitlist, null);

  return (
    <form action={action} className="flex w-full flex-col items-center gap-3">
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        aria-label="Email"
        className="border-border text-foreground placeholder:text-muted-foreground focus:border-foreground h-14 w-64 rounded-full border bg-transparent px-5 text-[1rem] outline-none"
      />
      <SubmitButton />
      {state && (
        <p
          role="status"
          className={`text-[0.875rem] font-medium ${state.ok ? "text-foreground" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
