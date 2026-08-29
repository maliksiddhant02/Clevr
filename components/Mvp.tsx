"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/Button";

/**
 * The placeholder notice. Every control on the landing page that has nowhere
 * to go routes here rather than to a dead anchor, so a tap gets an answer.
 *
 * A native `<dialog>` opened by id: it brings the backdrop, Escape, the focus
 * trap and the top layer with it, so nothing here is state. That is also why
 * the opener is a plain `document.getElementById` — with no state to share,
 * a context or a provider would be plumbing for one string.
 */
export function MvpDialog() {
  return (
    <dialog
      id="mvp"
      className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-black/60"
    >
      <h2 className="display text-[1.5rem]">Not wired up yet</h2>
      <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
        CLEVR is an MVP. This is a placeholder. Nothing behind it is real
        yet.
      </p>
      {/* method="dialog" closes it: no handler, no listener. */}
      <form method="dialog">
        <Button className="mt-6 w-full">Got it</Button>
      </form>
    </dialog>
  );
}

export function openMvp() {
  (document.getElementById("mvp") as HTMLDialogElement | null)?.showModal();
}

/** A dead link's replacement: looks like whatever it replaced, says the same
 *  thing when tapped. */
export function MvpButton(props: ComponentProps<"button">) {
  return <button type="button" onClick={openMvp} {...props} />;
}
