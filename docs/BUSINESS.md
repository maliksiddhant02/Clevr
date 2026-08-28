# CLEVR

## Section 1: The Idea

### One-liner
Tap to pay without the card networks. The merchant keeps the fee and splits it with you.

### Problem statement
Australia built world-class instant payment rails (NPP + PayID + PayTo) and never built the consumer product on top. Almost every in-person dollar still rides Visa and Mastercard: merchants lose 1 to 1.5% per sale, wait a day for settlement, and eat chargebacks. India fixed this with UPI, Brazil with Pix. Australia is the one rich country with the rails live and the gap wide open.

Consumers never switched to pay-by-bank because they had zero reason to: card taps are perfect UX and the card fee is invisible to them. Every previous attempt died on that rock.

From 1 October 2026 the RBA bans surcharging on eftpos, Visa and Mastercard. Merchants must absorb card costs and can no longer use the stick to steer payment choice. Discounting is the only legal steering tool left. The regulator just handed this idea a launch date.

### Solution
CLEVR turns the card fee into the consumer incentive. Shopper scans a QR at the counter and pays the merchant account-to-account over NPP. Merchant was paying ~1.4% to cards; the rail costs cents; the saving gets split at the till. Shopper sees "Pay $9.95 instead of $10.00", merchant still keeps most of what they were losing, CLEVR takes the sliver in between. Money lands in the merchant's account instantly, not T+1, with no terminal hardware and no chargebacks.

First payment is a zero-signup web flow. After that, a one-time PayTo mandate (authorised inside the shopper's own banking app) makes every future payment a single tap, at genuine card-tap speed, still with the discount.

### Why us
- We are the target market. Students and market-stall Brisbane is exactly where low-value, high-frequency, fee-sensitive payments live.
- Timing nobody else has: 33 days to the surcharge ban at pitch time. Urgency is built in, not manufactured.
- We never touch money. Licensed NPP providers (Azupay, Monoova) hold the rails and the compliance burden; we build the product layer, the way Stripe Connect platforms sit on Stripe.
- The thesis is consumer control: money moving directly between accounts, instantly, without a toll booth in the middle. Same thesis KAST, Utexo and Ubyx raised on globally with stablecoins. Australia doesn't need the stablecoin, the rail is live.

### What others are doing
- **Card acquirers (Square, Tyro, banks):** own the counter today, cost merchants 1 to 1.5%, settle T+1, sell hardware. Structurally can't cut to NPP economics without cannibalising themselves.
- **QR ordering (me&u / Mr Yum):** own restaurants, but they are ordering layers on top of card rails, not a cheaper rail.
- **Pay-by-bank infra (Azupay, Monoova, Zepto):** sell APIs to enterprises. Nobody has packaged them into a consumer-facing product with an incentive loop. They are our suppliers, not our competitors.
- **Global reference points:** UPI (India), Pix (Brazil), Wero (EU), stablecoin neobanks (KAST). All prove account-to-account wins when incentives and UX are solved. None operate here.
- **BNPL / wallets:** solve credit or aggregation, not the merchant fee. Both still ride card rails.

### Business model
The payment is the wedge. The merchant's real-time daily revenue data is the asset. Lending against that data is the long-term business. Same playbook as every UPI winner and Square, except nobody has built the wedge in Australia.

Pitched as three phases: **Rail → Treasury → Capital**, with stablecoins on the horizon.

### Income streams
1. **Spread on the payment (day one).** Merchant pays ~0.4% or flat SaaS instead of ~1.4% to cards. NPP costs cents, shopper gets the discount, CLEVR keeps the gap.
2. **Soundbox rental.** $10 to 15/month speaker + QR/NFC stand that announces payments out loud. Recurring revenue, physical churn anchor on the counter.
3. **Treasury tools (paid tier).** Auto GST set-aside, sweep to high-interest account, payroll splits. Merchants pay for money that organises itself.
4. **Lending distribution (the big one).** Real-time revenue is underwriting-grade data. Partner with a licensed lender, take 1 to 3% origination plus servicing tail. CLEVR never carries the loan book or the credit licence.
5. **Merchant analytics.** Merchants pay $20 to 50/month for insights on their own sales: peak hours, repeat rate, anonymised category benchmarks. Shopper data is never sold. Non-negotiable, it protects the brand and avoids Privacy Act exposure.
6. **Loyalty boosts.** Merchants fund targeted extra discounts ("2% off at my stall today") pushed through CLEVR. Ad-shaped revenue, fully transparent to the shopper.
7. **Stablecoin rail (horizon).** Same QR accepts USDC settled to AUD via a licensed exchange partner. CLEVR clips the FX spread on tourist and cross-border spend, where cards charge 3%+ margins.

## Section 2: Technicalities

### Architecture principle
CLEVR holds no funds, no credentials, no licence exposure. A licensed NPP payment provider (Azupay or Monoova) is the regulated party: they KYC the merchant, connect to the NPP, and settle money bank-to-bank. The shopper is authenticated by their own bank inside their own banking app. CLEVR is the orchestration and product layer: QR generation, payment requests via the provider's API, webhook listening, discount math, merchant screen, shopper web app.

### Merchant onboarding (once, ~10 minutes)
1. Merchant signs up in the CLEVR app on their own phone. No hardware.
2. Business bank account verified through the provider (KYC handled by them).
3. Merchant gets a checkout screen: key in an amount, get a QR. Optionally add the soundbox stand later.

### Payment flow: slow lane (shopper's first ever payment, no app, no signup)
1. Merchant keys $10.00. CLEVR calls the provider API, which creates a unique payment request (one-time PayID or payment link with a reference code baked in) rendered as a dynamic QR.
2. Shopper scans with their normal camera. A web page opens: "Pay $9.95 instead of $10.00. You save 5c for paying by bank."
3. Page shows the PayID with amount and reference pre-filled (deep-link into the banking app where the bank supports it).
4. Shopper pays in their own banking app. NPP settles account-to-account in seconds.
5. Provider webhook fires on settlement. The unique reference maps it to this sale, so the merchant's screen flips to a green tick while the shopper is still standing there. No "did it go through", no checking bank apps.

Honest cost: 30 to 60 seconds vs a 2-second card tap. The discount exists precisely because nobody does a 45-second flow for free. This lane's job is making the first transaction possible with zero commitment.

### Payment flow: fast lane (every payment after, the actual product)
1. At the end of the first payment, one prompt: "Want this to be one tap next time?"
2. Shopper authorises a PayTo agreement, a standing mandate on their account, approved once inside their own banking app (~1 minute, supported by all major banks, mandated). The authorisation lives at their bank, never with CLEVR.
3. Thereafter: scan QR (or tap the NFC sticker), web app recognises them, "Pay $9.95?", one tap.
4. The tap instructs the provider to fire a payment under the standing mandate. Green tick in 2 to 5 seconds. Card-tap parity, and the shopper is still getting paid to use it.

### Money movement on a $10 sale
Funds land in the merchant's real bank account at the green tick, not tomorrow. Cards would have cost ~14c plus a day's wait. Here: provider's NPP cost is single-digit cents, 5c goes to the shopper as the discount, CLEVR's clip sits in the remaining gap (or flat SaaS with the full spread passed through as the more honest v1).

### Soundbox
QR/NFC stand with a speaker: "Received nine dollars ninety-five." Solves payment confirmation without eyes during rush. Rented, not sold. BLE/WiFi device subscribed to the same webhook events as the merchant screen.

### Edge cases
- **Refunds:** merchant-initiated push back over the same rail, seconds not days.
- **Chargebacks:** none exist on NPP. Merchants love it; disclose it plainly to shoppers. Launch on low-value in-person purchases (coffee, stalls) where disputes basically don't exist, not $2,000 online orders.
- **Bank outage or shopper refusal:** the card in their pocket still works. CLEVR is an additional rail, not a hostage situation.
- **Fraud posture:** merchant KYC'd by the provider at onboarding, shopper authenticated by their bank. CLEVR never in the credential or custody path.

### Regulatory position
- Moving money: licensed provider's job, not ours.
- Discounting for payment method: explicitly legal, and from 1 Oct 2026 the only legal steering mechanism (surcharging banned on designated schemes).
- Lending: distribution partnership with an ACL holder, never the balance sheet.
- Shopper data: not sold, ever. Merchant analytics covers only the merchant's own sales plus anonymised benchmarks.

### Known hard parts (no sugar)
- Consumer habit is the real wall. One weekend proves willingness, not retention. The fast lane and the discount are the retention bet.
- PayTo sponsor onboarding doesn't clear in 48 hours; the fast lane demos on a provider sandbox.
- RBA interchange cuts will compress the arbitrage somewhat; NPP vs scheme costs stay an order of magnitude apart.
- Two-sided cold start. Mitigation: launch venue-by-venue (one market = both sides in one place), soundbox as the physical anchor, merchant boosts as shopper pull.

### Weekend build scope
- **Buildable and demoable live:** merchant checkout screen, dynamic QR via provider sandbox (or a real static PayID for real $1 payments from strangers' actual banking apps), webhook green-tick loop, discount math, shopper web flow.
- **Roadmap slides, not builds:** PayTo fast lane (sandbox demo), soundbox (3D-printed mock with speaker on webhook is a great prop), lending, stablecoin rail.
- **The demo moment:** a stranger's real banking app, a real dollar, a green tick on stage in seconds.
