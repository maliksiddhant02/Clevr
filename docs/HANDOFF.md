# CLEVR — Handoff

Where the project actually stands, for whoever picks it up next.
Last updated: 29 Aug 2026.

---

## 1. In one paragraph

Tap to pay without the card networks. A shopper scans a QR at the counter and
pays the merchant bank-to-bank over Australia's instant rail (NPP). The merchant
was losing ~1.4% to Visa/Mastercard; the rail costs cents; the saving is split at
the till, so the shopper pays $9.95 instead of $10.00 and the merchant still
nets more than they would have on cards — instantly, with no chargebacks. From
1 Oct 2026 the RBA bans card surcharging, which makes discounting the only legal
way left for merchants to steer payment choice. That's the launch window.

Full argument in [BUSINESS.md](BUSINESS.md). Hackathon context, judges and theme
fit in [BRIEF.md](BRIEF.md).

## 2. Run it

```bash
npm install
npm run dev
```

Then `http://localhost:3000`. Mobile only — use device emulation at 390px, or
just open it on a phone. `npm test` runs the money maths; `npm run build` is the
real typecheck.

No env vars needed yet. Nothing talks to a database or a bank.

## 3. What exists, and what doesn't

**Built and working — the shopper app.** Six screens behind a bottom tab bar, all
reading hardcoded sample data:

| Route | Screen |
|---|---|
| `/` | Home — total kept, quick actions, recent payments, hidden-fee card |
| `/activity` | Full history grouped by day |
| `/insights` | Savings chart, stat pair, merchant donut, fees-kept spotlight |
| `/account` | Disclosures, privacy position |
| `/payment/[ref]` | Pushed detail — breakdown, reference, settle time |
| `/pay` | Pushed — how to pay by camera |

**Not built — the merchant flow, which is the actual demo.** `/m` keypad,
`/m/[ref]` QR + settlement tick, `/p/[ref]` shopper pay page, the Supabase
schema, and the rail integration. All specced in
[TECHNICAL.md](TECHNICAL.md) §15, none written.

Be clear-eyed about this split: **the shopper app is the pitch and theme surface;
the merchant flow is what makes the pitch unfalsifiable.** A stranger's real
dollar landing on a screen on stage is the moment the whole thing rests on, and
it doesn't exist yet.

## 4. Repo map

```
app/
  (app)/          tab-bar screens — the route group IS the shell
  payment/[ref]/  pushed screens live outside (app)/ so they get no tab bar
  pay/
  globals.css     every design token, one @theme block
  layout.tsx      fonts + the 430px mobile column
components/       Card Button TabBar ScreenHeader PaymentRow Avatar
                  SectionLabel AreaChart DonutChart SavingsChart
lib/
  money.ts        pure arithmetic — imports nothing, hence trivially testable
  money.test.ts   node --test, no framework
  sample.ts       all fake data, in one place
docs/             BUSINESS BRIEF TECHNICAL DESIGN HANDOFF
```

Three dependencies: `@supabase/supabase-js` (not wired yet), `lucide-react`,
`qrcode` (planned, not installed). No charting library, no animation library, no
`cva`, no form library — all deliberate, all justified in
[DESIGN.md](DESIGN.md) and [TECHNICAL.md](TECHNICAL.md).

## 5. Decisions you'd otherwise re-litigate

- **Up Bank is the demo rail, Azupay/Monoova is the production answer.** Licensed
  NPP providers don't onboard in a weekend; Up ships a self-serve public API that
  moves real money. Both sit behind one `Rail` interface so the swap is one file.
- **Polling, not webhooks.** No public URL, no signature check, no retry story, to
  save ~1s on a screen someone is already staring at.
- **`GET /api/payments/[ref]` settles.** A deliberate REST violation — it's what
  buys us no cron and no webhook. A conditional `UPDATE … WHERE status='pending'`
  makes it idempotent. Don't "fix" it without replacing what it bought.
- **Payments expire after 10 minutes.** Not tidiness — the exact-amount fallback
  match is only safe inside a bounded window. See TECHNICAL.md §9.
- **RLS on, zero policies.** The browser never touches Supabase; everything goes
  through route handlers on the service key. Fails closed for one line of SQL.
- **Mobile only, no breakpoints.** The projector is solved by mirroring a phone.
- **No emoji in the UI.** Monogram avatars instead.

## 6. Gotchas

- **Tailwind only matches whole literal class names.** `` `rounded-wobble-${n}` ``
  renders unstyled and silently. Keep variants in `const` maps. This has already
  bitten once.
- **`npm test` needs the glob quoted** — `node --test "lib/**/*.test.ts"`. Passing
  a bare directory tries to execute non-test files.
- **`tsconfig` has `allowImportingTsExtensions`** because Node's test runner needs
  the `.ts` extension in imports and `tsc` rejects it otherwise.
- **Sample dates are strings, not `Date` objects.** Deriving "Today" from
  `Date.now()` at render is a hydration mismatch waiting to happen.
- **SVG gradient `id`s are document-global** — `AreaChart` takes an `id` prop for
  exactly this reason.
- **`git add -A` in this repo sweeps `.claude/`.** A local skills directory got
  committed once already.

## 7. What to do next, in order

1. **`supabase/schema.sql`** — two tables, indexes, RLS on, seed one merchant.
   TECHNICAL.md §10 has the DDL.
2. **`lib/rail.ts` + `lib/rail/mock.ts`** — the interface and the fake. The mock
   settles any pending sale after 4s, which is also the stage fallback.
3. **`POST /api/payments` + `GET /api/payments/[ref]`** including the conditional
   settle. Validate the amount at the boundary (§8).
4. **`/m` keypad → `/m/[ref]` QR + polling + tick.** The tick is the demo.
5. **`/p/[ref]`** — the shopper pay page with the struck-through price.
6. **`lib/rail/up.ts`** — flip `RAIL=up`, send a real $1.

Steps 1–3 have no UI and step 2 has no bank. That ordering is deliberate: the
riskiest integration lands last, against a loop that already provably works.

## 8. Open questions

- **Nobody has an Up account yet.** Step 6 is blocked until someone opens one,
  generates a token and points a PayID at it. Do this early — it's the only
  external dependency in the build.
- **Which bank will the volunteer on stage use?** Several AU banking apps strip
  the payment description, which is why the amount-fallback match exists. Test
  with at least two real banks before the pitch.
- **`Button`/`ButtonLink` are currently unused.** Kept because the merchant keypad
  needs them next. If that flow changes shape, delete them.
- **The 3-minute pitch is ~450 words** and the live demo eats about 60 seconds of
  it. Everything else is a Q&A answer, not a pitch line.
