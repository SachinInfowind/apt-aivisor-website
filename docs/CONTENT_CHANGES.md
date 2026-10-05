# Content / text changes (2026-10-01)

Text that was changed to match the Figma "Design System for APT AI Visor".
Most of it lives in **Strapi, not in git**, so a code merge will not carry it.
Re-apply the Strapi values below on any other environment (staging / prod).

Page: **Home** (`documentId: dcqkdts8r6oge5o1jp7h5oco`, slug `home`).

---

## 1. Strapi content changes

### 1.1 Problem grid (`sections.problem-grid`)

Unchanged: badge "The Problem", heading "Your vendors know exactly what you should pay.", accent "You don't."

**Subheading**

> Enterprise procurement teams have benchmarks, playbooks, and dedicated analysts. Everyone else has a spreadsheet and a gut feeling.

**Cards** (order matters; `title` / `description` / `meta`)

| # | Title | Description | Meta |
|---|-------|-------------|------|
| 1 | No pricing benchmarks | You have no idea if the quote you just received is fair, inflated, or what comparable companies are paying. | Affects 78% of startups |
| 2 | Renewals sneak up | Auto-renewal windows close silently. By the time you notice, the leverage was 90 days ago. | Avg 23-day notice window |
| 3 | Deal Desk bottlenecks | Manual P&L builds, redline reviews, and approval cycles add weeks to deals that should close in days. | Avg 18-day deal delay |
| 4 | Tools built for giants | Solutions from Vendr and Tropic start at $20K–36K/yr and require millions in existing SaaS spend to qualify. | $36K+ to get started |

Previous values (for reference): "No price transparency", "Hidden risks", "Wasted time", "Siloed knowledge"; no `meta`; subheading "Most startups and mid-market companies sign technology contracts without knowing what the market pays, …".

### 1.2 Waitlist band (`sections.waitlist`)

**Heading** — the `\n` is intentional: line 1 renders upright, everything after it renders italic (see §2).

```
Your next technology contract
should cost less.
```

(was: "Which side of the deal are you on?")

**Subhead**

> Join the aptAIvisor waitlist. Be first to access pricing benchmarks, contract intelligence, and negotiation playbooks for your vendor stack. Launching in Q1 2027.

(was: "Join the aptAIvisor waitlist. Pick your plan when we launch and get 20% off your first year.")

Other waitlist fields already matched Figma and were not touched
(`joinLabel`, `trustText`, `contactLabel`, `contactHref`).

> Strapi note: updating via the REST API needs the **draft** component ids
> (`?status=draft`), and a token with update permission on Pages. Edits in the
> admin UI are safer than scripts — a script PUT replaces the whole `sections`
> list, so any section it omits is dropped.

### 1.3 Solutions page — "Real problems. Real workflows." (`sections.solutions-workflows`)

Page: **Solutions** (slug `solutions`). This section previously had **no**
`badge` / `heading` / `headingAccent` / `subhead` fields at all (schema gap,
now fixed — see the CMS-side schema change below), so it rendered with no
heading. Set on this environment, needs re-applying on others:

| Field | Value |
|---|---|
| `badge` | Use cases |
| `heading` | Real problems. |
| `headingAccent` | Real workflows. |
| `subhead` | The situations where aptAIvisor pays for itself immediately. |

**Schema change (ships with git, additive/safe):** `src/components/sections/solutions-workflows.json`
in `apt-cms` gained these four `string` attributes. Any environment that pulls
the updated `apt-cms` code gets the fields automatically; only the **content**
above needs to be re-entered per environment (or restored via a re-exported
seed archive — see `apt-cms/MIGRATION.md` §4).

---

## 2. Code that depends on the text above

| File | What it does | Depends on |
|------|--------------|------------|
| `components/home/sections/WaitlistSection.tsx` | Splits `heading` on `\n`: first line upright, rest italic on its own line. A heading with no `\n` stays fully italic as before. Also removes the 1px text-stroke that made the heading look bold. | Waitlist heading containing `\n` |
| `components/home/sections/PricingSection.tsx` | The last word of `headingAccent` drops to its own centered line ("both sides of the / deal."). | Feature-table accent "both sides of the deal." |

### Stats section — resolved

The Strapi `heading`/`headingAccent` split recommended below was applied on
this environment (`heading` = "See Why Customer", `headingAccent` = "Love
Us"), and the now-dead fallback that inferred the split in
`StatsSection.tsx` has been removed. **Other environments still need the
same Strapi edit** (or a re-exported seed archive) — without it the Stats
heading renders as one plain black line, since there's no code fallback left
to paper over it.

---

## 3. Known differences from Figma still open (text)

- Footer **Legal** column: Figma shows "Terms of Service", "Trust & Security", "Cookies", "Privacy Policy", "Contact". Strapi/`Footer.tsx` default has "Terms" and no "Privacy Policy".
- Footer column headings are all-caps in code; Figma uses sentence case ("Company").
- Waitlist subhead font size is larger in code than in Figma (text matches; size not changed).

---

## 4. Non-text files changed in the same session (for the merge)

Layout / style fixes, no content impact:

- `components/layout/Header.tsx` — About dropdown anchored to the nav, full nav width, 24px radius, grey right panel.
- `components/home/sections/ProblemSection.tsx` — heading max width 640px (two lines), card border removed, meta line pinned to card bottom.
- `components/home/sections/HowItWorksSection.tsx` — preview box height = accordion; logos row separate (`lg:contents` grid).
- `components/home/sections/WhoItIsForSection.tsx` — "+N" avatar badge stacks above avatars (`relative`).
- `components/home/sections/PricingSection.tsx` — fixed 6.5rem header row for the aptAIvisor plan column (now rendered via `CmsImage`, not a static asset).
- `components/layout/Footer.tsx` — white background, logo + Join CTA on one row, columns below (3fr/7fr), grey copyright strip.

### Superseded during the merge into `feat/aryan/s3` (not applied as written)

This branch was cut before the site moved to "every section/image comes from
the CMS" (see `apt-cms/MIGRATION.md` §11). Two of its edits reverted that
work and were **not** carried over; the underlying CMS-driven code was kept
instead:

- `components/home/sections/ModulesSection.tsx` — this branch replaced the
  CMS-driven `items` prop with a hardcoded `modules` array + static image
  imports (including the "chatbot preview: transparent frame" tweak). Kept
  the CMS-driven version instead. **If the transparent-frame treatment is
  still wanted,** it needs to be redone as a CMS image / `variant` change, not
  a hardcoded array.
- `public/assets/pricing-apt-header.svg` — this branch cropped the static
  asset's `viewBox`; the asset itself was already deleted on `feat/aryan/s3`
  because `PricingSection.tsx`'s header image now comes from Strapi
  (`headerImage`, via `CmsImage`). **If the crop is still wanted,** re-crop
  the image in Strapi's media library, not this file (which no longer exists).
