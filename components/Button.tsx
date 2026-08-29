import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const VARIANT = {
  // Ink fill, Paper text. The fill does all the work: no border, no shadow.
  primary: "bg-foreground text-paper hover:opacity-90",
  // Paper fill, for a pill sitting on an Ink ground where outline would vanish.
  paper: "bg-paper text-foreground hover:opacity-90",
  outline: "border-foreground text-foreground border bg-transparent hover:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground bg-transparent",
} as const;

// h-16 = 64px, matching the reference's 63px pill. Width is intrinsic: these
// are centred pills sized by their label, not full-bleed bars. Pass `w-full`
// where a button really should span the column.
const BASE =
  "inline-flex h-16 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold transition-colors duration-200 ease-out active:scale-[0.98]";

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
  return (
    <Link className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
