"use client";

import { useState } from "react";
import { PricingHero, type BillingPeriod } from "./PricingHero";
import { PricingPlans } from "./PricingPlans";
import { EnterprisePlan } from "./EnterprisePlan";
import { layout } from "@/components/ui/type";
import type {
  EnterprisePlanSection,
  PricingCatalogSection,
  PricingHeroSection,
} from "@/lib/cms/types";

/**
 * Holds the monthly/yearly billing toggle shared by the hero and the plan
 * cards. Split out so the rest of PricingPage can stay a server component.
 */
export function PricingBillingSection({
  catalog,
  hero,
  enterprise,
  yearlyDiscountPercent,
}: {
  catalog: PricingCatalogSection | undefined;
  hero: PricingHeroSection | undefined;
  enterprise: EnterprisePlanSection | undefined;
  yearlyDiscountPercent: number;
}) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <>
      <PricingHero
        billing={billing}
        onBillingChange={setBilling}
        yearlyDiscountPercent={yearlyDiscountPercent}
        hero={hero}
      />

      <div className={`relative ${layout.sectionX} pt-8 sm:pt-10 md:pt-12`}>
        {/* Fades the hero's white cloud floor into the gradient band below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent"
        />
        <div
          className={`${layout.inner} relative z-[1] flex flex-col gap-8 sm:gap-10 md:gap-[6.25rem]`}
        >
          <PricingPlans
            billing={billing}
            catalog={catalog}
            yearlyDiscountPercent={yearlyDiscountPercent}
          />
          {enterprise ? <EnterprisePlan {...enterprise} /> : null}
        </div>
      </div>
    </>
  );
}
