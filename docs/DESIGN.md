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

There is one **Paper band**: the landing page's footer. It is the page's only
release from Sun, and it works for the same reason the Ink blocks do — the
ground changes, so Sun stops being the room and becomes an object in it, which
is why the brand tile in that footer reads as a mark rather than as more page.
Paper is a band, never a card stack, and never more than one per page.

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
| `background` | `#fff401` | Sun. The page canvas, edge to edge, every route. |
| `foreground` | `#000000` | Ink. Type, fills, dark grounds, icons. Also `body`. |
| `paper` | `#ffffff` | Type and pills **on** Ink, and the footer band's ground. |
| `card` | `#ffffff` | Paper card and band surfaces sitting on Sun. |
| `muted` | `#f2e800` | Deep Sun. Chart washes, tracks, chips, hover states. |
| `muted-foreground` | `#4a4a45` | Secondary text. **7.7:1 on Sun, 8.0:1 on Paper. Measured.** |
| `border` | `rgb(0 0 0 / 0.16)` | The hairline. Works on Sun and on Paper. |
| `sun` | `#fff401` | The accent **on Ink and Paper grounds only**. |
| `on-ink` | `#d9d9d9` | Secondary text on Ink blocks. 11.6:1. |
| `success` | `#054d28` | Spruce. Money the shopper kept. Nothing else. |

`sun` and `background` hold the same value on purpose, and they are two tokens
on purpose. `background` names the canvas; `sun` names the accent that appears
inside an inverted block. Writing `text-sun` on a Sun ground is the one way to
make an element vanish, and having a separate name makes that mistake visible in
review.

Sun, Ink and Paper are taken from the reference implementation's own custom
properties rather than sampled from a screenshot, so `#fff401` is exact. The
greys are not. The reference sets secondary text at `rgba(0,0,0,0.2)` and
`0.5`; the first measures 1.4:1 on Paper and the second about 3.5:1 on Sun, and
both fail. `muted-foreground` is a solid neutral chosen to pass on Sun *and*
Paper, which is the one place this system deliberately departs from what it
copies. Rule 1 in §7 outranks fidelity.

**Radii.** Pills (`rounded-full`) on buttons, tabs, chips and avatars. 10px
(`rounded-xl`, `rounded-lg`) on controls and tiles. 28px (`rounded-2xl`) on
cards, 40px (`rounded-3xl`) on media blocks and rail cards, and 52px on the
landing hero. The radius grows with the block rather than staying flat, which is
how the reference does it: its rail cards measure 40px and its hero 52px. Sharp
corners appear nowhere.

## 3. Type

One face, every job: **Cera Round Pro**, the same family the reference uses,
self-hosted from [`app/fonts/`](../app/fonts) and declared once in
[`app/layout.tsx`](../app/layout.tsx). Four static weights ship, because four
are used: Regular 400, Medium 500, Bold 700, Black 900. The family's Thin and
Light are not shipped.

There is **no 600**. CSS font matching resolves a `font-semibold` request upward
to the next weight it has, so 600 paints as Bold 700 from the real face rather
than falling back. That is the intended reading: the emphasis steps here are
400, 500, 700, 900, and `font-semibold` is a synonym for the 700 step.

> **Licence — read before this ships.** The files in `app/fonts/` are
> **Fontspring DEMO** cuts of Cera Round Pro, trial-licensed for evaluation
> only. They are not licensed for production use, for web embedding, or for
> redistribution, and this repository redistributes them by containing them.
> A production build needs a purchased licence from
> [TypeMates](https://www.typemates.com/fonts/cera-round-pro), dropped in over
> the same four filenames. Nothing else changes.
>
> The demo cuts carry **printable ASCII only** — 95 glyphs, no `©`, no curly
> quotes, no dashes beyond the hyphen. Worse, they are **sabotaged on purpose**:
> for 28 of those 95 they draw a "DEMO" pineapple instead of the real glyph.
>
> ```
> ! " # $ % & ' ( ) * + - / 4 < = > @ [ \ ] ^ _ ` { | } ~
> ```
>
> `$` and the digit `4` are both in that list, in a payments app. This is not a
> cosmetic limitation; an unrestricted demo cut renders money as pineapples.

**Outfit** sits behind Cera Round in the stack to catch exactly those glyphs.
It is geometric, spans the same 100–900, and is close enough that a stray
copyright mark or curly quote does not read as a different typeface mid-word.
System sans was doing that job before and it showed.

The local family carries a **`unicode-range`** restricting it to the characters
it actually draws — space, `,` `.` `:` `;` `?`, `A–Z`, `a–z` — so every
sabotaged and every absent glyph falls through to Outfit by construction rather
than by luck. All ten digits go to Outfit, not just the broken `4`: nine correct
digits beside one from a different face is worse in a column of money than ten
consistent ones. Prose is Cera Round; numbers and symbols are Outfit.

`adjustFontFallback: false` on the local font is what makes this work. Without
it Next generates a metric-adjusted local face and inserts it directly after
Cera Round, which catches everything the range gives up before Outfit is ever
reached.

Verified per glyph in the browser rather than assumed: all 28 sabotaged
characters and all ten digits measure identically to Outfit, while letters
still measure as Cera Round. Buying the licensed family means deleting the
`unicode-range` and the Outfit fallback with it.

- **`.display`** (900, `-0.019em`, `line-height: 1`) for screen titles,
  the brand mark, hero numbers and section openers. Landing sections open at
  40px and the hero runs at 46px, which is meant to feel loud. Headlines break
  across two or three short lines with explicit `<br />` rather than wrapping on
  their own: at this weight the shape of the break is part of the design.
  The class deliberately sets no colour so it inverts cleanly on Ink grounds.
- **400/500/700** for everything else. Hierarchy comes from weight as much as
  from size.
- **`tabular-nums`** on every number a reader compares or scans: money,
  percentages, counts, durations. Aligned digits are a correctness feature in a
  payments app, not a typographic flourish.
- **`font-mono`** on the payment reference and the card digits, and nothing
  else. The reference is the one value a human reads back aloud, and a misread
  reference means the merchant's tick never fires. Monospace anywhere else is a
  costume.
- **The wordmark is the artwork, not type.** `public/logo.png` is the `clevr`
  mark, black on transparent, used in the landing bar, the app header, the
  product card and the footer sign-off. On the one Ink ground it sits on, the
  card mock, it carries `invert`. `app/icon.png` is the Sun tile with the `C`
  mark and stands in for the footer's brand tile. Setting the wordmark as text
  is what the mark exists to replace.
- **The wordmark is lowercase** (`clevr`) in running UI and the landing page,
  uppercase (`CLEVR`) in prose and legal copy. It closes the landing page as an
  `aria-hidden` sign-off, sized by `clamp()` to fill the column rather than set
  at a fixed size: at 375px it measures 298px of glyph, which is the width the
  reference's own wordmark occupies there.

**The role scale.** Four sizes carry everything that is not display type:

| Size | Role |
|---|---|
| 13px (`0.8125rem`) | Caption. Fine print, timestamps, axis labels. |
| 15px (`0.9375rem`) | Meta. Secondary lines under a title, chart captions. |
| **17px (`1.0625rem`)** | **Body. The default, and what most of the interface is.** |
| 22px (`1.375rem`) | The one nav destination. |

This replaced nine sizes crowded between 11px and 20px. Nine steps across a 9px
span cannot carry nine different jobs, and the practical result was that no size
said *body*: the two most-used values were 13px and 15px, both below the 16px
web floor, so every screen read as caption text. Body now has an actual size and
the steps between roles are large enough to see.

Paragraph caps are set for 17px, not 15px. `max-w-[19rem]` at the old body size
squeezed the measure to roughly 40 characters; the caps moved out with the type.

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
| `Button` / `ButtonLink` | Four pills: Ink, Paper, outlined, ghost. `h-16` = 64px. |
| `CardRail` | Snap-scrolling Ink media blocks plus position dots. |
| `NavSheet` | The landing bar and its sheet. The one client component. |
| `TabBar` | Fixed, solid Sun, hairline top. Active tab is an Ink pill behind the icon. |
| `ScreenHeader` | Outlined back pill plus an optically centred title. |
| `PaymentRow` | Avatar, merchant, timestamp, amount, kept-delta. |
| `Avatar` | Monogram on a tinted disc, tint hashed from the name. |
| `StoreMarks` | The Apple and Google Play marks, drawn rather than borrowed. |
| `AreaChart` / `DonutChart` | Hand-rolled SVG. See §6. |

`primary` is the Ink pill with Paper type. `paper` is its inverse and exists for
one situation: a pill sitting **on** an Ink block, where `outline` would draw an
Ink border against Ink and disappear. Use `paper` only there.

The **Apple and Google Play marks** are drawn in
[`components/StoreMarks.tsx`](../components/StoreMarks.tsx) rather than taken
from the icon set. An icon set's "apple" and "play" are that set's
interpretation of a trademark; a store link is supposed to show the mark itself.
The Play mark is the one thing in this system carrying colour it did not choose,
because a monochrome Play mark reads as a generic triangle.

**Icons** are [Hugeicons](https://hugeicons.com) free, via `@hugeicons/react`
and `@hugeicons/core-free-icons`. Icons are data, not components:
`<HugeiconsIcon icon={BankIcon} size={20} strokeWidth={2} />`. They inherit
`currentColor`, so an icon never carries its own colour class; it takes the
colour of whatever ground it sits on, which is what keeps the inversion working.
`strokeWidth` is the emphasis dial, not size: the active tab goes 1.8 to 2.2 and
stays 20px.

Two marks are drawn rather than imported. The landing page's hamburger is two
rounded bars, the top one longer, because the ratio is the design and no icon in
a 6,000-icon set matches it exactly. The card chip is a Sun rectangle. Reaching
for an icon there would be dressing up a shape that is already correct.

**The landing nav** is `NavSheet`, and it is the only client component in the
app. It began as a `<details>` with no JavaScript, which is the right shape for
a disclosure, and it could not carry the animation: `::details-content` will not
resolve its own height once it is a grid or flex box, `height: auto` does not
interpolate on it even with `interpolate-size` set, and a pseudo-element cannot
take a descendant selector to work around either. What the state buys back is a
real `aria-expanded` button and an `inert` sheet, which is clearer than a
`<summary>` doing the same job implicitly.

The bar *is* the sheet's top edge, so opening swaps its ground from Sun to Paper
and the hamburger to a close mark without anything moving. The header reserves
the bar's 84px, so the sheet expands over the hero rather than pushing the page
down. The nav is pinned to the bottom of the box that clips it, so a collapsing
sheet loses its top link first and the store marks are the last thing to go;
anchoring to the top would eat the sheet from the wrong end.

The timing is traced off a screen recording of the reference rather than
guessed. Its sheet edge travels from 341px to 36px over 8 frames at 30fps, which
is **270ms**, and progress at the halfway point is 0.34 — `ease-in`, not
anything sharper. Opening is the same duration decelerating. The height is read
off the nav at the moment of the tap, so it cannot go stale across a resize or a
font swap.

The scrim dims but does not dismiss. That is deliberate: dismiss-on-scrim needs
a second handler, and the close mark is a 44px target in the bar the reader just
tapped.

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
