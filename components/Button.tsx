import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const VARIANT = {
  primary:
    "from-accent to-accent-secondary text-white bg-gradient-to-r shadow-sm hover:shadow-accent-lg hover:brightness-110",
  outline:
    "border-border text-foreground hover:border-accent/30 border bg-transparent hover:bg-muted hover:shadow-sm",
  ghost: "text-muted-foreground hover:text-foreground bg-transparent",
} as const;

// h-12 = 48px, comfortably past the 44px touch minimum.
const BASE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[0.9375rem] font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

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
