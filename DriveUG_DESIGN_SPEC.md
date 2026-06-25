# DriveUG — Design & Build Specification

**Purpose of this document:** This is the single source of truth for building DriveUG. An AI coding assistant (or developer) should follow this file when generating the project. It defines the product, the screens, the data model, the tech stack, and the build order. Treat the existing HTML mockup (`driveug_web_app_screens.html`) as the visual starting point — match its layout, spacing, and component style unless told otherwise.

---

## 1. Product summary

DriveUG is a peer-to-peer and B2C car rental marketplace for Uganda. Car owners (individuals and rental companies) list their vehicles. Renters (locals, tourists, NGOs, companies) search, filter, and book. DriveUG takes a commission on every booking and never owns the vehicles.

**Primary users**
- **Car owners / fleet companies** — list cars, set pricing, manage bookings, get paid.
- **Renters** — local renters, international tourists, safari/tour operators booking on behalf of clients.
- **Admin (DriveUG team)** — verifies listings, resolves disputes, manages payouts.

**Core value proposition:** "Airbnb for cars in Uganda" — trustworthy, mobile-first, Mobile Money-native.

**Build philosophy:** This is being built in two phases. **Phase 0** is a validation product — a real, browsable car catalog with no real backend, where every booking and verification action routes to a human via WhatsApp. **Phase 1** is the full PWA described in the rest of this document, with real auth, payments, and automated verification. Do not build Phase 1 features until Phase 0 has been used by real renters and owners. See section 10 for the full Phase 0 spec.

---

## 2. Visual style (user-directed — supersedes the earlier dark mockup)

The user has chosen two reference designs as the actual UI direction. Build to match these, not the original dark mockup.

**Desktop reference (CARZONE-style listing page):**
- Light, clean, white/off-white background (`#f1f1f1` page bg, white card surfaces).
- Left sidebar filters: search input, fuel type as pill toggle buttons, a price range slider with a mini histogram, brand checklist.
- Top bar: simple wordmark-style logo, centered, light nav links (Home / Cars / About Us / FAQ), cart + account icons on the right.
- Content header: "In Stock (count)" heading, sort dropdown, grid/list view toggle icons.
- Car cards: large hero card (first card can have a tinted gradient background, e.g. mint green) showing car image, name, fuel type, price top-right with an arrow icon button, and a row of 3 spec stats at the bottom (e.g. max torque, 0–100, top speed) — adapt these stats to rental-relevant specs (seats, daily price breakdown, fuel type, transmission) rather than performance specs.
- Typography: bold black sans-serif headings, generous whitespace, minimal borders — clean and editorial rather than dense.

**Mobile reference (Rentcars-style app):**
- Full-bleed hero photo header with greeting ("Hello, [name]") and a floating rounded search bar overlapping the hero image ("Search for destinations? Anywhere · Anytime") with a filter icon button.
- Bottom floating action bar: 4 circular icon buttons (search, bookings/calendar, profile, chat/support) docked over the content, with the active one filled black.
- Horizontal scroll sections: "Top trends", "Popular vehicles", each with rounded image cards showing price, location, and a star rating + trip count.
- Deals/promo screens use a dark hero band (photo + black gradient overlay) with bold white headline text, beneath it rounded white cards with countdown-style "10% OFF" callouts and a black pill CTA button ("View Details").
- A dedicated full-screen modal pattern for "Pickup & Return": single destination search field, then a two-column Pickup / Return block each with a date pill and a time pill, country/currency selector row, and a full-width black "Search" button pinned at the bottom.

**Carried-over conventions from the prior mockup (keep these, they still apply):**
- Category chips remain pill-shaped.
- Verified/trust badges, status pills (pending/confirmed/completed) keep the green-success / amber-pending color logic, just re-skinned to the new light palette (e.g. soft green pill for "Confirmed", soft amber for "Pending").
- Icons: Tabler Icons family, consistent line weight throughout.

**Cross-platform rule:** Since this is being built **PWA-first** (see section 9), the mobile reference is the primary design target — build the mobile layout first, then adapt the desktop reference's listing/filter patterns for the larger viewport. The two reference styles should feel like one product: light backgrounds, black primary buttons/CTAs, rounded cards, soft tinted accent panels (mint green, soft amber) instead of the old dark theme.

---

## 3. Screens (MVP scope)

These map directly to the existing mockup's nav tabs. Build all six as real, connected pages/routes, not static mockup tabs.

1. **Homepage** (`/`)
   - Hero search box: location, pick-up date, return date → goes to listing results.
   - Category quick-filter chips (Safari 4×4, Luxury, Business, Budget, With driver, Group/van, Wedding).
   - Featured/popular car grid (car image, badge/category, name, location + key spec, price/day).

2. **Car listing / search results** (`/cars?location=&from=&to=`)
   - Result count + active filters summary.
   - Sort: Recommended / Price low first / Top rated.
   - Filter bar: category, price range, seats, with/without driver, transmission.
   - Grid of car cards: rating, trip count, key feature, price.

3. **Car detail** (`/cars/:id`)
   - Image gallery (main + thumbnails).
   - Features list (chips), reviews list.
   - Owner card: name, verified badge, response time.
   - Booking box: pick-up/return date, driver option toggle, computed total (days × price), platform fee disclosure, "Request to book" button.

4. **List your car** (`/list-car`) — owner onboarding form
   - Photo upload zone (min 4 photos: front, rear, interior, engine bay).
   - Make, model, year, seats, category, daily price, weekly price.
   - Driver availability (self-drive only / driver available + fee / driver required).
   - Pick-up location, free-text description.
   - ID + logbook upload for verification.
   - Submit → goes into "pending verification" state, not live immediately.

5. **Owner dashboard** (`/dashboard`)
   - This month's earnings, active bookings count, total trips — stat cards.
   - Bookings list with status (Pending / Confirmed / Completed) and per-trip detail.
   - Payout method + schedule note (Mobile Money, weekly).

6. **Trust & verification centre** (`/trust` or shown contextually during onboarding)
   - Owner verification checklist (ID, logbook, insurance, phone, photos).
   - Renter requirement checklist (ID/passport, driving permit, security deposit, optional damage cover).
   - Escrow/payment-protection explainer banner.

**Post-MVP screens** (build after the 6 above work end-to-end): renter dashboard/trip history, in-app messaging between renter and owner, admin verification queue, review submission flow, dispute/cancellation flow.

---

## 4. Core data model

Use this as the schema baseline regardless of backend choice (Postgres/Supabase/Firebase, etc.).

**User**
- id, full_name, phone (primary identity — Uganda is phone-first), email (optional), role (renter / owner / both / admin), national_id_doc_url, id_verified (bool), driving_permit_doc_url (renters), created_at.

**Car**
- id, owner_id, make, model, year, category (enum: safari_4x4, luxury, business, budget, group_van, wedding, self_drive, with_driver — note category can be multi-select), seats, transmission, fuel_type, photos[] (min 4), description, daily_price_ugx, weekly_price_ugx, driver_mode (self_drive_only / driver_available / driver_required), driver_fee_ugx (nullable), pickup_location, logbook_doc_url, insurance_doc_url, status (pending_review / live / paused / rejected), rating_avg, trip_count, created_at.

**Booking**
- id, car_id, renter_id, pickup_date, return_date, with_driver (bool), days, subtotal_ugx, platform_fee_ugx, total_ugx, status (pending / confirmed / declined / completed / cancelled), security_deposit_ugx, payment_status, created_at.

**Review**
- id, booking_id, author_id, target_type (car / renter), rating (1–5), text, created_at.

**Payout**
- id, owner_id, period_start, period_end, amount_ugx, method (mtn_momo / airtel_money / bank), status (scheduled / paid), paid_at.

---

## 5. Business logic rules

- **Commission:** 10–15% of booking subtotal (final decision), charged to the renter as a disclosed "platform fee" line at checkout. Make this a config value, not hardcoded, since it may vary by category later (e.g. luxury vs budget).
- **Booking flow:** Renter requests → owner has 24h to confirm/decline → on confirm, payment is captured and held → released to owner after the trip's return date (escrow model), schedule weekly payouts.
- **Verification gate (manual review — final decision):** Every new car listing always goes to manual admin review before going live, regardless of volume. No auto-publish path. A car cannot move from `pending_review` to `live` until ID + logbook + insurance are uploaded and an admin marks `id_verified = true`. Renters must have ID + driving permit verified before their first booking is confirmed. **In Phase 0, "manual review" literally means you personally look at the photos sent over WhatsApp — no upload form, no admin panel needed yet.** In Phase 1, this can be upgraded to use a verification API (see section 10.4) so the human only handles edge cases/disputes instead of every single check.
- **Security deposit (final decision):** Held by the DriveUG team, not the car owner. Collected digitally at booking confirmation, released back to the renter after the car is returned with no reported damage/disputes. This is core to the trust story — never let an owner collect or hold the deposit directly.
- **Pricing calc:** `subtotal = days × daily_price_ugx` (or weekly_price_ugx if days ≥ 7, prorated), `platform_fee = subtotal × commission_rate`, `total = subtotal + platform_fee + (driver_fee_ugx × days if with_driver)`.
- **Cancellation:** Cancelling within 24 hours of pick-up forfeits a portion of the booking fee, split between DriveUG and the owner (exact % to be set later — flag as a config value, not hardcoded).

---

## 6. Tech stack recommendation (web app, MVP)

- **Frontend:** React + Tailwind (matches the CSS-variable design system already in the mockup — port the existing CSS variables into a Tailwind theme or keep as plain CSS).
- **Backend/DB:** Supabase (Postgres + Auth + Storage for photos/ID docs) — fastest path for a solo or small-team build, and handles file storage for verification docs out of the box.
- **Payments:** MTN Mobile Money and Airtel Money APIs as primary; Flutterwave or Paystack as an aggregator if direct telco integration is too slow to get approved — this also unlocks international card payments for tourists in one integration.
- **Hosting:** Vercel (frontend) + Supabase (backend), or a single Render/Railway deployment if keeping it monolithic.
- **Auth:** Phone-number OTP login as primary (email optional) — matches how Ugandans actually use apps.

This stack choice can be swapped, but the schema and screens in this document should hold regardless of stack.

---

## 7. Build order for the AI agent — Phase 1 (the full PWA)

This is the order for the *real* product, once Phase 0 has validated demand. See section 10 for what to build first, right now.

1. Set up project scaffold (routing, design tokens/CSS variables from mockup, shared layout/topbar).
2. Build Homepage + Car listing (static/mock data first, no backend yet).
3. Build Car detail page with booking box and live price calculation.
4. Wire up backend (auth, Car/Booking tables) and connect listing + detail pages to real data.
5. Build "List your car" form → writes to Car table with status `pending_review`.
6. Build Owner dashboard, pulling real bookings for the logged-in owner.
7. Build admin verification queue — move this up; it's the actual operational bottleneck (see advice in section 11).
8. Build Trust & verification centre (can be mostly static content + dynamic checklist state).
9. Add booking request → confirm/decline flow (owner side) and payment capture.
10. Add reviews and ratings.
11. Polish: mobile responsiveness pass, empty states, loading states, error states.

Do not skip ahead to payments/auth polish before the core browse → book loop works end-to-end with fake data — get the user flow right first.

---

## 8. Platform strategy — PWA first (final decision)

- Build as a **Progressive Web App** first. No native iOS/Android app for MVP.
- Must be installable (manifest + service worker), work well on mobile Safari/Chrome, and support offline-friendly basics (cached shell, graceful "you're offline" states for booking pages).
- The Rentcars-style mobile reference in section 2 is the primary target experience — design and build mobile screens first, then extend to desktop using the CARZONE-style listing patterns.
- Native app wrapping (e.g. Capacitor) can be revisited post-MVP once the PWA is validated with real users.

## 9. Decisions log (all resolved)

All four of the original open decisions have been resolved:

- ~~Final commission rate~~ → **Resolved: 10–15% of booking subtotal.**
- ~~Manual review vs instant publish~~ → **Resolved: always manual admin review, no auto-publish.**
- ~~Who holds the security deposit~~ → **Resolved: held by the DriveUG team, not the owner.**
- ~~PWA vs native first~~ → **Resolved: PWA first** (see section 8).

No open product decisions remain blocking the Phase 1 build. Any new questions that come up during build (e.g. exact cancellation-fee split %) should be flagged back to the user rather than guessed.

---

## 10. Phase 0 — build this first: WhatsApp-linked catalog, no real backend

**Goal:** Validate that renters will actually browse and request to book, and that owners will actually list cars, before investing in auth, payments, or verification infrastructure. Everything that would normally be "backend logic" is a human (you) on WhatsApp.

### 10.1 What to actually build

A single, real, deployed website (not a mockup — live, shareable URL) with:

- **Homepage / catalog** — same visual style as section 2 (Rentcars-style mobile-first), showing real or seed car listings: photo, name, category, location, price/day.
- **Filter/search** — category chips and a location/date picker, exactly as designed, filtering a static or lightly-dynamic dataset (a JSON file or a single spreadsheet-backed table is enough — no need for a full database yet).
- **Car detail page** — full car info, photos, price breakdown — same as section 3.3, except the "Request to book" button does **not** process a booking. It opens a pre-filled WhatsApp message (using a `wa.me` link) addressed to your business WhatsApp number, e.g.: *"Hi, I'd like to book the Land Cruiser V8 for Jul 10–15. My name is ___."*
- **"List your car" page** — same form fields as section 3.4, but on submit it either (a) sends the details + photos as a WhatsApp message to you, or (b) is itself just a "Message us on WhatsApp to list your car" button with a short photo/checklist explainer. Pick (a) if you want structured data capture, (b) if you want zero build time.
- **No login, no accounts, no payments, no database writes from users.** The site is read + WhatsApp-redirect only.

### 10.2 What you (the human backend) actually do

- Renter messages you on WhatsApp → you confirm car availability, send Mobile Money payment details directly, confirm the booking by reply, manually note it down (a simple spreadsheet is your "Booking" table for now).
- Owner messages you to list a car → you ask for ID, logbook, insurance, and photos over WhatsApp, eyeball them yourself, then manually add the car to the catalog dataset.
- Security deposit: collected by you over Mobile Money directly from the renter before pickup, refunded by you after return — this is the manual version of section 5's "Resolved: held by the DriveUG team" rule, just without an escrow system yet.

### 10.3 Success criteria before moving to Phase 1

- At least 10–15 real car listings onboarded.
- At least a handful of real completed bookings end-to-end (not just inquiries).
- You've personally felt the pain points (slow WhatsApp back-and-forth, manual spreadsheet errors, payment confirmation delays) — these pain points directly tell you what to automate first in Phase 1, rather than guessing.

### 10.4 Verification providers to revisit once you automate (do not integrate yet)

When manual WhatsApp/eyeball verification becomes the bottleneck (roughly 50+ listings), these are real, usable options for Uganda — noted here so they don't need to be re-researched later:

- **Smile ID** — most widely used identity verification provider across Africa, with direct Uganda NIRA (national ID registry) support; lots of existing integration examples from other African marketplaces/fintechs.
- **Laboremus Uganda** — a local Ugandan company built specifically for this market, and notably supports onboarding directly through WhatsApp and USSD as well as web/mobile — a natural fit since this product is starting on WhatsApp.
- **Didit** — cheaper global option (~$0.30/verification, 500 free/month), also supports Ugandan ID documents.

None of these are needed for Phase 0. Do not add an API integration until manual review volume actually hurts.

---

## 11. General advice (carried forward, not yet acted on in the spec above)

These are judgment calls worth keeping in view while building, beyond what's already locked into the phases above:

- **Legal/financial structure:** Before real money moves through "DriveUG" — even informally — set up a business bank account or other structure separate from a personal phone number/Mobile Money line. This matters even more once you're holding security deposits, since holding customer funds can carry regulatory implications in Uganda; this is worth a quick check with a local accountant or lawyer before Phase 1's escrow system goes live.
- **Pick one launch city, not "Uganda."** Concentrate supply in Kampala/Entebbe rather than spreading the location dropdown across many cities — thin supply across many cities feels empty everywhere.
- **Prioritize onboarding your highest-margin category first** (safari/tourism vehicles) rather than onboarding owners indiscriminately — a small platform with 5 great safari vehicles is more bookable and a better story than 30 random sedans.
