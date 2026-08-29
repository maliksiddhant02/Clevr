"use client";

import { useState } from "react";

import { railIndex } from "@/lib/rail";

/**
 * A horizontal rail of Ink media blocks. The scroll is the platform's own
 * (`snap-x` plus `overflow-x-auto`), not a carousel library; the only state is
 * which dot is lit, derived from scroll position. See DESIGN.md §6.
 */
export function CardRail({
  label,
  slides,
}: {
  label: string;
  slides: readonly { title: string; note: string }[];
}) {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <ul
        tabIndex={0}
        aria-label={label}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(railIndex(el.scrollLeft, el.scrollWidth, el.clientWidth, slides.length));
        }}
        className="rail -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
      >
        {slides.map((s) => (
          <li key={s.title} className="w-[94%] shrink-0 snap-center">
            {/* 84% and 25.5rem: the reference's rail cards measure 314x407 in
                a 375px viewport, at a 40px radius. */}
            <div className="bg-foreground flex h-[25.5rem] flex-col justify-end rounded-3xl p-6">
              <p className="text-on-ink text-[0.9375rem]">{s.note}</p>
              <p className="display text-paper mt-2 text-[1.75rem]">{s.title}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Position, not a control: the rail itself is the interface. */}
      <div aria-hidden className="mt-5 flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <span
            key={s.title}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === index ? "bg-foreground w-5" : "bg-foreground/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
