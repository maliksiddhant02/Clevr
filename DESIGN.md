# CLEVR — Design System Plan

Hand-drawn / sketchbook aesthetic, applied to a payments product.
Companion to [TECHNICAL.md](TECHNICAL.md). Three screens, one token layer, four primitives.

---

## 0. What I'm designing into

Greenfield. The repo is `BUSINESS.md` + `TECHNICAL.md` — no components, no CSS, no
existing tokens to reconcile. So this is not an integration, it's a foundation, and
the only real risk is over-building it before there's an app to hold it.

Stack decisions this doc assumes (from TECHNICAL.md):

- **Next.js App Router + Tailwind v4.** Tokens live in `@theme` inside
  `app/globals.css`, not a `tailwind.config.ts`. If you scaffold on Tailwind v3
  instead, the same tokens go in `theme.extend` — identical names, identical output.
- **`next/font/google`** for Kalam + Patrick Hand. Self-hosted, no layout shift,
  no render-blocking request to fonts.gstatic on a stall's 4G.
- **`lucide-react`** for icons, `strokeWidth={2.5}`.
- No component library. shadcn/ui would fight the wobble on every primitive and
  we need four components, not forty.

### One deliberate deviation from the design system spec

The spec says to apply wobbly radii via inline `style={{ borderRadius: ... }}`.
I'm not doing that. Inline styles are the one-off style problem the brief asks me
to avoid: unthemeable, undiffable, and repeated in every file.

Same pixels, tokenized instead:

```css
--radius-wobble-1: 255px 15px 225px 15px / 15px 225px 15px 255px;
```

…gives you `rounded-wobble-1` as a normal Tailwind utility. Zero inline styles in
the codebase, one place to tune the wobble. This is the only place I depart from
the spec and it's a maintainability call, not an aesthetic one — the rendered
border-radius is byte-identical.

---

## 1. The tension, and how it resolves

A hand-drawn interface says *unfinished, playful, work-in-progress, low-stakes*.
That is exactly the wrong signal on the one screen where a stranger at a market
stall is deciding whether to send real money out of their real bank account to a
name they've never seen.

Wobbly borders and correction-marker red on a payment page can read as *scam* or
*prototype*. This is a genuine risk and it is worth naming before writing any CSS.

It does **not** mean toning the style down. It means splitting the surface into
two zones and being disciplined about which is which.

### Zone A — Personality (full sketchbook)

Merchant screens, pitch/marketing surfaces, empty states, success states,
decoration, headings, everything the merchant sees. The merchant knows what CLEVR
is, they're standing at their own till, and the sketchbook look is what makes this
memorable on a projector in front of three judges. Go all the way here.

### Zone B — Trust (sketchbook frame, plain contents)

The shopper's money block: the amount, the PayID, the reference code. Paper
background, wobbly card, handwritten heading around it — but the values inside are
plain, high-contrast, and unambiguous.

**The rule: anything the shopper must transcribe exactly renders in a system mono
stack, never in a handwritten font.**

```css
/* PayID, reference code, and the payable amount */
font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;
```

Patrick Hand's `1`/`l`, `0`/`O`, `5`/`S` are genuinely ambiguous at a glance. A
shopper mistyping a PayID sends money to nobody; a shopper mistyping the reference
means the green tick never fires and the demo dies on stage. This is a correctness
constraint wearing a typography hat.

(The reference codes are Crockford base32, which already excludes I, L, O and U —
the two decisions reinforce each other.)

The wobbly border, the paper, the hard shadow and the handwritten headline all
stay. Only the transcribable characters go plain. It still looks hand-drawn; it
just can't be mistyped.

---

## 2. The signature gesture

The design system's core idiom is **the correction marker**. CLEVR's core product
moment is **a price being corrected downward**. These are the same gesture, and
that coincidence is the whole visual identity — use it and don't invent a second one.

```
      ╭─ $9.95 ─╮        <- Kalam, huge, ink black
   $̶1̶0̶.̶0̶0̶              <- struck through, red marker, hand-drawn curve
```

Implementation notes that matter:

- The strike is an **inline SVG path**, not CSS `line-through`. A CSS strike is a
  perfectly straight line — it violates the one hard rule of this design system and
  it wastes the single most on-brand moment in the product.
- The path is a slight arc with a small overshoot past the last digit, the way a
  real pen overshoots. Draw it on mount with `stroke-dasharray` / `stroke-dashoffset`
  over ~350ms.
- Old price ~`text-2xl`, muted ink. New price ~`text-6xl`, Kalam 700. The size gap
  *is* the message.

This gesture appears on the shopper page and nowhere else. One signature, used once,
reads as confident. Used everywhere, it reads as a template.

---

## 3. Token layer

Everything centralizes here. One file, no exceptions.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Palette — single light mode, no dark variant */
  --color-paper:  #fdfbf7;   /* warm paper, page background      */
  --color-ink:    #2d2d2d;   /* soft pencil black, never #000    */
  --color-muted:  #e5e0d8;   /* erased pencil, dividers, fills   */
  --color-marker: #ff4d4d;   /* red correction marker, accent    */
  --color-pen:    #2d5da1;   /* blue ballpoint, focus + success  */
  --color-postit: #fff9c4;   /* post-it yellow, highlight cards  */

  /* Type */
  --font-display: var(--font-kalam), ui-rounded, cursive;
  --font-body:    var(--font-hand), ui-rounded, cursive;
  --font-exact:   ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;

  /* Wobble — three variants so repeated cards aren't identically irregular */
  --radius-wobble-1: 255px 15px 225px 15px / 15px 225px 15px 255px;
  --radius-wobble-2: 15px 225px 15px 255px / 225px 15px 255px 15px;
  --radius-wobble-3: 180px 20px 200px 25px / 20px 190px 20px 210px;
  --radius-wobble-sm: 30px 6px 26px 8px / 6px 28px 6px 30px;

  /* Hard offset shadows — no blur, ever */
  --shadow-hard-sm: 2px 2px 0 0 #2d2d2d;
  --shadow-hard:    4px 4px 0 0 #2d2d2d;
  --shadow-hard-lg: 8px 8px 0 0 #2d2d2d;
  --shadow-paper:   3px 3px 0 0 rgb(45 45 45 / 0.1);
}

body {
  background-color: var(--color-paper);
  background-image: radial-gradient(var(--color-muted) 1px, transparent 1px);
  background-size: 24px 24px;
  color: var(--color-ink);
  font-family: var(--font-body);
}
```

**Why three wobble radii.** A single shared radius string applied to eight cards
produces eight *identically* irregular shapes — the eye reads that as machine-made
instantly, which defeats the entire premise. Three variants, alternated by index,
costs nothing and is the difference between "hand-drawn" and "hand-drawn asset used
eight times."

**No dark mode.** The palette is literally paper. A dark sketchbook is a different
design system, and the merchant is standing outdoors in Brisbane sun anyway.
`color-scheme: light` on `:root`, done.

---

## 4. Primitives

Four. Every screen is built from these plus layout.

### `<Button>`
Per spec. Variants `primary` (white → marker red on hover) and `secondary`
(muted → pen blue on hover).

- `rounded-wobble-sm`, `border-[3px] border-ink`, `shadow-hard`
- hover: fill, `shadow-hard-sm`, `translate-x-[2px] translate-y-[2px]`
- active: `shadow-none`, `translate-x-[4px] translate-y-[4px]` — presses flat
- `transition-all duration-100`
- `min-h-12` (48px touch target), `text-xl` minimum — see §7 for why not `text-lg`

### `<Card>`
White or `postit` surface, `border-2 border-ink`, `rounded-wobble-{1|2|3}`,
`shadow-paper`. Props: `tilt` (`-2 … 2` deg), `decoration` (`none | tape | tack`),
`radius` (1–3).

Tape and tack are pure CSS/absolute-positioned divs. No images.

### `<CopyField>`
Not in the design system spec — invented for the shopper page, and the most
important component in the build.

A labelled value the shopper must transcribe or copy: PayID, amount, reference.

- Handwritten label above (`font-body`, ink)
- Value in `font-exact`, `text-2xl`, `tracking-wide`, ink on white
- Whole field is one tap target, `min-h-14`, wobbly border, `shadow-hard-sm`
- Tap copies → the button label swaps to "copied!" in Kalam with a 1-frame jiggle
- `aria-live="polite"` on the confirmation so it's announced, not just seen

### `<Tick>`
The success state. Animated hand-drawn checkmark, SVG path, `stroke-dasharray`
draw-on over ~400ms, `strokeLinecap="round"`.

**The tick is ballpoint blue (`--color-pen`), not green.** There is no green in this
palette, and adding one for a single state breaks a deliberately limited system.
A blue biro tick on paper is already the universal "done" mark — it's more on-brand
than green would be. Paired with **"PAID!"** in Kalam at `text-6xl`, because that
word has to be readable from the back of a room on a projector.

---

## 5. The three screens

Designed at 390px first. The merchant screen is a phone on a stall counter; the
shopper screen is a phone in a stranger's hand. Desktop exists only as the pitch
projector — which is a real requirement, not an afterthought (§6).

### `/m` — merchant keypad
Big paper page. Kalam heading "How much?". Amount displays huge in `font-exact`
(a till total is a transcribable number — Zone B rules apply). Keypad is a
`grid-cols-3` of wobbly `<Button>`s, each rotated 0.5–1° in an alternating pattern
so the grid never looks aligned. Keys `min-h-16` — thumb targets on a busy counter.
Primary action: a wide marker-red "Charge $10.00" button.

### `/m/[ref]` — QR + waiting → PAID
The QR sits on a white `<Card>` with `tilt={-2}` and tape decoration. QR itself is
**never wobbled, never rotated, never tinted** — it's a scannable target, and
prettiness that costs a scan costs the demo. The frame around it carries all the
personality.

Below: "waiting for payment…" with three bouncing pencil dots (staggered
`animation-delay`). On settlement the card flips to `<Tick>` + "PAID!" + the payer's
first name if the rail returned one — *"PAID! — thanks, Sam"* in Kalam is the single
most human moment in the demo and it costs one line.

### `/p/[ref]` — shopper page (Zone B)
The one screen a stranger sees. Order matters:

1. Kalam headline: **"Pay by bank, pay less."**
2. The correction gesture (§2) — struck `$10.00`, huge `$9.95`
3. One line, handwritten: *"straight from your bank account. no card, no fee."*
4. Three `<CopyField>`s: **Pay to** (PayID) · **Amount** · **Reference**
5. Small dashed-border note: *"open your banking app → pay someone → paste these"*
6. Savings counter (TECHNICAL.md §5), only on repeat visits: post-it yellow card,
   `tilt={1}`. Total in Kalam, large; the rate beneath it in body font, smaller:
   *"$2.35 back"* / *"about $60/year at this pace"*

The strikethrough at (2) and the counter at (6) are the two theme moments on this
screen — the hidden cost made visible, and the gain made forecastable (BRIEF.md).
They bookend the page deliberately: the first thing the shopper sees is what they
were losing, the last thing is what they're now keeping.

Trust details that earn their pixels: the merchant's real business name at the top,
and a plain line stating CLEVR never touches the money. Both in the handwritten
font — warmth is the right register for reassurance, as long as the *numbers* stay
plain.

---

## 6. Responsive, including the projector

Standard mobile-first stacking, plus one constraint the design system doc doesn't
know about:

**`/m/[ref]` must be legible from ~10m at 1080p.** At `lg:` and up, the QR card,
the tick and "PAID!" scale to roughly double. This screen is the demo's climax
projected behind you — if the judges can't see the tick land, the entire build
didn't happen. Everything else on the page shrinks or hides at that breakpoint.

Decorative elements (bouncing circle, dashed arrows, squiggle connectors) are
`hidden md:block` per spec. Rotations soften from `-rotate-2` to `-rotate-1` below
`md` so tilted cards don't clip the viewport on a 390px screen.

---

## 7. Accessibility — the non-negotiables

This style is a legibility risk by construction. Six rules, none optional:

1. **Patrick Hand never below 18px.** Body copy is `text-lg` minimum. Handwritten
   fonts lose their distinguishing strokes at small sizes far earlier than a grotesk.
2. **Marker red never on small text.** `#ff4d4d` on white is ~3.4:1 — it fails
   WCAG AA for body copy. Red is for borders, fills, strikes, and large bold text
   only. Same for white-on-red button labels: hence `text-xl` (20px) minimum on
   buttons rather than the spec's `text-lg`, which lands just under the large-text
   threshold. Ink on paper is ~14:1 and carries all real reading.
3. **Never rotate anything the user must read carefully.** Cards, tags and
   decorations tilt. Amounts, PayIDs, and reference codes sit at exactly 0°.
4. **Focus is visible and wobbly.** `outline: 3px solid var(--color-pen);
   outline-offset: 3px`. Never `outline-none` without a replacement — the keypad
   and the copy fields are the whole interface.
5. **`prefers-reduced-motion`** kills the bounce, the jiggle, the strike-draw and
   the tick-draw. The tick simply appears. Success must never *depend* on motion
   to be perceived.
6. **Success is not colour-alone.** The tick is accompanied by the word "PAID!"
   and an `aria-live="assertive"` announcement. A merchant with a colour-vision
   deficiency, glancing at a phone in sunlight, gets the same information.

---

## 8. What I'm not building

The design system describes a marketing landing page. We're shipping three
screens. Skipping, deliberately:

- speech-bubble testimonials, pricing cards with dashed-circle overlays, blog
  card treatments, drop caps, wavy nav underlines, footer line-through hovers
- the squiggly "How It Works" connector and the hand-drawn hero arrow
- grayscale→colour image transitions
- a dark mode

All of it belongs on the landing page you build *after* the hackathon, and every
one of them is an hour that isn't spent on the tick landing reliably.

Add when: there's a marketing site to put them on.
