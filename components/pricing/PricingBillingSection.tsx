"use client";

import { useState } from "react";
import { PricingHero, type BillingPeriod } from "./PricingHero";
import { PricingPlans } from "./PricingPlans";
import { EnterprisePlan } from "./EnterprisePlan";
import { layout } from "@/components/ui/type";
import type { PricingCatalogSection } from "@/lib/cms/types";

/**
 * Holds the monthly/yearly billing toggle shared by the hero and the plan
 * cards. Split out so the rest of PricingPage can stay a server component.
 */
export function PricingBillingSection({
  plans,
  yearlyDiscountPercent,
}: {
  plans: PricingCatalogSection["plans"] | undefined;
  yearlyDiscountPercent: number;
}) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <>
      <PricingHero
        billing={billing}
        onBillingChange={setBilling}
        yearlyDiscountPercent={yearlyDiscountPercent}
      />

      <div className={`${layout.sectionX} pt-8 sm:pt-10 md:pt-12`}>
        <div
          className={`${layout.inner} flex flex-col gap-8 sm:gap-10 md:gap-[6.25rem]`}
        >
          <PricingPlans
            billing={billing}
            plans={plans}
            yearlyDiscountPercent={yearlyDiscountPercent}
          />
          <EnterprisePlan />
        </div>
      </div>
    </>
  );
}
