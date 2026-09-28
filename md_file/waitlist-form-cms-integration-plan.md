# Waitlist "Reserve your spot" form — CMS-backed submission pipeline

Status: **planning only** — no code written yet. This is the plan to review before implementation starts.

Same shape of work as [`contact-form-cms-integration-plan.md`](./contact-form-cms-integration-plan.md)
(CMS collection → validated endpoint → seed → website API route → client validation),
adapted to this form's fields. Read that file for the fuller rationale on *why* each
piece exists (dedicated content type, permissions model, honeypot, etc.) — this plan
only calls out what's different for the waitlist form, plus the corrected phone-input
lesson learned while building the contact form.

## Scope

The "Reserve your spot" form (`components/waitlist/sections/WaitlistFormSection.tsx`,
rendered via the CMS-managed `sections.waitlist-form` block on the `/waitlist` page) is
currently UI-only: controlled inputs with `canSubmit` client-side gating, but `onSubmit`
just does `router.push(successHref || "/thank-you")` — nothing is validated against a
real schema and nothing is stored anywhere.

We need, end to end:
1. A place in the CMS DB to store signups.
2. A CMS collection type + validated create endpoint for that table.
3. Seed data for it.
4. A website API route that validates and forwards submissions server-side.
5. Client-side validation on the form, replacing the current ad-hoc `canSubmit` boolean.
6. Keep the existing redirect-to-`/thank-you` behavior — it's already there and already
   correct — but only fire it *after* a confirmed successful save, not on click.

Unlike the contact form, there's **no phone field** on this form (see screenshots) — so
none of the country-picker work applies here. One less moving part.

## Fields (from the Figma screenshots + the existing component's state)

| field | type | notes |
|---|---|---|
| `fullName` | string, required | |
| `email` | email, required | labelled "Work email" in the UI; still just a standard email field, no work-vs-personal domain check |
| `company` | string, required | |
| `role` | string, required | one of `ROLE_OPTIONS` in `components/waitlist/formOptions.ts` (`ceo-founder`, `cfo-vp-finance`, `cto-vp-eng`, `vp-sales`, `deal-desk`, `procurement-legal`, `revops-finops`, `other`) |
| `interest` | enumeration, required | `buyer` \| `seller` \| `both` — the three pill buttons |
| `spend` | string, optional | one of `SPEND_OPTIONS` (`under-1m`, `1m-5m`) — dropdown is optional in the current UI, keep it that way |
| `notes` | text, optional | "Anything specific you want aptAIvisor to solve?" |
| `agreedToTerms` | boolean, required, must be `true` | terms + privacy consent checkbox |
| `status` | enumeration, default `new` | `new`, `contacted`, `invited`, `declined` — different vocabulary from the contact form's `status` since this is a waitlist funnel, not a support inbox; happy to align naming if you'd rather keep one shared vocabulary across both |
| `sourcePath` | string, optional | e.g. `/waitlist` |

`role` and `spend` are validated as free-form strings matching the known option values
(not a Strapi `enumeration`) so adding an option in `formOptions.ts` doesn't also require
a CMS schema migration — same reasoning as keeping `phoneCountry` a plain string in the
contact form rather than a hard-coded enum.

## 1. CMS: new collection type `waitlist-signup`

Location: `apt-cms/src/api/waitlist-signup/` (same `content-types/` / `controllers/` /
`routes/` / `services/` structure as `contact-submission`).

`kind: "collectionType"`, `draftAndPublish: false` — same reasoning as the contact form:
this is user-submitted data, not editorial content.

## 2. CMS: validation + endpoint

`src/api/waitlist-signup/controllers/waitlist-signup.ts` — override `create`, same pattern
as `contact-submission`'s controller:
- Validate with `zod`:
  - `fullName`, `email`, `company`: required, trimmed, length-capped.
  - `role`: required, must be one of the known `ROLE_OPTIONS` values (kept in sync by hand
    with `formOptions.ts`, same cross-repo caveat as the contact form's shared shape).
  - `interest`: required, must be `"buyer" | "seller" | "both"`.
  - `spend`: optional, must be one of the known `SPEND_OPTIONS` values when present.
  - `notes`: optional, trimmed, length-capped.
  - `agreedToTerms`: must be `true`.
  - Honeypot field, same silent-200-on-trip behavior as the contact form.
- Force `status: "new"` server-side; strip any client-supplied `status`.
- `ctx.badRequest(message, { errors })` on failure, same per-field shape the website route
  relays to the form.

## 3. CMS: permissions

Bootstrap grant for **only** `api::waitlist-signup.waitlist-signup.create` on `public` —
same reasoning as the contact form: no `find`/`update`/`delete` for public, signups are
admin-only to read via the Content Manager.

## 4. CMS: seed data

`seedWaitlistSignups(strapi)` in `apt-cms/src/index.ts`, same "skip if any exist" guard.
3–4 rows spanning `interest` (buyer/seller/both) and a couple of `status` values.

## 5. Website: `/api/waitlist` route

New file: `app/api/waitlist/route.ts`, same shape as `app/api/contact/route.ts` — parse,
validate with a shared `zod` schema (`lib/validation/waitlistForm.ts`), forward to
`${STRAPI_URL}/api/waitlist-signups`, relay field errors as `400`, `502` if Strapi is
unreachable, same honeypot + per-IP rate-limit guard.

## 6. Website: form validation + wiring

Rework `WaitlistFormSection.tsx`:
- Replace the current `canSubmit` boolean (which only checks presence, not shape — e.g.
  it doesn't check `email` actually looks like an email) with the shared zod schema, plus
  inline per-field error display (this component doesn't have any error UI today, only a
  disabled-button state).
- On submit: validate client-side → `fetch("/api/waitlist", ...)` → on success,
  `router.push(successHref || "/thank-you")` — **this part doesn't change**, it's already
  correct, it just needs to move from firing on every click to firing only after the save
  is confirmed.
- On failure: show the same inline server-error banner pattern used on the contact form,
  map field errors back onto the role/interest/spend controls.
- `role` and `spend` already go through `SelectDropdown` (`components/ui/SelectDropdown.tsx`)
  — that component is already a proper custom dropdown (opens downward, height-capped,
  scrollable, matches the design system), **not** a native `<select>`, so none of the
  "opens upward / unstyleable / no max-height" issues hit on the contact form's country
  picker apply here. No new dropdown component needed.

## A lesson carried over from the contact form (for anything here that ends up controlled)

The contact form's phone field hit a real "Maximum update depth exceeded" loop from
`react-phone-number-input`: its internal state reports `undefined` for an incomplete
value and expects that exact `undefined` fed back as the controlled `value` prop; coercing
it to `""` before feeding it back made the library's internal state permanently disagree
with ours, which reset the field on every keystroke and spiralled into the update-depth
error. The fix that's now live is to **not** control that particular input's `value` at
all — let it manage its own internal state, listen only via `onChange`, and reset it by
changing its React `key` (on submit success / country change) instead of forcing a `value`
prop. This isn't directly relevant to the waitlist form (no third-party controlled-input
library here — `SelectDropdown` is in-house and already behaves), but it's worth keeping
in mind if any future field here ends up wrapping a controlled third-party input: don't
assume a coerced `""` is a safe stand-in for that library's own `undefined`/empty state —
check what it actually expects back.

## Order of work

1. CMS content type + schema (`waitlist-signup`).
2. CMS custom controller + validation + honeypot.
3. CMS permissions grant (public: create only).
4. CMS seed data.
5. Verify via CMS admin + `curl POST /api/waitlist-signups`.
6. Website `/api/waitlist` route + shared zod schema.
7. Rework `WaitlistFormSection.tsx`: real validation, inline errors, submit wiring,
   redirect-only-on-confirmed-success.
8. End-to-end test: submit from the real `/waitlist` page → confirm the row appears in the
   Strapi Content Manager with the correct data and `status: new`, and the redirect to
   `/thank-you` only happens after that save succeeds (test the Strapi-down case too —
   the redirect must *not* fire then).

## Open questions

- `status` vocabulary (`new`/`contacted`/`invited`/`declined` proposed above) — confirm
  before I build it, or say if you'd rather reuse the contact form's `new`/`read`/
  `responded`/`archived` set for consistency across both content types.
- Whether `role`/`spend` should become real CMS-editable option lists (so non-engineers
  can add a role without a code change) instead of hard-coded in `formOptions.ts` — out of
  scope as currently written, flagging in case it's assumed.
- Same honeypot/rate-limit question as the contact form: good enough, or is something
  stronger (hCaptcha) expected here too, given this form is more likely to attract bot
  signups than the contact form.
