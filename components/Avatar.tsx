// Monogram avatars. Real merchants have logos; sample data doesn't, and emoji
// placeholders read as filler. Initials on a tinted disc is what a payments app
// actually falls back to when a logo is missing.

const TINTS = [
  "bg-[#e2f6d5] text-[#163300]",
  "bg-[#163300] text-[#9fe870]",
  "bg-[#e8ebe6] text-[#054d28]",
  "bg-[#9fe870] text-[#163300]",
] as const;

function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function tintFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash + ch.charCodeAt(0)) % 997;
  return TINTS[hash % TINTS.length];
}

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "h-14 w-14 text-base" : "h-11 w-11 text-[0.8125rem]";
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[0.02em] ${box} ${tintFor(name)}`}
    >
      {initials(name)}
    </span>
  );
}
