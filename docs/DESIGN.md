# CLEVR — Design System

Deep forest green with one electric lime, applied to a mobile payments app.
Mobile only, light only.

The source of truth for every token is [`app/globals.css`](../app/globals.css).
This document carries the *rules and intent* behind them, which is what a token
file cannot tell you.

---

## 1. The idea

Forest green carries the weight. Lime is punctuation, never prose.

Almost every surface in the app is Paper white or Fog grey, and almost every
mark on it is Forest Ink. One electric lime appears per screen, always as a
fill and never as text on a light background, so the eye goes to exactly one
place. Where a screen needs emphasis it inverts to a solid Forest Ink block
with lime on top. That inversion is the entire emphasis system.

The style this replaces was the generic product-design default: a blue
gradient, radial glow blooms, soft shadows on white cards, a pulsing dot beside
uppercase mono labels, and every element on every screen fading up on mount.
Those are the marks of a page assembled rather than designed. The system now
has none of them, and that is deliberate rather than incidental:

- **No gradients.** Anywhere. Verified at runtime, zero elements.
- **No shadows.** A 1px hairline at `rgb(14 15 12 / 0.12)` is the only
  elevation. The shadow tokens are set to `none` so a stray `shadow-md` cannot
  reintroduce Tailwind's default and quietly break the system.
- **No blur, no glass, no texture overlays.**
- **One animation.** The savings line draws itself once. Nothing else moves on
  mount.

The composition matters more than any of that. A screen built as a vertical
stack of same-size rounded boxes reads as generated no matter how good the
palette is, because nothing in it was decided. So the screens are built as
**bands** instead: white space, then a number large enough to be the whole
screen, then a full-bleed colour band that runs edge to edge. A card is for
content that genuinely groups; it is not the default container.

Full bleed is `-mx-5 px-5` against the shell's padding, written inline where it
is used. A band that ends a tab screen adds `-mb-28 pb-32` so it runs to the
bottom edge with the tab-bar clearance inside it, rather than leaving a strip of
white below it.

## 2. Tokens

| Token | Value | Role |
|---|---|---|
| `background` | `#ffffff` | Paper. Page canvas. |
| `foreground` | `#163300` | Forest Ink. Headings, emphasis, icons, dark grounds. |
| body text | `#454745` | Charcoal, set on `body`. Softer than black, never harsh. |
| `card` | `#e8ebe6` | Fog. Card surfaces, sitting flat on Paper. |
| `muted` | `#e2f6d5` | Linen Mist. Discs, chips, chart washes, hover states. |
| `muted-foreground` | `#5b5d5b` | Secondary text. **6.6:1 on Paper, 5.5:1 on Fog. Measured.** |
| `border` | `rgb(14 15 12 / 0.12)` | The hairline. Works on Paper and on Fog. |
| `lime` | `#9fe870` | Fills and active states only. |
| `on-forest` | `#c7d8b8` | Secondary text on Forest Ink bands. 9.3:1. |
| `success` | `#054d28` | Spruce. Money the shopper kept. Nothing else. |

`muted-foreground` is one step darker than the reference palette's Slate
(`#6a6c6a`). Slate measures 4.40:1 on Fog, which fails AA, and cards in this
app are Fog. The token is the reference intent at a passing value.

**Radii.** Pills (`rounded-full`) on buttons, tabs, chips and avatars. 10px
(`rounded-xl`, `rounded-lg`) on controls and tiles. 28px (`rounded-2xl`) on
cards. Sharp corners appear nowhere.

## 3. Type

One face, two jobs. Inter ships as a variable font, so the second job is free.

- **`.display`** (Inter 900, `-0.04em`, `line-height: 0.92`) for screen titles,
  the brand mark, hero numbers and section openers. Screen titles run at 44px,
  which is meant to feel loud. The class deliberately sets no colour so it
  inverts cleanly on Forest Ink grounds.
- **Inter 400/500/600** for everything else. Hierarchy comes from weight as
  much as from size.
- **`tabular-nums`** on every number a reader compares or scans: money,
  percentages, counts, durations. Aligned digits are a correctness feature in a
  payments app, not a typographic flourish.
- **`font-mono`** on the payment reference, and nothing else. It is the one
  value a human reads back aloud, and a misread reference means the merchant's
  tick never fires. Monospace anywhere else is a costume.

**Money display:** `splitAud()` in [`lib/money.ts`](../lib/money.ts) renders
dollars large and cents small (`$2` + `.35`). Every screen uses it, so money
looks like money everywhere.

## 4. Components

All in [`components/`](../components). Variants are `const` maps of literal
class strings. No `cva`, no `tailwind-merge`. Six components with two or three
variants each do not justify two dependencies, and the map is greppable.

| Component | Notes |
|---|---|
| `Card` | A Fog surface, no border, no shadow, no variants. |
| `Button` / `ButtonLink` | Lime pill, outlined pill, ghost. `h-12` = 48px. |
| `TabBar` | Fixed, solid Paper, hairline top. Active tab is a lime pill behind the icon. |
| `ScreenHeader` | Outlined back pill plus an optically centred title. |
| `PaymentRow` | Avatar, merchant, timestamp, amount, kept-delta. |
| `Avatar` | Monogram on a tinted disc, tint hashed from the name. |
| `AreaChart` / `DonutChart` | Hand-rolled SVG. See §6. |

> **Tailwind gotcha:** class names are only detected as whole literal strings.
> A template-literal class name silently renders unstyled. Keep variants in
> literal maps.

Colour classes do not stack. Tailwind resolves `text-foreground text-success`
by stylesheet order, not by the order you wrote them, so a conditional colour
has to pick exactly one class. See the detail rows in
[`app/payment/[ref]/page.tsx`](../app/payment/[ref]/page.tsx).

## 5. Motion

One keyframe in `globals.css`, no animation library:

- `.draw-line` draws the chart stroke in once via `stroke-dashoffset`.

That is the whole motion system. Everything else is a 200ms colour transition
on hover and focus. An entrance animation on every child of every screen reads
as a template, and it was removed for that reason.

Everything is disabled under `prefers-reduced-motion`. **Nothing may be
required to understand the interface.** Motion is confirmation, never
information.

## 6. Charts

Hand-rolled SVG, no charting library (Recharts would be ~100KB for two charts).

- `AreaChart` uses a smoothed path through midpoints, a flat Linen Mist fill, a
  Forest Ink stroke, and a dashed drop-line and marker at the peak. It takes no
  `id` prop: the gradient defs that once needed a document-unique id are gone.
- `DonutChart` uses `stroke-dasharray` arcs on concentric circles. Colours are
  a tonal green ramp with a single lime slice, not a rainbow.

Both carry `role="img"` and a text alternative describing the actual values.

## 7. Rules that aren't negotiable

1. **Contrast is measured, not eyeballed.** Every text node on every route was
   checked in the browser against its resolved background. Zero failures. Any
   new text colour gets the same treatment before it ships.
2. **Focus is always visible.** 2px Forest Ink outline, 2px offset. Never
   `outline-none` without a replacement; the tab bar and the list rows are the
   whole app.
3. **Touch targets 44px or larger.** Measured in the browser on every route,
   not assumed. Buttons 48px, tab items 48px, icon buttons 44px, the range
   toggle 44px, rows 44px and up. `See all` carries `-my-3.5 py-3.5` for the
   same reason: a 19px text link is not a target.
4. **Lime is a fill, never text on a light surface.** Its contrast on Paper is
   1.5:1. On Forest Ink it is the emphasis colour.
5. **One lime element per screen region.** Two lime marks near each other and
   neither one reads as the accent.
6. **No emoji in the UI.** Emoji placeholders read as filler; monogram avatars
   are what a payments app actually falls back to when a logo is missing.
7. **`aria-live` on anything that changes without a tap.** Currently the range
   toggle; later, the merchant's settlement tick.

## 8. Voice

Plain, declarative, professional. State the fact and stop.

The copy was rewritten for this reason. Em dashes are gone from every
user-facing string, along with the constructions that came with them: the
dramatic aside ("Nobody has ever shown it to you"), the balanced pair ("a slice
with you, and the rest with them"), the cinematic detail ("while you're still
standing there"). Australian spelling throughout.

Prices, fees and settlement times are claims about money. Write them the way a
bank would.

## 9. Mobile only

There is no desktop layout, on purpose. Both real surfaces are phones: a stall
owner's handset and a stranger's handset. The app shell is a centred 430px
column set once in [`app/layout.tsx`](../app/layout.tsx). Design at 390px. No
`md:` or `lg:` variants anywhere.

`html` sets `scrollbar-gutter: stable`. Without it a short screen (`/pay`,
`/account`) has no scrollbar and a long one does, so the centred column jumps
sideways on every tab change. The scrollbar itself is themed from the palette
rather than left at the browser default.

The pitch projector is solved by screen-mirroring the actual phone rather than
by building a desktop view of it, and mirroring proves the judges are watching
the same screen the stranger just paid on.

`ponytail: no desktop layout, no breakpoints. Add when a merchant asks for a tablet till, not before.`
