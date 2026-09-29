# /design-partner page — CMS-managed content + application form

Status: **planning only** — no code written yet.

Source: `Design Partner.png` (full-page Figma export, reviewed section by section
including the enlarged component/form details in the same file).

## Scope

A brand-new page, `/design-partner`, built the same way every other page on this site is
built: CMS-managed marketing content (hero, benefits, security, process — via the existing
`page` → dynamic-zone `sections` pattern, rendered through `SectionRenderer.tsx`) plus one
functional, CMS-recorded piece at the bottom — here, a **3-step application form**, not a
single-field form like contact/waitlist/newsletter.

This also finally fixes something flagged two plans ago: the nav's "Design Partner" link
(header + footer) currently points to `#design-partner`, and no section with that id exists
anywhere — it's been a dead link this whole time. Once this page exists, that link becomes
`/design-partner` for real, matching how `Solutions`/`Trust & Security` were already fixed.

## Two things confirmed with you already

- The Step 3 field mislabeled "Full name \*" (with deal-structure placeholder text, clearly
  copy-pasted from Step 1) becomes **"Any custom deal considerations"**, optional.
- "Request NDA draft" and the informational NDA-preview link become `mailto:` links to
  `info@aptaisolutions.com` (the address already used elsewhere on this site, in
  `WaitlistTrustBar` and `EnterprisePlan`) — no NDA-generation backend in this pass.

## Page content — section by section

Reusing existing dynamic-zone components where the data shape genuinely fits (not just
visually — checked each against `lib/cms/types.ts`); new components only where it doesn't.

| # | Section (from the design) | Component | Notes |
|---|---|---|---|
| 1 | Hero — "Help us build *contract intelligence* that actually works", eyebrow pill, single CTA, cloud-bottom art | **New**: `sections.design-partner-hero` | Closest existing (`trust-hero`, `home-hero`) don't have the eyebrow-pill + single-CTA + cloud-illustration shape together |
| 2 | "What is a design partner?" intro paragraph | `sections.rich-text` | Already generic enough |
| 3 | Buyer/Seller audience toggle (2 tabs, each: illustration + heading + body + 4-item checklist) | **New**: `sections.design-partner-audience` | Visually close to `who-it-is-for`, but `PersonaItem` is a testimonial shape (`quote`/`role`/`avatars`) — wrong shape entirely for "heading + body + checklist" |
| 4 | "Real benefits. Zero document risk." — 6 cards (image, title, body, colored pill badge) | `sections.card-grid` | `CardItem` has `title`/`description`/`icon` — needs one addition: a `badge` field (or repurpose the existing `meta?: string` field as the badge text — cheaper, no schema change) |
| 5 | "No contract uploads. No document risk." — 6 security cards (icon, title, body) | `sections.solutions-security` | Exact shape match, already has `items?: CardItem[]` |
| 6 | "Mutual Non-Disclosure Agreement" gray CTA panel | `sections.cta` | Existing generic heading/subhead/button shape fits |
| 7 | "A light commitment. Real collaboration." — 4 step cards | `sections.card-grid` | Same component as #4, different `items` |
| 8 | "Our commitment to you" — 8-item checkmark grid (2×4) | **New**: `sections.checklist-grid` | Nothing existing renders a checkmark-grid; `trust-notes` is a single-column paragraph list, wrong layout. Small, reusable component (`items: { text: string }[]`) |
| 9 | "From application to first insight" — image + 4 numbered/expandable steps (01–04) | `sections.trust-benchmark` | `TrustFlowStep[]` (`title`/`description`) already matches; reuse as-is |
| 10 | "Apply to the Design Partner Program" — heading/subhead + the form | **New**: `sections.design-partner-form` | Same pattern as `sections.waitlist-form`: CMS only supplies heading/subhead/CTA copy; the actual field list is hardcoded in the React component, not CMS-driven (same reasoning as the waitlist form) |

Seeding: add a `seedDesignPartnerPage(strapi)` function to `apt-cms/src/index.ts`, same
"skip if page with this slug exists" guard as `seedContactPage`/`seedWaitlistPage`, building
all ten sections above with the real copy from the design.

## The application form — CMS storage

New collection type `design-partner-application` (same `content-types/`/`controllers/`/
`routes/`/`services/` shape as `contact-submission` and `waitlist-signup`). This is a big
flat record — every field from all 3 steps, matching what's actually asked:

**Step 1 — Profile & Company**

| field | type |
|---|---|
| `fullName`, `workEmail`, `title` | string, required |
| `participatingAs` | enum `buyer` \| `seller` \| `both`, required |
| `companyName` | string, required |
| `companyWebsite` | string, optional |
| `annualRevenue`, `companySize`, `companyStatus`, `primaryIndustry` | string, required (option-list values, same "plain string kept in sync with the frontend's option list" approach as `role`/`spend` on the waitlist form) |
| `projectedGrowth` | string, optional |

**Step 2 — Tech & Vendors** (all optional — this step has no `*` required fields in the design)

| field | type |
|---|---|
| `techVendors` | string[] — the checkbox grid (`AWS`, `Microsoft`, … `Other CRM`, `Other AI app vendor`, `Other cloud vendor`) |
| `aiAppVendorsOther`, `cloudVendorsOther` | string[] — the two conditional tag-inputs that appear when "Other AI app vendor" / "Other cloud vendor" is checked |
| `techCategories` | string[] — the 12-item "Technology categories in scope" checkbox grid |
| `storageDetail`, `dataAnalyticsDetail`, `computeDetail`, `networkingDetail`, `aiServicesDetail`, `managedServicesCloudDetail`, `peripheralsDetail`, `managedServicesDetail`, `bundledDetail` | string[] (tag-input) or text — the conditional detail field under each checked category |

**Step 3 — Economics & Terms**

| field | type |
|---|---|
| `avgDiscount`, `dealStructure`, `commitmentSize` | string, optional (option-list values) |
| `customDealConsiderations` | text, optional — the corrected field from your answer above |
| `agreedToTerms` | boolean, required, must be `true` |
| `consentToContact` | boolean, optional (the third checkbox — "I consent to aptAI Group LLC contacting me…") |
| `status` | enum `new`/`reviewing`/`accepted`/`declined`, default `new` |
| `sourcePath` | string, optional |

The second Step 3 checkbox ("I understand a mutual NDA will be provided…") is purely
informational acknowledgment text next to the NDA-request `mailto:` link — not a field that
needs storing.

Controller: same pattern as the other two — zod validation, honeypot, force `status: "new"`
server-side, public role granted `create` only. Given the size of this payload, the zod
schema will be the largest of the three so far but follows the identical shape-per-field
approach already established.

Seed: 3 sample applications spanning `buyer`/`seller`/`both` and a couple of `status` values.

## Website implementation

- `app/design-partner/page.tsx` + `components/design-partner/DesignPartnerPage.tsx` —
  identical wrapper pattern to `app/contact/page.tsx` / `ContactPage.tsx` (`getPageBySlug`,
  `Header`/`Footer`, `SectionRenderer`).
- New section components under `components/design-partner/sections/`: `DesignPartnerHero`,
  `AudienceToggle`, `ChecklistGrid` (this last one goes in `components/cms/sections/` instead,
  since it's generic enough other pages could use it later).
- The form itself: `components/design-partner/sections/DesignPartnerFormSection.tsx` — a
  3-step client component (`useState<1|2|3>`), each step validated independently before
  "Continue" advances (mirrors the design's per-step `STEP 01/02/03` header with the
  green-check-when-complete state already drawn in the file), final step submits everything
  to `/api/design-partner-application` in one request. Tag-input fields (the "Add Tag" boxes
  under each tech category) reuse a small chip-input component — checked, nothing like it
  exists yet in this codebase, so this is one new small reusable piece
  (`components/ui/TagInput.tsx`), built once and reused for all ~9 tag fields in Step 2.
- `lib/validation/designPartnerForm.ts` — one zod schema covering all 3 steps (Step 2 fields
  all optional per the design), mirrored by the CMS controller's schema as with the other
  three forms.
- On success: inline "Application received" state on Step 3 (no dedicated confirmation page
  named in the design, unlike contact/waitlist) — flagging this as an assumption; say if you
  want it to redirect to `/thank-you` instead, matching the waitlist form's pattern.

## Nav fix (bundled into this same piece of work)

Update the CMS Global singleton's `navLinks` and `footerColumns` (`Design Partner` entries,
currently `#design-partner` in both) to `/design-partner`, the same direct-DB + seed-source
fix already applied to `Solutions`/`Trust & Security` earlier.

## Order of work

1. CMS: 4 new dynamic-zone components (`design-partner-hero`, `design-partner-audience`,
   `checklist-grid`, `design-partner-form`) + register them in the `page` content type's
   `sections` dynamiczone list.
2. CMS: `design-partner-application` collection type + controller + validation + honeypot +
   permissions + seed.
3. CMS: seed the `design-partner` page itself (all 10 sections, real copy from the design).
4. CMS: fix `Design Partner` nav/footer hrefs to `/design-partner`.
5. Website: page route + wrapper + the 4 new section renderer components.
6. Website: `TagInput` component (built once, reused ~9×).
7. Website: `/api/design-partner-application` route + shared zod schema.
8. Website: the 3-step `DesignPartnerFormSection` with per-step validation and submit wiring.
9. End-to-end test: full walk through all 3 steps with real data → confirm the row lands in
   the Strapi Content Manager with every field correct, including the conditional tag arrays.

## Open questions

- Confirmed: mislabeled Step 3 field → "Any custom deal considerations"; NDA-request buttons
  → `mailto:info@aptaisolutions.com`.
- Success state after Step 3 submit: inline message (assumed above) vs redirect to
  `/thank-you` like the waitlist form — please confirm.
- Whether `techVendors`/`techCategories` selections should be admin-editable option lists in
  the CMS (so a new vendor doesn't need a code change) or hard-coded on the website, same
  question already flagged for the waitlist form's `role`/`spend` lists — proposing
  hard-coded for consistency with that earlier decision, unless you'd rather change both.
