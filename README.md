# CLEVR

Tap to pay without the card networks. The merchant keeps the fee and splits it
with you.

```bash
npm run dev
```

Mobile only — design at 390px. There is no desktop layout.

## Docs

| | |
|---|---|
| [BUSINESS.md](docs/BUSINESS.md) | The idea, the model, the income streams |
| [BRIEF.md](docs/BRIEF.md) | Hackathon theme, pillars, judges |
| [TECHNICAL.md](docs/TECHNICAL.md) | Architecture, the rail interface, build order |
| [DESIGN.md](docs/DESIGN.md) | Tokens, primitives, the three screens |

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · TypeScript

Design tokens live in one place: [`app/globals.css`](app/globals.css). No inline
styles. Note that Tailwind only scans for whole literal class names — build
`rounded-wobble-1` as a literal string, never `` `rounded-wobble-${n}` ``, or it
renders square and silently.
