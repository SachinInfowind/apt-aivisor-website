/** Shared typography helpers — maps to Tailwind theme tokens in globals.css / tailwind.config.ts */
export const type = {
  display: "font-display text-display font-normal",
  displayItalic: "font-display text-display-italic font-normal italic",
  h1: "font-display text-h1 font-normal",
  h2: "font-display text-h2 font-normal",
  h2Lg: "font-display text-h2-lg font-normal",
  h3: "font-display text-h3 font-normal",
  h3Lg: "font-display text-h3-lg font-normal",
  h4: "font-display text-h4 font-normal",
  h5: "font-display text-h5 font-normal",
  quote: "font-display text-quote font-normal",
  quoteXl: "font-display text-quote-xl font-normal",
  bodyLg: "font-body text-body-lg font-normal",
  bodyMd: "font-body text-body-md font-normal",
  body: "font-body text-body font-normal",
  body15: "font-body text-body-15 font-normal",
  bodySm: "font-body text-body-sm font-normal",
  bodyXs: "font-body text-body-xs font-normal",
  caption: "font-body text-caption font-normal",
  micro: "font-body text-micro font-normal",
  label: "font-body text-body-sm font-medium",
  nav: "font-body text-body font-semibold",
  button: "font-body text-body font-semibold",
  buttonLg: "font-body text-body-md font-semibold",
  eyebrow: "font-body text-body-sm font-medium",
  stat: "font-display text-stat-lg font-normal",
  statXl: "font-display text-stat-xl font-normal",
  accent: "italic text-brand-accent",
} as const;

/** Full-bleed sections; content column widens on large screens */
export const layout = {
  sectionX: "px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20",
  sectionY: "py-12 sm:py-16 md:py-20 xl:py-24",
  /** Content width: fluid → 1680 → 1920 on very large screens */
  inner: "mx-auto w-full max-w-content 2xl:max-w-page",
} as const;
