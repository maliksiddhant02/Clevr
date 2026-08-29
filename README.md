# CLEVR

Tap to pay from your bank without the card networks. The merchant avoids the
card fee and hands a share of it back to the shopper.

Live: **https://clevr-ten.vercel.app**

```bash
npm install
npm run dev            # http://localhost:3000
```

Mobile only — the layout is fixed at a 430px phone column. There is no
desktop version; on wide screens the app centres and stays phone-shaped.

## What's here

Two apps in one repo, split by route group:

| Route | Who | What |
|---|---|---|
| `/` | Landing | Marketing page + waitlist (QR at bottom → scannable) |
| `/app`, `/activity`, `/insights`, `/account` | Shopper | Home, receipts, insights, profile |
| `/pay` → `/p/[ref]` → `/p/[ref]/done` | Shopper | Scan a merchant QR, confirm, receipt with cape-sweep success animation |
| `/m`, `/m/[ref]`, `/m/activity`, `/m/payouts` | Merchant | Till, sale QR, activity, payouts |
| `/join` | Both | Sign-in / sign-up |

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind v4** — design tokens in `app/globals.css`
- **Supabase** — waitlist storage (server action posts via REST)
- **Motion** (`motion/react`) — hero fade, dialog, payment success burst
- **dotLottie** — confetti + tick lotties on the success screen
- **TypeScript**

Deployed on **Vercel** with git-linked auto-deploys on every push to `main`.

## Configuration

Create `.env.local`:

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
RAIL=mock                    # or `up` for the real Up Bank rail
UP_PAYID=merchant@up.com.au  # only when RAIL=up
UP_TOKEN=<token>             # only when RAIL=up
```

The same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be set in
**Vercel → Settings → Environment Variables** for Production + Preview.

The Supabase schema:

```sql
create table waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);
```

Service role bypasses RLS; the insert only ever happens server-side from the
`joinWaitlist` action in `app/actions/waitlist.ts`, so the key stays off the
client.

## Design

Tokens live in one place: [`app/globals.css`](app/globals.css). Tailwind v4
only matches literal class names, so keep variants in `const` maps —
`` `rounded-${n}` `` renders unstyled and silently.

Colour: Sun yellow (#fff401) is the page, Ink (#000) is every mark, Paper
(#fff) is the card and modal surface. There are no gradients, no shadows —
elevation is a hairline border. See [`DESIGN.md`](docs/DESIGN.md).

## Docs

| | |
|---|---|
| [BUSINESS.md](docs/BUSINESS.md) | The idea, the model, income streams |
| [BRIEF.md](docs/BRIEF.md) | Hackathon theme, pillars, judges |
| [TECHNICAL.md](docs/TECHNICAL.md) | Architecture, the rail interface, build order |
| [DESIGN.md](docs/DESIGN.md) | Tokens, primitives, the rules behind them |
| [MENTOR_FEEDBACK.md](docs/MENTOR_FEEDBACK.md) | Notes from mentors |

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run start     # serve the build
npm run lint      # eslint
```
