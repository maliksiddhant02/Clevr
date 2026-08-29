"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Image01Icon, KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { openMvp } from "@/components/Mvp";

// ponytail: no camera decode yet. The code dialog takes a ref and routes to
// /p/[ref]. Add a QR decoder (e.g. jsQR) when a real QR is printed.

/** One of the two round actions under the viewfinder. */
function Action({
  icon,
  label,
  onClick,
}: {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-paper [--focus-ring:var(--color-paper)] flex w-24 flex-col items-center gap-2"
    >
      <span
        aria-hidden
        className="border-paper/25 flex h-14 w-14 items-center justify-center rounded-full border"
      >
        <HugeiconsIcon icon={icon} size={22} strokeWidth={1.8} />
      </span>
      <span className="text-on-ink text-[0.8125rem] leading-none">{label}</span>
    </button>
  );
}

export function ScannerFrame() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const entry = useRef<HTMLDialogElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = code.trim().toUpperCase();
    if (ref) router.push(`/p/${ref}`);
  }

  return (
    <>
      {/* The viewfinder takes the free space rather than a fixed height, so it
          sits optically centred on a tall phone and a short one alike. */}
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="qr-pulse relative h-[17rem] w-[17rem] max-w-full">
          {/* Four brackets, not a box: a closed rectangle reads as a frame the
              reader is meant to fill, and the corners read as an aim. Sun is
              the one accent inside an Ink block (DESIGN.md 5). */}
          {(
            [
              ["top-0 left-0", "border-t-[3px] border-l-[3px] rounded-tl-[1.75rem]"],
              ["top-0 right-0", "border-t-[3px] border-r-[3px] rounded-tr-[1.75rem]"],
              ["bottom-0 left-0", "border-b-[3px] border-l-[3px] rounded-bl-[1.75rem]"],
              ["bottom-0 right-0", "border-b-[3px] border-r-[3px] rounded-br-[1.75rem]"],
            ] as const
          ).map(([corner, edges]) => (
            <span
              key={corner}
              aria-hidden
              className={`border-sun absolute h-16 w-16 ${corner} ${edges}`}
            />
          ))}
        </div>
      </div>

      <p className="text-on-ink text-center text-[0.9375rem]">
        The camera is not live in this demo. Enter a code instead.
      </p>

      <div className="mt-8 flex justify-center gap-6">
        <Action icon={Image01Icon} label="Upload QR" onClick={openMvp} />
        <Action
          icon={KeyboardIcon}
          label="Enter code"
          onClick={() => entry.current?.showModal()}
        />
      </div>

      <dialog
        ref={entry}
        aria-labelledby="entry-title"
        className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-foreground/60"
      >
        <h2 id="entry-title" className="display text-[1.5rem]">
          Enter the code
        </h2>
        <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
          It is printed under the shop&apos;s QR.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="CLVR7K2QX"
            aria-label="Payment reference code"
            className="border-muted-foreground text-foreground placeholder:text-muted-foreground focus:border-foreground h-14 w-full rounded-full border bg-transparent px-5 text-center font-mono text-[1rem] uppercase placeholder:normal-case"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="bg-foreground text-paper [--focus-ring:var(--color-paper)] [--focus-ring-offset:-5px] flex h-14 w-full items-center justify-center rounded-full text-[1.0625rem] font-semibold disabled:opacity-40"
          >
            Go
          </button>
        </form>

        {/* A modal with no visible way out is a trap on a phone, where there
            is no Escape key. */}
        <form method="dialog">
          <button
            type="submit"
            className="text-muted-foreground mt-1 h-12 w-full text-[1.0625rem] font-semibold"
          >
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
}
