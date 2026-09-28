# Newsletter signup form — CMS-backed submission pipeline

Status: **implementing now** — same turn as this plan, per request. Same shape of work as
[`contact-form-cms-integration-plan.md`](./contact-form-cms-integration-plan.md) and
[`waitlist-form-cms-integration-plan.md`](./waitlist-form-cms-integration-plan.md), scaled
down for a one-field form. Read those for the fuller rationale (dedicated content type,
permissions model, honeypot, rate limit) — this plan only calls out what's different.

## Scope

`components/contact/NewsletterCtaSection.tsx` — the "Join 2,000+ subscribers" band shown
below the contact form on `/contact` — is UI-only: one email `<input>`, `onSubmit` just
flips a local `status` flag. No validation beyond native `required`, nothing stored.

## Fields

| field | type | notes |
|---|---|---|
| `email` | email, required, **unique** | the only field the UI collects |
| `status` | enumeration, default `subscribed` | `subscribed` \| `unsubscribed` — for a future unsubscribe flow; not set by the public form |
| `sourcePath` | string, optional | e.g. `/contact` |

No consent checkbox exists in this form's UI (just a "we care about your data" privacy-policy
link, not a tickbox) — so unlike contact/waitlist, there's no `agreedTo*` field to validate.

`email` is **unique** at the schema level (`"unique": true`) — re-submitting an address that's
already subscribed is a normal, expected action (someone re-finds the form, isn't sure if they
signed up), not an error. The controller treats it as an idempotent success rather than a
409/validation failure.

## 1. CMS: new collection type `newsletter-subscriber`

`apt-cms/src/api/newsletter-subscriber/`, same `content-types/`/`controllers/`/`routes/`/
`services/` shape. `draftAndPublish: false`.

## 2. CMS: validation + endpoint + idempotent dedup

`controllers/newsletter-subscriber.ts` overrides `create`:
- zod: `email` required + valid, honeypot field must be empty (same silent-200-on-trip
  pattern as contact/waitlist).
- **Before inserting**, look up an existing row by `email`. If found, return `200` with that
  existing row (no duplicate created, no error) — resubscribing isn't a failure case.
- Otherwise force `status: "subscribed"` and create.

## 3. CMS: permissions

`api::newsletter-subscriber.newsletter-subscriber.create` → `public`, nothing else — same
reasoning as the other two forms.

## 4. CMS: seed data

`seedNewsletterSubscribers(strapi)`, 3 rows, skip-if-any-exist guard, same as the others.

## 5. Website: `/api/newsletter` route

`app/api/newsletter/route.ts`, same shape as `/api/contact` and `/api/waitlist`: zod-validate,
forward to `${STRAPI_URL}/api/newsletter-subscribers`, honeypot + per-IP rate limit, `502` if
Strapi's unreachable.

## 6. Website: form validation + wiring

Rework `NewsletterCtaSection.tsx`: controlled email input, shared zod schema
(`lib/validation/newsletterForm.ts`), inline error text, honeypot field, submit → `/api/newsletter`
→ inline "You're subscribed — thanks!" on success (already the pattern here, no redirect
involved — unlike waitlist, this form doesn't send anyone to `/thank-you`).

## Order of work

1. CMS content type + controller (dedup-by-email) + permissions + seed.
2. Verify via CMS admin + `curl POST /api/newsletter-subscribers` (including the
   resubscribe-is-idempotent case).
3. Website `/api/newsletter` route + shared zod schema.
4. Rework `NewsletterCtaSection.tsx`.
5. End-to-end test: submit from the real `/contact` page → confirm the row appears in the
   Strapi Content Manager, and submitting the same email twice doesn't create a duplicate.
