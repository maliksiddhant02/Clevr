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
| [HANDOFF.md](docs/HANDOFF.md) | **Start here** — state of play, how to run it, what's next |
| [BUSINESS.md](docs/BUSINESS.md) | The idea, the model, the income streams |
| [BRIEF.md](docs/BRIEF.md) | Hackathon theme, pillars, judges |
| [TECHNICAL.md](docs/TECHNICAL.md) | Architecture, the rail interface, build order |
| [DESIGN.md](docs/DESIGN.md) | Tokens, primitives, the rules behind them |

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · TypeScript

Design tokens live in one place: [`app/globals.css`](app/globals.css). Tailwind
only matches whole literal class names, so keep variants in `const` maps — a
template like `` `rounded-${n}` `` renders unstyled and silently.
