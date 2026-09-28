import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { HomeHeroSection } from "@/lib/cms/types";

/**
 * Hero — Figma Frame 127 (26193:18318, 1440×896).
 * Type in rem; headline caps at Figma 100px → 6.25rem.
 */
export function Hero({
  eyebrow,
  headline,
  headlineAccent,
  subhead,
  ctaLabel,
  ctaHref,
}: HomeHeroSection) {
  return (
    <section
      // min-h is capped (min(100svh, Nrem)) as well as being a floor: on a
      // normal browser window it fills the screen like a hero should, but on
      // an unusually tall/narrow viewport (a resized devtools panel, a very
      // tall phone) an uncapped 100svh stretches the hero to fill all of it,
      // leaving a huge dead gap of empty gradient below the content. Padding
      // is viewport-height-driven (clamp with a vh term) instead of fixed per
      // breakpoint: fixed rem padding was tuned against the Figma 1080px-tall
      // canvas, so on shorter real browser viewports the content (badge +
      // heading + paragraph + button) plus that padding added up to more
      // than 100svh, pushing the CTA button below the fold. Scaling padding
      // down with vh keeps the whole hero within one screen either way.
      // pt and pb are split (not py) because pt has an extra constraint pb
      // doesn't: the floating header is `position:absolute`, so it doesn't
      // push Hero's content down on its own — pt's clamp floor must stay at
      // or above the header's own height (72/88/96/112px per breakpoint,
      // from Header.tsx's h-14/16/nav-h + pt-4/6/8/nav-top) at every
      // breakpoint, or the badge renders tucked behind/under the header on
      // viewports short enough that the vh term alone undershoots it.
      className={`relative flex min-h-[min(100svh,56rem)] w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(2.5rem,12svh,10.9375rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)] xl:min-h-[min(100svh,67.5rem)] xl:pb-[clamp(2.5rem,16svh,13.75rem)] xl:pt-[clamp(9.5rem,18svh,15rem)]`}
    >
      {/* Figma groups this as 3 nested levels with 3 different gaps — badge↔
          text 24px, heading↔paragraph 36px, text-group↔button 42px (all at
          the 1440 reference) — not one flat gap applied to every sibling, or
          the badge ends up as far from the heading as the button is. */}
      <div className="relative z-[1] flex w-full max-w-[54.125rem] flex-col items-center gap-8 text-center sm:gap-10 md:gap-12">
        <div className="flex w-full flex-col items-center gap-4 sm:gap-6 md:gap-8">
          {/* Badge — Figma 14px → 0.875rem */}
          {eyebrow && (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1 text-[0.875rem] font-medium leading-5 text-ink shadow-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-badge-dot"
                aria-hidden
              />
              {eyebrow}
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-[2.625rem]">
            <h1
              className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
            >
              <span className="text-hero-display block text-display leading-none">
                {headline}
              </span>
              {headlineAccent && (
                <span className="text-hero-negotiating mt-1 block overflow-visible pb-[0.12em] text-display-italic leading-[0.9] sm:mt-2">
                  {headlineAccent}
                </span>
              )}
            </h1>

            {subhead && (
              <p className="max-w-[40rem] text-[1rem] leading-7 text-ink sm:text-body-lg">
                {subhead}
              </p>
            )}
          </div>
        </div>

        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex h-12 min-w-[13.125rem] items-center justify-center rounded-pill border border-brand bg-brand px-5 text-[1rem] font-semibold text-white shadow-[0_1.25rem_1.5rem_-0.25rem_rgba(16,24,40,0.08),0_0.5rem_0.5rem_-0.25rem_rgba(16,24,40,0.03)] transition-all hover:bg-brand-hover hover:shadow-cta-hover active:scale-[0.98] sm:h-14 sm:px-[1.375rem] sm:text-[1.125rem]"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
