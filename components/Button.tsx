import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const VARIANT = {
  // text-xl minimum: white-on-marker is only AA-legible at large sizes.
  primary: "bg-white hover:bg-marker hover:text-white",
  secondary: "bg-muted hover:bg-pen hover:text-white",
} as const;

const BASE =
  "border-ink rounded-wobble-sm shadow-hard inline-flex min-h-12 items-center justify-center gap-2 border-[3px] px-5 text-xl transition-all duration-100 hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

type Props = {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props & ComponentProps<"button">) {
  return (
    <button
      className={`${BASE} ${VARIANT[variant]} ${className}`}
      {...rest}
    >
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
