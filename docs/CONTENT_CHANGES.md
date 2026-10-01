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

---

## 2. Code that depends on the text above

| File | What it does | Depends on |
|------|--------------|------------|
| `components/home/sections/WaitlistSection.tsx` | Splits `heading` on `\n`: first line upright, rest italic on its own line. A heading with no `\n` stays fully italic as before. Also removes the 1px text-stroke that made the heading look bold. | Waitlist heading containing `\n` |
| `components/home/sections/StatsSection.tsx` | If `headingAccent` is empty and `heading` ends with "Love Us", renders "Love Us" as the blue italic accent. | Stats heading "See Why Customer Love Us" |
| `components/home/sections/PricingSection.tsx` | The last word of `headingAccent` drops to its own centered line ("both sides of the / deal."). | Feature-table accent "both sides of the deal." |

### Recommended Strapi follow-up (optional)

- **Stats section:** set `heading` = "See Why Customer" and `headingAccent` = "Love Us". The code fallback in `StatsSection.tsx` then becomes a no-op and can be deleted.

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
- `components/home/sections/ModulesSection.tsx` — chatbot preview: transparent frame, no white box, image rescaled.
- `components/home/sections/HowItWorksSection.tsx` — preview box height = accordion; logos row separate (`lg:contents` grid).
- `components/home/sections/WhoItIsForSection.tsx` — "+N" avatar badge stacks above avatars (`relative`).
- `components/home/sections/PricingSection.tsx` — fixed 6.5rem header row, aptAIvisor logo `max-w-[7rem]`.
- `public/assets/pricing-apt-header.svg` — `viewBox` cropped to `62 0 126 74` (width/height 126×74); artwork unchanged.
- `components/layout/Footer.tsx` — white background, logo + Join CTA on one row, columns below (3fr/7fr), grey copyright strip.
