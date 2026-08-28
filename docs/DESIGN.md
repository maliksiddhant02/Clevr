# CLEVR — Design System

Minimalist Modern, applied to a mobile payments app. Mobile only, light only.

The source of truth for every token is [`app/globals.css`](../app/globals.css).
This document carries the *rules and intent* behind them — the things a token
file can't tell you.

---

## 1. The idea

Clarity through structure, character through bold detail. Restraint in quantity,
confidence in execution. Whitespace directs attention; motion communicates rather
than decorates; colour is concentrated into one electric accent instead of
scattered.

The trap this style falls into is sterility — a white background, grey text, safe
choices, forgettable. Three things keep it out of that trap:

- **The signature gradient** `#0052FF → #4D7CFF`, on buttons, icon tiles, the
  chart stroke and the donut ramp. A gradient reads as alive where a flat fill
  reads as a swatch.
- **Inverted sections** — deep slate ground with light text and a dot texture.
  Used exactly twice in the whole app (Home's hidden-fee card, Insights' fees-kept
  number). A spotlight used everywhere is just lighting.
- **Texture over flatness** — an accent bloom behind hero numbers, a dot grid on
  inverted surfaces. Felt more than seen.

## 2. Tokens

| Token | Value | Role |
|---|---|---|
| `background` | `#FAFAFA` | Canvas. Warm off-white, easier than pure white. |
| `foreground` | `#0F172A` | Text and inverted-section grounds. Deep slate, never black. |
| `muted` | `#F1F5F9` | Secondary surfaces, avatar discs, segmented-control track. |
| `muted-foreground` | `#64748B` | Secondary text. **4.56:1 on canvas — measured, passes AA.** |
| `border` | `#E2E8F0` | Card and divider strokes. |
| `card` | `#FFFFFF` | Elevated surfaces. Pure white is what creates lift. |
| `accent` | `#0052FF` | Actions, links, active tab, chart stroke. |
| `accent-secondary` | `#4D7CFF` | Gradient endpoint only. |
| `success` | `#10B981` | Money the shopper kept. Nothing else. |

Shadows are a five-step diffuse scale (`shadow-sm` → `shadow-xl`) plus
accent-tinted `shadow-accent` / `shadow-accent-lg` for gradient surfaces. No hard
offsets, no heavy blurs.

Radii: `rounded-xl` (12px) for controls, `rounded-2xl` (16px) for cards,
`rounded-full` for avatars, pills and the segmented control.

## 3. Type

Three faces, one job each:

- **Calistoga** (`font-display`) — screen titles and the brand mark. Warm serif,
  the personality voice. Never below 18px, never for long copy.
- **Inter** (`font-sans`) — everything else. Real weights (400/500/600), so
  hierarchy comes from weight rather than size alone.
- **JetBrains Mono** (`font-mono`) — section labels, and **any value a human reads
  back exactly**: payment references, PayIDs, percentages, amounts in detail rows.

That last rule is a correctness rule wearing a typography hat. A mistyped
reference means the merchant's tick never fires.

**Money display:** `splitAud()` in [`lib/money.ts`](../lib/money.ts) renders
dollars large and cents small (`$2` + `.35`). Every screen uses it, so money
looks like money everywhere.

## 4. Components

All in [`components/`](../components). Variants are `const` maps of literal class
strings — no `cva`, no `tailwind-merge`. Six components with 2–3 variants each
don't justify two dependencies, and the map is greppable.

| Component | Notes |
|---|---|
| `Card` | `card` / `muted` / `inverted`. Inverted carries the dot texture. |
| `Button` / `ButtonLink` | Gradient primary, outline, ghost. `h-12` = 48px. |
| `TabBar` | Fixed, translucent, `backdrop-blur`. Active tab is accent + heavier icon stroke. |
| `ScreenHeader` | Back chevron + optically centred title, for pushed screens. |
| `PaymentRow` | Avatar, merchant, timestamp, amount, kept-delta. |
| `Avatar` | Monogram on a tinted disc, tint hashed from the name. |
| `SectionLabel` | The signature pill badge: accent dot, mono, uppercase, wide tracking. |
| `AreaChart` / `DonutChart` | Hand-rolled SVG. See §6. |

> **Tailwind gotcha:** class names are only detected as whole literal strings.
> `` `rounded-${n}` `` silently renders unstyled. Keep variants in literal maps.

## 5. Motion

CSS keyframes in `globals.css`, no animation library:

- `.stagger` — children fade up on mount with nth-child delays. App screens are
  short; a scroll observer would be a dependency earning nothing.
- `.pulse-dot` — the live indicator in section labels.
- `.draw-line` — the chart stroke draws itself once via `stroke-dashoffset`.

Everything is disabled under `prefers-reduced-motion`. **Nothing may be required
to understand the interface** — motion is confirmation, never information.

## 6. Charts

Hand-rolled SVG, no charting library (Recharts would be ~100KB for two charts).

- `AreaChart` — smoothed path through midpoints, gradient fill, dashed drop-line
  and marker at the peak. Gradient `id`s are document-global, so each instance
  takes an `id` prop.
- `DonutChart` — `stroke-dasharray` arcs on concentric circles. Colours are an
  accent ramp, not a rainbow: one colour with variations tells a story, five
  unrelated hues tell none.

Both carry `role="img"` and a text alternative describing the actual values.

## 7. Rules that aren't negotiable

1. **Contrast is measured, not eyeballed.** Body 17.1:1, secondary 4.56:1. Any new
   text colour gets checked before it ships.
2. **Focus is always visible** — 2px accent outline, 2px offset. Never
   `outline-none` without a replacement; the tab bar and list rows are the app.
3. **Touch targets ≥ 44px.** Buttons are 48px, tab items 48px, rows 44px+.
4. **Gradients are atmosphere, never a text background.** Blooms sit behind
   `relative` content, never under the characters.
5. **No emoji in the UI.** Emoji placeholders read as filler; monogram avatars are
   what a payments app actually falls back to when a logo is missing.
6. **`aria-live` on anything that changes without a tap** — currently the range
   toggle; later, the merchant's settlement tick.

## 8. Mobile only

There is no desktop layout, on purpose. Both real surfaces are phones: a stall
owner's handset and a stranger's handset. The app shell is a centred 430px column
set once in [`app/layout.tsx`](../app/layout.tsx). Design at 390px. No `md:` or
`lg:` variants anywhere.

The pitch projector is solved by screen-mirroring the actual phone, not by
building a desktop view of it — and mirroring proves the judges are watching the
same screen the stranger just paid on.

`ponytail: no desktop layout, no breakpoints. Add when a merchant asks for a tablet till — not before.`
