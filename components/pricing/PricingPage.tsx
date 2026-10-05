import { FaqSection } from "@/components/home/sections/FaqSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { WaitlistSection } from "@/components/home/sections/WaitlistSection";
import { WaitlistTrustBar } from "@/components/home/sections/WaitlistTrustBar";
import { PlatformRoi } from "./PlatformRoi";
import { PricingAddOns } from "./PricingAddOns";
import { PricingBillingSection } from "./PricingBillingSection";
import { layout } from "@/components/ui/type";
import { findSection } from "@/lib/cms/utils";
import type {
  PageSection,
  FaqSection as FaqSectionData,
  WaitlistSectionData,
  PricingCatalogSection,
  PricingHeroSection,
  EnterprisePlanSection,
  PlatformRoiSection,
} from "@/lib/cms/types";

/**
 * Full Pricing page — Figma 1:7620 (1440×5958).
 *
 * Gradient band wraps hero → ROI only. Add-ons breaks to white inside that
 * band; FAQ / waitlist / footer use their own section backgrounds.
 *
 * Everything comes from the `pricing` page's CMS sections: hero, plans and
 * add-ons (Plan Prices), the enterprise card, ROI tabs, FAQ and waitlist.
 */
export default function PricingPage({ sections }: { sections: PageSection[] }) {
  const faq = findSection<FaqSectionData>(sections, "sections.faq");
  const waitlist = findSection<WaitlistSectionData>(sections, "sections.waitlist");
  const catalog = findSection<PricingCatalogSection>(
    sections,
    "sections.pricing-catalog",
  );
  const hero = findSection<PricingHeroSection>(sections, "sections.pricing-hero");
  const enterprise = findSection<EnterprisePlanSection>(sections, "sections.enterprise-plan");
  const roi = findSection<PlatformRoiSection>(sections, "sections.platform-roi");
  const yearlyDiscountPercent = catalog?.yearlyDiscountPercent ?? 17;

  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="w-full pb-0">
        <div className="bg-platform-card">
          <PricingBillingSection
            catalog={catalog}
            hero={hero}
            enterprise={enterprise}
            yearlyDiscountPercent={yearlyDiscountPercent}
          />

          {/* Add-ons — full-bleed white (Frame 205) */}
          <PricingAddOns catalog={catalog} />

          {/* Platform ROI — on gradient, same content width as FAQ */}
          <div
            className={`${layout.sectionX} pb-10 pt-10 sm:pb-12 sm:pt-12 md:pb-16 md:pt-16`}
          >
            <div className={layout.inner}>
              {roi ? <PlatformRoi tabs={roi.tabs} tabsLabel={roi.tabsLabel} /> : null}
            </div>
          </div>
        </div>

        {faq && <FaqSection {...faq} />}
        {waitlist && (
          <>
            <WaitlistSection
              {...waitlist}
              demoLabel={waitlist.demoLabel || "Try demo"}
              demoHref={waitlist.demoHref || "#demo"}
            />
            <WaitlistTrustBar {...waitlist} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
