# Contact "Get in touch" form — CMS-backed submission pipeline

Status: **planning only** — no code written yet. This is the plan to review before implementation starts.

## Scope

The `/contact` page form ("Get in touch") is currently UI-only: `ContactFormSection.tsx`
(`apt-aivisor-website/components/contact/ContactFormSection.tsx`) calls `e.preventDefault()`
and just flips a local `status` flag — nothing is validated beyond native HTML `required`,
and nothing is sent anywhere. The phone field has a hardcoded "US" prefix with no country
picker or number validation.

We need, end to end:
1. A place in the CMS DB to store submissions.
2. A CMS collection type + validated create endpoint for that table.
3. Seed data for it (matching the project's existing seed conventions).
4. A CMS admin view to read/manage submissions (Strapi's Content Manager, out of the box).
5. A website API route that validates and forwards submissions server-side.
6. Client-side validation on the form, matching the CMS's validation rules.
7. A real country-picker phone input (library install), replacing the static "US" prefix.

Reference implementation pattern already in the codebase for the *client* side of a form:
`components/waitlist/sections/WaitlistFormSection.tsx` (controlled inputs, no `react-hook-form`,
no schema-validation lib yet — this is the first form that will actually persist data).

## 1. CMS: new collection type `contact-submission`

Location: `apt-cms/src/api/contact-submission/` (mirrors the existing `src/api/page` structure:
`content-types/`, `controllers/`, `routes/`, `services/`).

`content-types/contact-submission/schema.json`:

| field | type | notes |
|---|---|---|
| `firstName` | string, required | |
| `lastName` | string, required | |
| `email` | email, required | Strapi's built-in `email` type does format validation |
| `phoneCountry` | string, required | ISO 3166-1 alpha-2, e.g. `US` — from the country picker |
| `phone` | string, required | E.164 (`+15550000000`), validated server-side (see §3) |
| `message` | text, optional | |
| `agreedToPrivacyPolicy` | boolean, required, default `false` | must be `true` to accept |
| `status` | enumeration, default `new` | `new`, `read`, `responded`, `archived` — for CMS triage, not set by the public form |
| `sourcePath` | string, optional | page the form was submitted from, e.g. `/contact` (useful if the form is reused elsewhere later) |

`kind: "collectionType"`, `draftAndPublish: false` (submissions aren't editorial content —
no draft/publish workflow needed), `options.privateAttribute` not required.

Why a dedicated content type instead of reusing `page`/`global` components: submissions are
rows of user-submitted data, not site content — they need their own table, their own
permission model (public can *create*, nothing else), and they must never go through
`draftAndPublish`.

## 2. CMS: validation + the "endpoint to handle this data"

Strapi auto-generates REST CRUD routes from the schema (`POST /api/contact-submissions`,
etc. — same pattern as `page`/`global`). Schema-level validation (`required`, `email` type)
covers the basics, but per the ask we add an explicit custom controller so invalid payloads
are rejected with clear errors before they ever hit the DB:

`src/api/contact-submission/controllers/contact-submission.ts`:
- Override `create` (via `factories.createCoreController`, same override pattern used
  elsewhere in this Strapi version).
- Validate with `zod` (new dependency in `apt-cms`) — shared shape with the website's schema
  (§6) so both sides agree on what "valid" means:
  - `email`: RFC-shape check.
  - `phone`: validate with `libphonenumber-js` (`isValidPhoneNumber(phone, phoneCountry)`) —
    same library family the website will use for the picker (§7), so a number the UI accepts
    is guaranteed to pass here too.
  - `message`: optional — if present, trim and cap at a max length; an empty/whitespace-only
    value is normalized to empty rather than rejected.
  - `agreedToPrivacyPolicy`: must be `true`.
  - Basic spam guard: honeypot field (`companyWebsite` or similar, hidden via CSS, must be
    empty) rejected silently with a 200 so bots can't tell it worked.
- On validation failure: `ctx.badRequest(message, { errors })` with per-field messages the
  website's API route can pass straight through to the form.
- On success: force `status: "new"` and strip any client-supplied `status` before calling
  `super.create(ctx)`, so the public endpoint can never set an arbitrary status.
- Reject any request that includes relation/id fields a public caller shouldn't set.

## 3. CMS: permissions

Follow the existing pattern in `apt-cms/src/index.ts` (`grantPublicPermission`, used for
`api::page.page.update` per `grant-permission.js`) rather than the raw-SQL script version —
add a bootstrap grant for **only** `api::contact-submission.contact-submission.create` on the
`public` role. Explicitly do **not** grant `find`/`findOne`/`update`/`delete` to `public` —
reading and managing submissions is admin-only (via the authenticated Content Manager), so
strangers can't enumerate other people's contact details through the API.

## 4. CMS: seed data

Add `seedContactSubmissions(strapi)` to `apt-cms/src/index.ts`, following the same
"skip if any already exist" guard used by `seedGlobal`/`seedCareerPage`. Seed 3–4 realistic
sample rows covering different `status` values (`new`, `read`, `responded`) so the Content
Manager list view has something to demo/filter on immediately after a fresh `npm run develop`.

## 5. CMS: admin display

No custom admin UI needed — Strapi's Content Manager auto-generates a list + detail view for
any collection type. We'll set sensible defaults via `content-types/contact-submission/schema.json`
`pluginOptions`/the Content Manager's own settings (list columns: `firstName`, `lastName`,
`email`, `status`, `createdAt`; default sort: `createdAt:desc`) so the CMS user opens it and
immediately sees new submissions first. This is a couple of clicks in the admin UI (or a
`configuration` seed entry), not new code.

## 6. Website: `/api/contact` route

New file: `app/api/contact/route.ts` (same directory pattern as the existing
`app/api/preview` and `app/api/revalidate` routes).

- `POST` handler:
  1. Parse JSON body.
  2. Validate with a `zod` schema (new dependency) — same shape as the CMS's (§2), so
     obviously-bad requests are rejected before an outbound fetch, and the two schemas are
     kept in one small shared-shape comment so they don't drift.
  3. Forward the validated payload to `${STRAPI_URL}/api/contact-submissions` with
     `Authorization: Bearer ${STRAPI_API_TOKEN}` (reuses the existing env var already read in
     `lib/cms/client.ts` — a token scoped to `contact-submission: create` only).
  4. On Strapi validation failure, relay the field errors back as `400` with a body the form
     can map to per-field messages.
  5. On success, `200` with `{ ok: true }`. On network/Strapi-down failure, `502` with a
     generic "try again" message — mirrors the existing "don't 500 the site if Strapi is
     unreachable" philosophy in `cmsFetch` (`lib/cms/client.ts`), but a *write* can't silently
     return `null` like a read does, since the user needs to know it didn't go through.
  6. Basic abuse guard: reject if the honeypot field is filled; optionally a lightweight
     in-memory rate limit per IP (e.g. 5 requests/10 min) — enough to blunt naive bots without
     adding infra (Redis etc. is out of scope here).

## 7. Website: phone country-picker library

Install:
- **`react-phone-number-input`** — the input + country dropdown component.
- **`libphonenumber-js`** — its peer dependency; also reused for the E.164 validation in
  the `/api/contact` zod schema (`isValidPhoneNumber`), so client, API route, and CMS all
  validate phone numbers the same way (§2).

Why this pair over alternatives (e.g. `react-international-phone`): it's the most widely
used option, has a documented "build your own UI" mode (`react-phone-number-input/input`)
which lets us keep the exact Figma look (flag + code + chevron button feeding a styled
`<input>`) instead of adopting the library's default styling, and `libphonenumber-js` gives
correct per-country formatting/validation instead of a naive regex.

## 8. Website: form validation + wiring

Rework `ContactFormSection.tsx` to match the controlled-input + inline-error pattern (closer
to `WaitlistFormSection.tsx`'s controlled state, but adding real error display which that
component doesn't have either):

- Convert every field to controlled state (`firstName`, `lastName`, `email`, `phone`,
  `phoneCountry`, `message`, `agreedToPrivacyPolicy`).
- Drop the `required` attribute currently on the `message` `<textarea>` — message is optional,
  so an empty message must be allowed to submit.
- Add a shared `zod` schema (`lib/validation/contactForm.ts` or similar) — the single source
  of truth the form validates against on submit (and optionally on blur per field).
- Replace the static "US" pill with `PhoneInput` from `react-phone-number-input/input`,
  keeping the existing Tailwind classes/border/focus-ring styling so it's visually identical
  to the current Figma-matched markup, just functional.
- On submit: run zod validation client-side first (fast feedback, no round trip for obvious
  errors) → `fetch("/api/contact", { method: "POST", body: ... })` → handle loading /
  success / per-field server error states (e.g. if the CMS's stricter phone check disagrees
  with the client's, though the shared library should make that rare).
- Keep the existing inline "Thanks — we'll be in touch soon." success message pattern (no
  redirect to `/thank-you`, unlike the waitlist form) unless you'd rather match that flow —
  flagging this as a decision point, not assuming it.

## Order of work

1. CMS content type + schema + migrations (Strapi generates migrations from schema changes
   automatically on `develop` boot).
2. CMS custom controller + validation + honeypot.
3. CMS permissions grant (public: create only).
4. CMS seed data.
5. Verify via CMS admin + `curl POST /api/contact-submissions` with a token.
6. Website `/api/contact` route + shared zod schema.
7. Install `react-phone-number-input` + `libphonenumber-js`.
8. Rework `ContactFormSection.tsx`: controlled state, validation, phone picker, submit wiring.
9. End-to-end test: submit from the real `/contact` page → confirm the row appears in the
   Strapi Content Manager with the correct data and `status: new`.

## Open questions (will confirm before or during implementation)

- Exact `status` enum values / whether email notifications on new submissions are wanted
  (out of scope for this plan as stated — flagging in case it's assumed).
- Whether the honeypot/rate-limit anti-spam measures are enough, or whether something
  stronger (e.g. hCaptcha) is expected.
- Whether the CMS needs a dedicated API token minted for this (`STRAPI_API_TOKEN` is
  currently blank in `.env.local`) — will need creating in the Strapi admin and adding to
  both `.env.local` (website) and documented in `.env.example`.
