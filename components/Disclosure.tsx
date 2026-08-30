import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export type DisclosureRow = {
  icon: IconSvgElement;
  title: string;
  status?: string;
  body: string;
};

/**
 * A question and its answer, closed until asked. Native `<details>`: the
 * browser brings the toggle, the state and the keyboard behaviour, and there
 * is nothing here worth taking off it.
 *
 * Both Account screens run this list. It was written twice, once per view,
 * and the second copy had already started to drift.
 */
export function Disclosure({ icon, title, status, body }: DisclosureRow) {
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          >
            <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
          </span>
          <span className="text-foreground flex-1 text-[1.0625rem] font-semibold">
            {title}
          </span>
          {status && (
            <span className="text-foreground bg-card shrink-0 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium">
              {status}
            </span>
          )}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={17}
            strokeWidth={2}
            aria-hidden
            className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90"
          />
        </summary>
        <p className="text-muted-foreground pb-5 text-[0.9375rem] leading-relaxed">
          {body}
        </p>
      </details>
    </li>
  );
}
