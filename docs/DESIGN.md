# CLEVR — Design System

One saturated yellow, one near-black, applied to a mobile payments app and its
landing page. Mobile only, light only.

The source of truth for every token is [`app/globals.css`](../app/globals.css).
This document carries the *rules and intent* behind them, which is what a token
file cannot tell you.

---

## 1. The idea

**The page is the accent.** Sun yellow runs edge to edge on every screen, and
Ink is the only mark on it. There is no white canvas to fall back to, so the
system cannot drift into the generic product-design default: a white page, a
blue button, a stack of soft-shadowed cards. On a yellow ground those moves are
not available, and every decision has to be made deliberately.

Emphasis works by **inversion**. Where a region needs to carry weight it becomes
a solid Ink block with Paper type on it, and Sun returns inside that block as
the single accent. That inversion is the entire emphasis system: Sun ground with
Ink type, or Ink ground with Paper type and one Sun mark. Nothing else.

Consequences that are not negotiable:

- **No gradients.** Anywhere.
- **No shadows.** A 1px hairline at `rgb(16 16 16 / 0.18)` is the only
  elevation. The shadow tokens are set to `none` so a stray `shadow-md` cannot
  reintroduce Tailwind's default and quietly break the system.
- **No blur, no glass, no texture overlays.**
- **One animation.** The savings line draws itself once. Nothing else moves on
  mount.

The composition matters more than any of that. A screen built as a vertical
stack of same-size rounded boxes reads as generated no matter how good the
palette is, because nothing in it was decided. So screens are built as **bands**
instead: air, then a headline large enough to be the whole screen, then a solid
Ink block that runs to both edges of the column. A card is for content that
genuinely groups; it is not the default container.

Full bleed is `-mx-5 px-5` against the shell's padding, written inline where it
is used. A band that ends a tab screen adds `-mb-28 pb-32` so it runs to the
bottom edge with the tab-bar clearance inside it, rather than leaving a strip of
yellow below it.

## 2. Tokens

| Token | Value | Role |
|---|---|---|
| `background` | `#ffe500` | Sun. The page canvas, edge to edge, every route. |
| `foreground` | `#101010` | Ink. Type, fills, dark grounds, icons. |
| body text | `#2b2823` | Graphite, set on `body`. Softer than Ink, never harsh. |
| `paper` | `#ffffff` | Type and pills **on** Ink. |
| `card` | `#ffffff` | Paper card surfaces sitting on Sun. |
| `muted` | `#f2d400` | Deep Sun. Chart washes, tracks, chips, hover states. |
| `muted-foreground` | `#4a4530` | Secondary text. **7.2:1 on Sun, 9.1:1 on Paper. Measured.** |
| `border` | `rgb(16 16 16 / 0.18)` | The hairline. Works on Sun and on Paper. |
| `sun` | `#ffe500` | The accent **on Ink grounds only**. Same value as the page. |
| `on-ink` | `#e9e7de` | Secondary text on Ink blocks. 13.6:1. |
| `success` | `#054d28` | Spruce. Money the shopper kept. Nothing else. |

`sun` and `background` hold the same value on purpose, and they are two tokens
on purpose. `background` names the canvas; `sun` names the accent that appears
inside an inverted block. Writing `text-sun` on a Sun ground is the one way to
make an element vanish, and having a separate name makes that mistake visible in
review.

`muted-foreground` is the one colour that had to be recomputed rather than
picked. Mid-greys that look correct on white measure under 3:1 against Sun,
because Sun's luminance is close to Paper's. The token is a warm dark that
passes on both surfaces.

**Radii.** Pills (`rounded-full`) on buttons, tabs, chips and avatars. 10px
(`rounded-xl`, `rounded-lg`) on controls and tiles. 28px (`rounded-2xl`) on
cards, media blocks and the Ink bands. Sharp corners appear nowhere.

## 3. Type

One face, two jobs. Inter ships as a variable font, so the second job is free.

- **`.display`** (Inter 900, `-0.04em`, `line-height: 0.92`) for screen titles,
  the brand mark, hero numbers and section openers. Landing sections open at
  40px and the hero runs at 46px, which is meant to feel loud. Headlines break
  across two or three short lines with explicit `<br />` rather than wrapping on
  their own: at this weight the shape of the break is part of the design.
  The class deliberately sets no colour so it inverts cleanly on Ink grounds.
- **Inter 400/500/600** for everything else. Hierarchy comes from weight as
  much as from size.
- **`tabular-nums`** on every number a reader compares or scans: money,
  percentages, counts, durations. Aligned digits are a correctness feature in a
  payments app, not a typographic flourish.
- **`font-mono`** on the payment reference and the card digits, and nothing
  else. The reference is the one value a human reads back aloud, and a misread
  reference means the merchant's tick never fires. Monospace anywhere else is a
  costume.
- **The wordmark is lowercase** (`clevr`) in running UI and the landing page,
  uppercase (`CLEVR`) in prose and legal copy. It closes the landing page as a
  7rem sign-off band, `aria-hidden`, because it is a mark and not a link.

**Money display:** `splitAud()` in [`lib/money.ts`](../lib/money.ts) renders
dollars large and cents small (`$2` + `.35`). Every screen uses it, so money
looks like money everywhere.

## 4. Components

All in [`components/`](../components). Variants are `const` maps of literal
class strings. No `cva`, no `tailwind-merge`. Seven components with two to four
variants each do not justify two dependencies, and the map is greppable.

| Component | Notes |
|---|---|
| `Card` | A Paper surface on Sun, no border, no shadow, no variants. |
| `Button` / `ButtonLink` | Four pills: Ink, Paper, outlined, ghost. `h-12` = 48px. |
| `CardRail` | Snap-scrolling Ink media blocks plus position dots. |
| `TabBar` | Fixed, solid Sun, hairline top. Active tab is an Ink pill behind the icon. |
| `ScreenHeader` | Outlined back pill plus an optically centred title. |
| `PaymentRow` | Avatar, merchant, timestamp, amount, kept-delta. |
| `Avatar` | Monogram on a tinted disc, tint hashed from the name. |
| `AreaChart` / `DonutChart` | Hand-rolled SVG. See §6. |

`primary` is the Ink pill with Paper type. `paper` is its inverse and exists for
one situation: a pill sitting **on** an Ink block, where `outline` would draw an
Ink border against Ink and disappear. Use `paper` only there.

> **Tailwind gotcha:** class names are only detected as whole literal strings.
> A template-literal class name silently renders unstyled. Keep variants in
> literal maps.

Colour classes do not stack. Tailwind resolves `text-foreground text-paper` by
stylesheet order, not by the order you wrote them, so a conditional colour has
to pick exactly one class per branch. See the range toggle in
[`components/SavingsChart.tsx`](../components/SavingsChart.tsx) and the detail
rows in [`app/payment/[ref]/page.tsx`](../app/payment/[ref]/page.tsx).

## 5. Motion

One keyframe in `globals.css`, no animation library:

- `.draw-line` draws the chart stroke in once via `stroke-dashoffset`.

That is the whole motion system. Everything else is a 200ms colour transition on
hover and focus, plus the rail's position dot widening as you scroll. An
entrance animation on every child of every screen reads as a template, and it
was removed for that reason.

Everything is disabled under `prefers-reduced-motion`. **Nothing may be required
to understand the interface.** Motion is confirmation, never information.

## 6. Media, rails and charts

**Media blocks.** The landing page's hero, product card, rail slides and press
block are solid Ink rectangles at `rounded-2xl` with type laid on them. They are
not placeholders waiting for photography. A stock photo would say less than the
sentence already sitting on the block, and a photo-led hero is exactly the
generic move the palette exists to prevent. If real photography ever lands, it
goes inside the same rounded rectangle at the same radius, with the type kept on
an Ink scrim so contrast stays measurable.

**Rails.** Horizontal scrolling is the platform's: `overflow-x-auto` plus
`snap-x snap-mandatory`, with `.rail` hiding the scrollbar. `CardRail` holds one
piece of state, the index of the lit dot, and the arithmetic behind it lives in
[`lib/rail.ts`](../lib/rail.ts) so it can be tested without a browser. It
measures progress across the *scrollable* distance, not the content width: the
last slide never centres, because the rail runs out of scroll before it gets
there, so a content-width formula drifts on the final dot. The rail is
`tabIndex={0}` with an `aria-label` so it is keyboard-scrollable; the dots are
`aria-hidden` because they report position, they do not control it.

**Charts.** Hand-rolled SVG, no charting library (Recharts would be ~100KB for
two charts).

- `AreaChart` uses a smoothed path through midpoints, a flat Deep Sun fill, an
  Ink stroke, and a dashed drop-line and marker at the peak. It takes no `id`
  prop: the gradient defs that once needed a document-unique id are gone.
- `DonutChart` uses `stroke-dasharray` arcs on concentric circles. Colours are a
  tonal Ink ramp with a single Sun slice, not a rainbow. The ramp is read on a
  Paper card, so it darkens away from the card rather than from the page.

Both carry `role="img"` and a text alternative describing the actual values.

## 7. Rules that aren't negotiable

1. **Contrast is measured, not eyeballed.** Sun is a bright ground, which makes
   it unforgiving: anything lighter than roughly `#4a4530` fails on it. Every
   new text colour is checked against its resolved background before it ships.
2. **Focus is always visible.** 2px Ink outline, 2px offset. Never
   `outline-none` without a replacement; the tab bar and the list rows are the
   whole app.
3. **Touch targets 44px or larger.** Buttons 48px, tab items 48px, icon buttons
   44px, the menu disclosure 44px, footer links 44px, rows 44px and up. `See
   all` carries `-my-3.5 py-3.5` for the same reason: a 19px text link is not a
   target.
4. **Sun is a ground and an accent-on-Ink, never type on Sun.** Its contrast
   against itself is 1:1 and against Paper is 1.1:1.
5. **One accent per region.** Inside an Ink block, one Sun mark. Two Sun marks
   near each other and neither one reads as the accent.
6. **No emoji in the UI.** Emoji placeholders read as filler; monogram avatars
   are what a payments app actually falls back to when a logo is missing.
7. **`aria-live` on anything that changes without a tap.** Currently the range
   toggle; later, the merchant's settlement tick.
8. **Third-party names are never decoration.** Investor and press slots on the
   landing page carry invented placeholder names, marked as such in the source.
   A real logo on that page is a claim about who backs this company, and it does
   not go in until it is true.

## 8. Voice

Plain, declarative, professional. State the fact and stop.

Em dashes are gone from every user-facing string, along with the constructions
that came with them: the dramatic aside, the balanced pair, the cinematic
detail. Australian spelling throughout.

Prices, fees and settlement times are claims about money. Write them the way a
bank would. The landing page's headline claim carries an asterisk and the fine
print sets out what the number actually depends on: the merchant, the card, the
terminal, the acquirer. A rewards range without that paragraph is a number
pretending to be a promise.

## 9. Mobile only

There is no desktop layout, on purpose. Both real surfaces are phones: a stall
owner's handset and a stranger's handset, and the landing page is opened from a
phone too. The app shell is a centred 430px column set once in
[`app/layout.tsx`](../app/layout.tsx). Design at 390px. No `md:` or `lg:`
variants anywhere.

`html` sets `scrollbar-gutter: stable` and carries the Sun background itself, so
overscroll at either end of a long page stays yellow instead of flashing white.
Without the stable gutter a short screen (`/pay`, `/account`) has no scrollbar
and a long one does, so the centred column jumps sideways on every tab change.

The pitch projector is solved by screen-mirroring the actual phone rather than
by building a desktop view of it, and mirroring proves the judges are watching
the same screen the stranger just paid on.

`ponytail: no desktop layout, no breakpoints. Add when a merchant asks for a tablet till, not before.`

`ponytail: landing media blocks are solid Ink, not photography. Add art direction when there are real product shots, not stock.`
