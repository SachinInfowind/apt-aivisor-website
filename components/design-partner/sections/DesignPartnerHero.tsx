import Link from "next/link";
import { CloudBand } from "@/components/ui/CloudBand";
import { HeroGlow } from "@/components/ui/HeroGlow";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type { DesignPartnerHeroSection } from "@/lib/cms/types";

/**
 * Design Partner hero — Figma "Hero" (3311:11801): mesh gradient + two blurred
 * glows, centred copy, and the shared cloud band along the bottom edge.
 */
export function DesignPartnerHero({
  badgeLabel,
  heading,
  headingAccent,
  headingAfter,
  subhead,
  ctaLabel,
  ctaHref,
}: DesignPartnerHeroSection) {
  return (
    <section
      className={`relative flex min-h-hero w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)]`}
    >
      <HeroGlow />

      <div
        className={`${layout.inner} relative z-1 flex w-full max-w-[76rem] flex-col items-center gap-[2.625rem] text-center`}
      >
        <div className="flex w-full flex-col items-center gap-6">
          {badgeLabel ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1 shadow-field">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <circle className="fill-info" cx="4" cy="4" r="3" />
              </svg>
              <span className="text-sm font-medium leading-5 text-ink">
                {badgeLabel}
              </span>
            </div>
          ) : null}

          <div className="flex w-full flex-col items-center gap-9">
            <h1 className="flex w-full flex-col items-center gap-[0.1em]">
              <span
                className={`${homeSerif.className} block text-[clamp(2.5rem,6.9vw,6.25rem)] font-normal italic leading-[0.9] text-navy text-stroke-brand`}
              >
                {heading}
                {headingAccent ? (
                  <>
                    {" "}
                    <span className="text-brand">{headingAccent}</span>
                  </>
                ) : null}
              </span>
              {headingAfter ? (
                <span
                  className={`${homeSerif.className} block text-[clamp(2.5rem,6.9vw,6.25rem)] font-normal leading-none text-navy text-stroke-brand`}
                >
                  {headingAfter}
                </span>
              ) : null}
            </h1>

            {subhead ? (
              <p className="max-w-[66rem] text-base leading-7 text-ink sm:text-xl sm:leading-title-sm">
                {subhead}
              </p>
            ) : null}
          </div>
        </div>

        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full border border-brand bg-brand px-5.5 py-4 text-lg font-semibold leading-7 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      <CloudBand priority variant="edge" />
    </section>
  );
}
