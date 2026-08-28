// Monogram avatars. Real merchants have logos; sample data doesn't, and emoji
// placeholders read as filler. Initials on a tinted disc is what a payments app
// actually falls back to when a logo is missing.

const TINTS = [
  "bg-[#0052ff]/10 text-[#0052ff]",
  "bg-[#4d7cff]/12 text-[#3763d4]",
  "bg-[#0f172a]/8 text-[#334155]",
  "bg-[#8ba6ff]/18 text-[#3d5bbf]",
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
