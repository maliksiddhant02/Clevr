"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MvpButton, openMvp } from "@/components/Mvp";
import { AppleMark, GooglePlayMark } from "@/components/StoreMarks";

const STORES = [
  { name: "App Store", Mark: AppleMark },
  { name: "Google Play", Mark: GooglePlayMark },
] as const;

/**
 * The landing bar and its sheet.
 *
 * This started as a `<details>` with no JavaScript, which is the right shape
 * for a disclosure. It could not carry the animation: `::details-content` will
 * not resolve its own height once it is a grid or flex box, `height: auto` does
 * not interpolate on it even with `interpolate-size` set, and a pseudo-element
 * cannot take a descendant selector to fix either. So the sheet is stateful,
 * and in exchange it gets a real `aria-expanded` button rather than a summary
 * doing the same job less clearly.
 *
 * The timing is traced off the reference's own recording: its sheet edge
 * travels 341px to 36px over 8 frames at 30fps, which is 270ms, and the
 * progress at the halfway point is 0.34. That is `ease-in`, not anything
 * sharper. Opening is the same duration decelerating.
 *
 * The height is measured at the tap rather than expressed as `0fr` to `1fr`:
 * the fr track resolves to zero here because the grid container's own height
 * is indefinite, so the sheet never moves. Reading it on the tap cannot go
 * stale across a resize or a font swap the way a cached value would.
 *
 * The nav is pinned to the bottom of the collapsing box, so the top link clips
 * first and the store marks are the last thing to go. Anchoring to the top
 * would eat the sheet from the wrong end.
 */
export function NavSheet() {
  const [open, setOpen] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  // Escape closes. The sheet covers the page, and a reader who opened it by
  // accident should not have to hunt for the one control that undoes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative z-40 -mx-5 h-[84px]">
      {/* Tapping the scrim closes. It covers the page and swallows the scroll,
          so it has to be the way out: leaving it inert traps the reader on a
          screen they cannot move. It still fades ahead of the sheet, which is
          what the reference does. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => setOpen(false)}
        className={`bg-foreground/45 fixed inset-0 z-0 transition-opacity duration-200 ease-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div className="absolute inset-x-0 top-0">
        <div
          className={`relative z-20 flex items-center justify-between px-5 pt-4 pb-6 transition-colors ${
            open
              ? "bg-card duration-0"
              : "bg-transparent duration-0 delay-[270ms]"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              // Measured at the moment of the tap rather than watched: the
              // sheet's height only matters when it is about to move, and a
              // reading taken here cannot be stale.
              const el = navRef.current;
              if (el) setSheetHeight(el.getBoundingClientRect().height);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="site-nav"
            className="text-foreground flex h-11 w-11 items-center justify-center"
          >
            <span className="sr-only">{open ? "Close menu" : "Menu"}</span>
            {open ? (
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={24}
                strokeWidth={2.2}
                aria-hidden
              />
            ) : (
              /* Two bars, the top one longer. No icon in the set matches that
                 ratio, and the ratio is the mark. */
              <span aria-hidden className="flex flex-col items-start gap-[5px]">
                <span className="bg-foreground block h-[2.5px] w-[22px] rounded-full" />
                <span className="bg-foreground block h-[2.5px] w-[15px] rounded-full" />
              </span>
            )}
          </button>

          {/* The logo image, not the display wordmark: kept from the bar as it
              was set on main. */}
          <Image
            src="/logo.png"
            alt="CLEVR"
            width={1774}
            height={887}
            priority
            className="h-11 w-auto"
          />
          <span aria-hidden className="h-11 w-11" />
        </div>

        <div
          style={{ height: open ? sheetHeight : 0 }}
          className={`relative z-10 overflow-hidden transition-[height] duration-[270ms] ${
            open ? "ease-[cubic-bezier(0.16,1,0.3,1)]" : "ease-in"
          }`}
        >
          {/* Pinned to the bottom of the box it is clipped by, so a collapsing
              sheet loses its top link first. */}
          <nav
            ref={navRef}
            id="site-nav"
            aria-label="Site"
            inert={!open}
            className="bg-card absolute inset-x-0 bottom-0 rounded-b-2xl px-5 pt-2 pb-8 text-center"
          >
            {/* One destination. A marketing menu that lists the page you are
                already on is furniture; the only thing a reader wants from
                here is the product. */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-foreground flex min-h-16 items-center justify-center text-[1.375rem] font-bold"
            >
              Go to the app
            </Link>

            <div className="border-border mt-4 flex justify-center gap-3 border-t pt-7">
              {STORES.map(({ name, Mark }) => (
                <MvpButton
                  key={name}
                  aria-label={name}
                  onClick={() => {
                    // The sheet is what got tapped through; it goes with it.
                    setOpen(false);
                    openMvp();
                  }}
                  className="border-border text-foreground flex h-12 w-16 items-center justify-center rounded-full border"
                >
                  <Mark size={20} />
                </MvpButton>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
