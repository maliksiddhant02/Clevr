# CLEVR — Technical Plan

Hackathon build. Next.js (App Router) + Supabase. One repo, one Vercel deploy.
Real money, real bank, real green tick on stage.

---

## 1. The one hard problem

Everything else is CRUD. The demo lives or dies on this:

> A stranger pays $9.95 from their own banking app. How does our merchant screen
> know, within seconds, without us touching the money?

Options, honestly:

| Option | Real money | Latency | Onboarding | Verdict |
|---|---|---|---|---|
| Azupay / Monoova / Zepto webhook | yes | ~1s | days–weeks, KYC | **production answer**, not a weekend answer |
| Basiq / CDR open banking | yes | 5–60s | needs accreditation | blocked |
| Merchant taps "confirm" manually | yes | human | none | kills the magic |
| **Up Bank personal API** | **yes** | **~1–3s** | **minutes, self-serve token** | **demo answer** |

**Decision: Up Bank is the demo rail.** Up is an AU bank, receives PayID, and ships
a documented public API (`api.up.com.au`) with transaction webhooks and a
transactions endpoint. Generate a token, point a PayID at the account, done.
Real dollars from a stranger's real banking app, detected programmatically.

On stage this is a *strength*, not a hack: "we demoed on a real bank's API in 48
hours; production runs on a licensed NPP provider — same interface, one file."

### Provider interface

One seam, two implementations. This is the only abstraction in the codebase and
it exists because we will actually swap it.

```
lib/rail.ts
  createRequest(amountCents, ref) -> { payid, amountCents, ref }
  findSettled(ref, amountCents, sinceIso) -> { settledAt, payerName, txnId } | null

impls: rail/up.ts (demo, real money)   rail/mock.ts (offline dev + stage fallback)
       rail/azupay.ts  <- slide, not built
```

Switch with `RAIL=up|mock` in env. `mock` settles any pending payment 4s after
creation — that is the fallback if venue wifi dies mid-pitch.

### Detection: poll, don't webhook

Skipping webhooks and Supabase Realtime. The merchant page polls
`GET /api/payments/[ref]` every 1.5s while a payment is pending; that route asks
the rail. Total perceived latency ~2s.

Why: webhooks need a stable public URL, a signature check, and a retry story —
all to save ~1s on a screen a human is already staring at. Polling is ~15 lines
and cannot break in a way we can't see.

`ponytail: client polling, 1.5s. Move to webhook + Realtime when a merchant runs more than one till, or when poll volume hits the Up rate limit.`

### Matching a payment to a sale

Ref code first, amount as the tiebreaker.

1. Each sale gets `ref` = `CLVR` + 6 chars Crockford base32 (`CLVR7K2QX`). Short
   enough to survive bank reference fields that truncate at ~18 chars.
2. `findSettled` scans Up transactions since sale creation for an incoming credit
   whose description contains the ref.
3. **Fallback:** if no ref match, accept an incoming credit whose amount exactly
   equals `shopper_pays_cents` and which is the *only* such match in the window.
   This covers the real failure mode — the shopper's bank stripped or ignored the
   description field, which several AU bank apps do.
4. Never match a transaction already claimed by another sale (`settled_txn_id`
   unique index does this at the DB, not in app code).

Point 3 is not optional. It is the difference between "works in testing" and
"works when a stranger uses NAB on stage."

---

## 2. Money math

We never hold funds. Shopper pays the merchant's account directly. CLEVR bills
the merchant monthly SaaS — the full spread passes through to the shopper. This
is also the cleanest possible answer to "so where does the money sit?"

On a $10 sale, `discount_bps = 50`:

```
amount_cents          1000   what the merchant keys in
discount_cents           5   max(1, round(amount * bps / 10000))
shopper_pays           995
merchant_receives      995   direct, instant, final

vs card @ 1.40%
merchant_receives      986   T+1, chargeable back
```

Merchant is **+9c and a day earlier**. Shopper is **+5c**. Nobody lost.

This is the only non-trivial logic in the build, and it is money logic, so it
gets `test_discount.ts` — asserts on $0.01, $10.00, $999.99, and that
`discount_cents` never exceeds `amount_cents` and never rounds to zero.

---

## 3. Data model

Two tables. Resisting the urge to add more.

```sql
merchants
  id            uuid pk
  name          text
  payid         text            -- the Up PayID funds land on
  discount_bps  int default 50

payments
  id                uuid pk
  merchant_id       uuid fk
  ref               text unique
  amount_cents      int
  discount_cents    int
  status            text        -- pending | settled | expired
  settled_txn_id    text unique -- null until settled; unique = no double-claim
  payer_name        text
  shopper_cookie    text        -- anonymous, for the savings counter (§5)
  created_at        timestamptz default now()
  settled_at        timestamptz
```

Not building: `shoppers`, `mandates`, `devices`, `merchant_users`. PayTo, the
soundbox and the fast lane are slides. A table for a slide is a table for nobody.

Auth: none. One seeded merchant row, merchant UI on an unguessable path. This is
a 48h demo with no funds custody and no PII — Supabase Auth magic links are 40
minutes better spent on the shopper page.

`ponytail: no merchant auth. Add Supabase magic-link the day a second merchant exists.`

---

## 4. Routes

```
/m                        merchant keypad -> amount -> POST /api/payments
/m/[ref]                  QR + live amount + green tick (polls)
/p/[ref]                  shopper page: "Pay $9.95 instead of $10.00"
                          PayID + amount + ref, copy buttons
/api/payments       POST  create sale, return ref
/api/payments/[ref]  GET  status; asks the rail if still pending
```

QR encodes the absolute URL of `/p/[ref]`. Shopper's normal camera opens it — no
app, no signup, which is the whole point of the slow lane.

The shopper page cannot deep-link into every bank app (AU banks have no universal
PayID intent scheme). So: giant copyable PayID, giant copyable amount, giant
copyable ref, one line of instruction. Big copy targets beat a broken deep link.

---

## 5. Theme fit — the shopper savings counter

The hackathon theme is consumer financial freedom, not merchant fees. CLEVR as
written in BUSINESS.md is a merchant-economics pitch, and that is a real risk
with these judges.

Cheapest fix that is also genuinely good product: a **savings counter** on the
shopper page. A cookie holds an anonymous id, `payments.shopper_cookie` records
it, the page shows what they've earned back.

Show a total *and* the rate it implies — the rate is what makes this an "Achieve"
tool rather than a receipt (BRIEF.md):

```
"$2.35 back · about $60/year at this pace"

rate = sum(discount_cents) / days_active * 365
```

Guard it: only render the projection when `count >= 2` and `days_active >= 1`.
Extrapolating an annual figure from one $1 payment produces a number that is both
absurd and instantly discreditable on stage. Clamp `days_active` to a minimum of 1
so the first day doesn't divide by zero.

~30 lines. It turns the demo from "merchants save money" into "you get paid to
spend your own money, from your own account, with no card in between" — which is
the theme, in the theme's own words.

Build this. Highest ratio of pitch value to code in the repo.

`ponytail: projection is naive linear extrapolation over days since first payment. Fine for a demo counter, not a forecast. Real version needs a rolling window once there's more than a weekend of data.`

---

## 6. Build order, with cut lines

Ship in this order. Everything above the cut line must work.

1. Supabase schema + seed one merchant with a real Up PayID
2. `lib/rail.ts` + `rail/mock.ts` + `test_discount.ts` — full loop, no bank
3. `/m` keypad → create payment → `/m/[ref]` QR
4. `/p/[ref]` shopper page — PayID, amount, ref, copy buttons
5. Polling status route + green tick animation
6. `rail/up.ts` — flip `RAIL=up`, send yourself a real $1
7. **— CUT LINE. Steps 1–6 are the demo. —**
8. Savings counter (do this one; see §5)
9. Merchant day total + last 5 payments
10. Sound on green tick (browser `Audio`, not a soundbox — the soundbox is a
    3D-printed prop with a phone inside it, and that is fine)

Not building, on purpose: PayTo mandates, fast lane, refunds, merchant analytics,
lending, stablecoins, soundbox firmware. Each is one line on a roadmap slide.

---

## 7. Demo-day risk register

| Risk | Mitigation |
|---|---|
| Venue wifi dies | `RAIL=mock` env flip, redeploy in 40s. Rehearse the flip. |
| Stranger's bank strips the reference | Amount-match fallback (§1.4). Test with 2+ real banks before stage. |
| Stranger's bank is slow on NPP | Test the specific bank beforehand if you can; keep talking, the poll will land. |
| Up token leaks into the client bundle | Token lives only in route handlers. Never `NEXT_PUBLIC_`. Grep the bundle before deploy. |
| Someone pays the wrong amount | Status stays `pending`. Say it out loud — "it only ticks on an exact match" is a feature. |

---

## 8. Questions the Swyftx CTO will ask

Have the one-sentence answer ready:

- *Where does the money sit?* Nowhere near us. Shopper account → merchant account
  over NPP. We bill SaaS monthly.
- *What's your licence exposure?* None. Production sits on a licensed NPP provider
  who does merchant KYC. We're the product layer.
- *What happens on a dispute?* No chargebacks exist on NPP. Merchant pushes a
  refund over the same rail in seconds. We launch on low-value in-person
  purchases where that's a feature, not a gap.
- *That's a bank's personal API, not a payments rail.* Correct — it's how we got
  real money moving in 48 hours. Production is Azupay/Monoova, one file behind
  the same interface.
