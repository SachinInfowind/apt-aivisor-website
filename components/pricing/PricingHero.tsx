"use client";

import { homeSerif } from "../ui/fonts";
import { HeroGlowAccent } from "../ui/HeroGlowAccent";
import type { PricingHeroSection } from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

/**
 * Pricing page hero — Figma Pricing (1:7620) top band.
 * Headline uses Group 1 font treatment (stroke + Instrument Serif).
 */

export type BillingPeriod = "monthly" | "yearly";

export function PricingHero({
  billing,
  onBillingChange,
  yearlyDiscountPercent = 17,
  hero,
}: {
  billing: BillingPeriod;
  onBillingChange: (value: BillingPeriod) => void;
  yearlyDiscountPercent?: number;
  /** Copy from the CMS (`sections.pricing-hero`). */
  hero?: Partial<Omit<PricingHeroSection, "__component" | "id">>;
}) {
  const yearly = billing === "yearly";

  return (
    <header className="relative flex w-full flex-col items-center gap-8 overflow-hidden px-4 pb-[clamp(5rem,16vw,13rem)] pt-[clamp(9.5rem,18vw,15rem)] text-center sm:gap-10 sm:px-6 md:gap-12">
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

      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span
          className={`text-sm font-medium leading-[1.5] tracking-[-0.02em] ${
            yearly ? "text-[#446278]" : "text-[#001C2E]"
          }`}
        >
          {hero?.monthlyLabel}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label={hero?.toggleLabel || undefined}
          onClick={() => onBillingChange(yearly ? "monthly" : "yearly")}
          className={`relative h-6 w-11 shrink-0 rounded-pill p-0.5 transition-colors ${
            yearly ? "bg-brand-strong" : "bg-surface-muted"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-pill bg-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)] transition-transform ${
              yearly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>

        <span
          className={`text-sm font-medium leading-[1.5] tracking-[-0.02em] ${
            yearly ? "text-[#001C2E]" : "text-[#446278]"
          }`}
        >
          {hero?.yearlyLabel}
        </span>

        <span className="inline-flex items-center rounded-[32px] bg-[#ABEFC6] px-2.5 py-0.5 text-[13px] font-medium leading-[1.5] tracking-[-0.03em] text-black">
          {(hero?.saveLabel ?? "").replace("{percent}", String(yearlyDiscountPercent))}
        </span>
      </div>
      <CloudBand priority variant="edge" />
    </header>
  );
}
