# CLEVR — Hackathon Brief

Source material. Verbatim where it's given to us; the last section is the only
part that's ours.

---

## Format

Hackathon weekend demo. **3 minute pitch + 2 minutes Q&A.**

Partners: **Swyftx** | **UQIES Ventures** (UQ Innovation & Entrepreneurship Society) | **WOS 2026**

---

## Theme: The Future of Financial Freedom

**Financial Freedom:** Having control over your own money.

Most people don't.

### The problem

1. **Confusion & Visibility** — You can't see what you've got.
   Super · Investments · Bonds · Crypto · Stocks · Managed Funds
2. **Goals** — You can see it, but what to do next?
   Euro Summer? · Save for a car?
3. **Progress** — You start and then stop.
   Consistency · Cashflow and budget · Financial position

### Mission statement

> "Financial freedom" means something different to everyone. For some, it's
> retiring early; for others, it's having the safety net to launch a business or
> simply live without financial stress.
>
> Historically, financial freedom has felt exclusive to people who already have
> wealth to invest. But true financial independence should be for everyone, and it
> starts with giving people the right tools to actively build and manage their own
> wealth.
>
> **This year, your challenge is to build products that make finance work for
> everyday people.**

### Challenge pillars

How can we use emerging tech to:

- **Discover:** Help people define exactly what financial freedom looks like for them.
- **Achieve:** Build practical, smart tools that help them reach those personal goals.
- **Engage:** Make the experience of building and managing wealth simple, accessible, and genuinely fun.

---

## Judges

### Final

| Judge | Role | Background |
|---|---|---|
| **Tim Kuusik** | COO, Jacaranda Finance | Operational transformation, strategy and commercial growth across technology and financial services. |
| **Marcos Kurowski** | CTO, Swyftx | Technology leader; has built high-performing teams and led major digital transformation initiatives. |
| **Michelle Reeves** | Founder & CEO, Xillions AI | Generative-AI platform for brands and consumers to co-create products and content. Marie Claire USA Power List; Forbes "Queens of Crypto". Work featured in VOGUE, WWD, CNBC. Recognised voice in emerging tech, digital engagement and brand innovation. |

### Semi-final

| Judge | Role | Background |
|---|---|---|
| **Leigh Ford** | Investment Manager, UniQuest Extension Fund | Startup mentor, supporter of Queensland's early-stage innovation ecosystem. |
| **Sam McNamara** | Founder & CEO, Getahead | Brisbane-built job-matching platform connecting employers and jobseekers. |
| **Stefan Knight** | Director, Queensland, Antler | Decades across technology, startups and early-stage investment. |

---

## What this means for us

The only part of this document that isn't verbatim.

### The theme-fit gap

The theme is **consumer** financial freedom — visibility, goals, progress.
BUSINESS.md pitches **merchant** economics — interchange, settlement, fees. Those
are not the same pitch, and the gap is the single largest scoring risk we have.

The bridge already exists in the product, it just has to lead: *money moving
directly between your account and theirs, with no toll booth in the middle, and
you get paid for it.* That is "control over your own money" stated literally.

Concretely, this is why TECHNICAL.md §5 exists — the shopper savings counter is
~30 lines and it's the difference between a merchant-fee pitch and a **Engage**
pillar pitch. Build it.

### The three pillars

Each claim below points at something actually on screen during the demo. Nothing
here is a feature invented to satisfy a rubric — two of the three are reframes of
UI we were already building, and the third costs about five lines.

**Discover — "you can't see what you've got."**

Every card tap costs the merchant ~1.4%, invisible to the shopper and baked into
the shelf price. You have paid that toll on every purchase of your life and have
never once seen the number.

The strikethrough on the shopper page *is* the discovery moment. `$̶1̶0̶.̶0̶0̶ → $9.95`
is the first time a consumer sees the cost of the rail they're standing on.

Zero build — it's the signature gesture in DESIGN.md §2, already the centrepiece
of the screen. We just have to say out loud what it means.

**Precision matters here.** Ours is *cost* visibility, not *asset* visibility. We
do not aggregate super, investments or crypto, and we should never imply we do. If
a judge means portfolio aggregation, the answer is "no, that's not us" — said
plainly, in one sentence, and then move on.

**Achieve — "practical tools to reach personal goals."**

Not a goal screen. A **rate**.

The savings counter shows a total *and* the pace it implies:
*"$2.35 back · about $60/year at this pace."*

That projection runs on the shopper's own real payment history, so it is honest
arithmetic rather than a progress bar filling from a number we made up. It turns
an invisible per-transaction gain into a legible annual one, which is the actual
job of an "Achieve" tool.

~5 lines on top of the counter. Only show the projection once there's more than
one payment to project from — extrapolating an annual figure from a single $1
transaction is a number a CTO will laugh at, correctly.

**Engage — "simple, accessible, genuinely fun."**

Our strongest pillar and it needs no new work. No app, no signup, no account: a
stranger points their normal camera at a QR and gets paid for spending their own
money. The hand-drawn design system is doing real work here too — it makes a
payments product feel human rather than institutional, which is the pillar's word
"fun" taken seriously.

### What we still don't claim

No goal-setting, no budgeting, no net-worth view, no asset aggregation. If asked,
the honest answer is that CLEVR is the transaction layer those products need and
don't have — and that the genuine "see your financial position" story in this
business is **merchant-side**: a market-stall owner watching their revenue land
live, which is real data and is exactly what the Treasury and Capital phases are
built on.

That is a far better Q&A answer than a fake chip screen would have been.

### Per-judge angle

Three judges, three different questions. All three get answered inside 3 minutes
by the same demo — no separate slides.

- **Marcos (CTO, Swyftx)** — will probe whether it's real. The stranger's real $1
  landing on stage answers it; the "where does the money sit / what's our licence
  exposure" answers are in TECHNICAL.md §8. He'll spot a mocked webhook instantly,
  which is why the demo runs on a real bank API.
- **Tim (COO, Jacaranda Finance)** — lending and operations. Jacaranda is a
  consumer lender, so income stream #4 (real-time revenue as underwriting-grade
  data, distributed through an ACL holder) is his language. One line in the pitch,
  ready to expand in Q&A.
- **Michelle (Xillions AI, "Queens of Crypto")** — brand, consumer engagement,
  emerging tech. The hand-drawn design system and the savings counter are for her.
  The stablecoin rail (income stream #7) is the horizon line worth naming out loud;
  the sharper framing is that **Australia doesn't need the stablecoin — the rail is
  already live.**

### Timing reality

3 minutes is roughly 450 words. That is: problem, the 1 Oct 2026 regulatory
trigger, live demo, business model, ask. The live demo eats ~60 seconds of it.

Nothing else fits. Every extra idea is a Q&A answer, not a pitch line.
