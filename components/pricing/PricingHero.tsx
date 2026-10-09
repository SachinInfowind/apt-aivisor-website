"use client";

import { homeSerif } from "../ui/fonts";
import { HeroGlowAccent } from "../ui/HeroGlowAccent";
import type { PricingHeroSection } from "@/lib/cms/types";

/**
 * Pricing page hero — Figma Pricing (1:7620) top band.
 * Headline uses Group 1 font treatment (stroke + Instrument Serif).
 */

export type BillingPeriod = "monthly" | "yearly";

export function PricingHero({
  hero,
}: {
  /** Copy from the CMS (`sections.pricing-hero`). */
  hero?: Partial<Omit<PricingHeroSection, "__component" | "id">>;
}) {
  return (
    <header className="relative flex w-full flex-col items-center gap-8 overflow-hidden px-4 pb-8 pt-[clamp(9.5rem,18vw,15rem)] text-center sm:gap-10 sm:px-6 sm:pb-10 md:gap-12 md:pb-12">
      <HeroGlowAccent />
      <div className="relative z-[1] flex w-full max-w-[51.125rem] flex-col items-center gap-6 sm:gap-8 md:gap-[2.625rem]">
        <h1
          className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
        >
          <span className="text-hero-display block text-display leading-none">
            {hero?.heading}
          </span>
          <span className="text-hero-negotiating mt-1 block overflow-visible pb-[0.12em] text-display-italic leading-[0.9] sm:mt-2">
            {hero?.headingAccent}
          </span>
        </h1>
        <p className="max-w-[40rem] text-base leading-7 text-[#446278] sm:text-xl sm:leading-[1.5]">
          {hero?.subhead}
        </p>
      </div>
    </header>
  );
}
