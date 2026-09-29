# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` / `npm run build` / `npm start` — standard Next.js (v16, React 19, Tailwind 4). Node is pinned to 26.10.0 (`.nvmrc`, `engines`).
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`).
- There is no test runner configured.
- Env vars: copy `.env.example`. `STRAPI_URL` (default `http://localhost:1337`), `STRAPI_API_TOKEN`, `STRAPI_REVALIDATE_SECRET`, `PREVIEW_SECRET`, `STRAPI_MEDIA_HOSTNAME`. The Strapi backend is a sibling project (`../aptaivisor-cms`, seeded from its `src/index.ts`).
- Root-level `*.js` files (`add_cms_components.js`, `query_cms.js`, `update_api.js`, …) are one-off scripts, not part of the app.

## Architecture

This is a marketing site whose content is served from a **Strapi CMS**. It grew out of a generic Next.js boilerplate, so the README describes boilerplate features (Redux `store/`, `hooks/useApi.ts`, `hoc/withLayout`, `middleware.ts` auth redirects, `app/dashboard`, `app/ssr-example`) that are largely unrelated to the real site. Middleware skips `/api`.

### CMS layer (`lib/cms/`)
- `client.ts` is `server-only`. `cmsFetch` adds the bearer token, switches to `status=draft` when Next draft mode is on, tags every fetch with `cms` (plus per-query tags), and returns `null` instead of throwing when Strapi is unreachable. In dev, revalidate is 0; in production, cache is indefinite until revalidated.
- `queries.ts` holds the `SECTIONS_POPULATE` map: a per-`__component` Strapi `populate` spec. **A new section type needs an entry here**, or its relations/media come back empty.
- `types.ts` defines `CmsPage`, `CmsGlobal` (header/footer singleton) and the `PageSection` discriminated union.
- Cache invalidation: Strapi webhook → `POST /api/revalidate` (header `x-revalidate-secret`) calls `revalidateTag` for `cms`, `pages`, `page:<slug>`, `global`. `/api/preview` enables draft mode.

### Pages and sections
- Content pages are a Strapi `page` with a dynamic zone `sections`, rendered by `components/cms/SectionRenderer.tsx`. Its `switch` on `section.__component` is the single mapping from CMS component to React component.
- Adding a section means three edits: the type in `lib/cms/types.ts`, the `populate` entry in `queries.ts`, and a `case` in `SectionRenderer`. The Strapi component schema and seed live in the CMS repo.
- Some pages have explicit routes (`app/career`, `pricing`, `contact`, `design-partner`, …). `app/[slug]/page.tsx` is a catch-all that renders any other CMS page, so a page created only in Strapi goes live with no code. Its `EXPLICIT_ROUTE_SLUGS` set must stay in sync with the explicit route folders.
- Section components live under `components/<page>/sections/`. `components/ui/` holds shared primitives, fonts (`homeSans`/`homeSerif`, applied at page level) and tokens.

### Form submissions
Contact, newsletter, waitlist and design-partner forms follow one pipeline:
client form → `app/api/<form>/route.ts` → zod schema in `lib/validation/<form>Form.ts` → POST to a Strapi collection. Routes use an in-memory per-IP rate limit (resets on restart, not shared across instances) and return field errors as `{ message, errors: { field: msg } }`. The CMS supplies only the form's heading and copy; the field list is hardcoded in the React component.

### Planning docs
`md_file/*-cms-integration-plan.md` records the design and decisions for each CMS-backed page or form. Read the relevant one before changing that page.
