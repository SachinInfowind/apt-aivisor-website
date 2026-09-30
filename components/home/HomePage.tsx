import { FounderSection } from "./sections/FounderSection";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "./sections/FaqSection";
import { Header } from "@/components/layout/HeaderCms";
import { Hero } from "./sections/Hero";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { ModulesSection } from "./sections/ModulesSection";
import { PlatformSection } from "./sections/PlatformSection";
import { PricingSection } from "./sections/PricingSection";
import { ProblemSection } from "./sections/ProblemSection";
import { StatsSection } from "./sections/StatsSection";
import { WaitlistSection } from "./sections/WaitlistSection";
import { WaitlistTrustBar } from "./sections/WaitlistTrustBar";
import { WhoItIsForSection } from "./sections/WhoItIsForSection";
import { findSection } from "@/lib/cms/utils";
import type {
  PageSection,
  HomeHeroSection,
  StatsSection as StatsSectionData,
  ProblemGridSection,
  FounderSpotlightSection,
  FeatureTableSection,
  FaqSection as FaqSectionData,
  WaitlistSectionData,
  WhoItIsForSectionData,
  PlatformTabsSection,
  ModulesSectionData,
  HowItWorksSectionData,
} from "@/lib/cms/types";

/**
 * Full-bleed page shell — section backgrounds span the viewport.
 * Inner content caps at 1680 → 1920 (Figma 1440 canvas scaled to 1920×1080).
 *
 * Every section is CMS-driven: copy and images come from the page's Strapi
 * sections (see `sections.platform-tabs`, `.modules`, `.how-it-works`, …).
 */
export default function Home({ sections }: { sections: PageSection[] }) {
  const hero = findSection<HomeHeroSection>(sections, "sections.home-hero");
  const platform = findSection<PlatformTabsSection>(sections, "sections.platform-tabs");
  const modules = findSection<ModulesSectionData>(sections, "sections.modules");
  const how = findSection<HowItWorksSectionData>(sections, "sections.how-it-works");
  const stats = findSection<StatsSectionData>(sections, "sections.stats");
  const problem = findSection<ProblemGridSection>(sections, "sections.problem-grid");
  const who = findSection<WhoItIsForSectionData>(sections, "sections.who-it-is-for");
  const founder = findSection<FounderSpotlightSection>(
    sections,
    "sections.founder-spotlight",
  );
  const pricing = findSection<FeatureTableSection>(sections, "sections.feature-table");
  const faq = findSection<FaqSectionData>(sections, "sections.faq");
  const waitlist = findSection<WaitlistSectionData>(sections, "sections.waitlist");

  return (
    <div
      id="top"
      // `overflow-x-clip` (not `-hidden`): `hidden` implies scrollable overflow,
      // which forces the paired overflow-y to compute as `auto`, turning this
      // div into its own scroll container and breaking `position: sticky` for
      // every descendant (e.g. HowItWorksSection's pinned scroll panel). `clip`
      // still stops horizontal bleed without establishing a scroll container.
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="w-full">
        {hero && <Hero {...hero} />}
        {platform && <PlatformSection {...platform} />}
        {stats && <StatsSection {...stats} />}
        {problem && <ProblemSection {...problem} />}
        {modules && <ModulesSection {...modules} />}
        {how && <HowItWorksSection {...how} />}
        {who && <WhoItIsForSection {...who} />}
        {founder && <FounderSection {...founder} />}
        {pricing && <PricingSection {...pricing} />}
        {faq && <FaqSection {...faq} />}
        {waitlist && (
          <>
            {/* Home CTA: join only — demo lives on the pricing waitlist band. */}
            <WaitlistSection
              {...waitlist}
              demoLabel={undefined}
              demoHref={undefined}
              showCountdown={true}
            />
            <WaitlistTrustBar {...waitlist} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
