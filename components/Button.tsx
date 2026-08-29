import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const VARIANT = {
  // Ink fill, Paper text. The fill does all the work: no border, no shadow.
  // Both filled pills carry their focus ring INSIDE the fill, in the fill's
  // own contrasting colour. An outside ring cannot work here: Chrome's focus
  // ring contrast adjustment samples the element's own background, so an Ink
  // ring on an Ink pill is repainted white (landing on Sun at 1.15:1) and a
  // Paper ring on a Paper pill is repainted black. Inset, each ring is 21:1
  // against the fill it sits on and nothing adjusts it away.
  primary:
    "bg-foreground text-paper hover:opacity-90 [--focus-ring:var(--color-paper)] [--focus-ring-offset:-5px]",
  // Paper fill, for a pill sitting on an Ink ground where outline would vanish.
  paper:
    "bg-paper text-foreground hover:opacity-90 [--focus-ring:var(--color-foreground)] [--focus-ring-offset:-5px]",
  outline: "border-foreground text-foreground border bg-transparent hover:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground bg-transparent",
} as const;

// h-16 = 64px, matching the reference's 63px pill. Width is intrinsic: these
// are centred pills sized by their label, not full-bleed bars. Pass `w-full`
// where a button really should span the column.
const BASE =
  "inline-flex h-16 items-center justify-center gap-2 rounded-full px-8 text-[1.0625rem] font-semibold transition-colors duration-200 ease-out active:scale-[0.98]";

type Props = { variant?: keyof typeof VARIANT; className?: string; children: ReactNode };

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props & ComponentProps<"button">) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props & ComponentProps<typeof Link>) {
  const cls = `${BASE} ${VARIANT[variant]} ${className}`;

  // An in-page anchor is the browser's job. Routing one through next/link sets
  // the hash without moving the page, which loses the CSS smooth scroll with it.
  if (typeof rest.href === "string" && rest.href.startsWith("#")) {
    return (
      <a {...(rest as ComponentProps<"a">)} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link className={cls} {...rest}>
      {children}
    </Link>
  );
}
