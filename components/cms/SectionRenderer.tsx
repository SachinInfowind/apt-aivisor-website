import { CareerHero } from "@/components/career/sections/CareerHero";
import { CareerFounderSection } from "@/components/career/sections/CareerFounderSection";
import { CareerValuesSection } from "@/components/career/sections/CareerValuesSection";
import { CareerRolesSection } from "@/components/career/sections/CareerRolesSection";
import { CareerOpenCallSection } from "@/components/career/sections/CareerOpenCallSection";
import { ContactContent } from "@/components/contact/ContactContent";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { NewsletterCtaSection } from "@/components/contact/NewsletterCtaSection";
import { ThankYouContent } from "@/components/thank-you/ThankYouContent";
import { Hero } from "@/components/home/sections/Hero";
import { StatsSection } from "@/components/home/sections/StatsSection";
import { ProblemSection } from "@/components/home/sections/ProblemSection";
import { FounderSection } from "@/components/home/sections/FounderSection";
import { WaitlistSection } from "@/components/home/sections/WaitlistSection";
import { WaitlistTrustBar } from "@/components/home/sections/WaitlistTrustBar";
import { PricingSection } from "@/components/home/sections/PricingSection";
import { FaqSection } from "@/components/home/sections/FaqSection";
import { WhoItIsForSection } from "@/components/home/sections/WhoItIsForSection";
import { TrustHeroSection } from "@/components/trust/sections/TrustHeroSection";
import { TrustBenchmarkSection } from "@/components/trust/sections/TrustBenchmarkSection";
import { TrustControlsSection } from "@/components/trust/sections/TrustControlsSection";
import { TrustFaqSection } from "@/components/trust/sections/TrustFaqSection";
import { TrustCtaSection } from "@/components/trust/sections/TrustCtaSection";
import { TrustNotesSection } from "@/components/trust/sections/TrustNotesSection";
import { TeamHeroSection } from "@/components/team/sections/TeamHeroSection";
import { TeamRosterSection } from "@/components/team/sections/TeamRosterSection";
import { WaitlistHeroSection } from "@/components/waitlist/sections/WaitlistHeroSection";
import { WaitlistPerksSection } from "@/components/waitlist/sections/WaitlistPerksSection";
import { WaitlistFormSection } from "@/components/waitlist/sections/WaitlistFormSection";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { SolutionsFeatures } from "@/components/solutions/SolutionsFeatures";
import { SolutionsWorkflows } from "@/components/solutions/SolutionsWorkflows";
import { SolutionsPartner } from "@/components/solutions/SolutionsPartner";
import { SolutionsSecurity } from "@/components/solutions/SolutionsSecurity";
import { SolutionsFounder } from "@/components/solutions/SolutionsFounder";
import { SolutionsCta } from "@/components/solutions/SolutionsCta";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalContent } from "@/components/legal/LegalContent";
import { CtaSection } from "@/components/cms/sections/CtaSection";
import { AboutHero } from "@/components/about/sections/AboutHero";
import { AboutForesight } from "@/components/about/sections/AboutForesight";
import { AboutName } from "@/components/about/sections/AboutName";
import { AboutEthos } from "@/components/about/sections/AboutEthos";
import { DesignPartnerHero } from "@/components/design-partner/sections/DesignPartnerHero";
import { AudienceSection } from "@/components/design-partner/sections/AudienceSection";
import { DesignPartnerCardsSection } from "@/components/design-partner/sections/DesignPartnerCardsSection";
import { ChecklistSection } from "@/components/design-partner/sections/ChecklistSection";
import { TimelineSection } from "@/components/design-partner/sections/TimelineSection";
import { DesignPartnerQuestionnaire } from "@/components/design-partner/sections/DesignPartnerQuestionnaire";
import { getGlobal } from "@/lib/cms/queries";
import type { PageSection } from "@/lib/cms/types";

/**
 * Maps a Strapi dynamic-zone section's `__component` to the React component
 * that renders it. Add an entry here whenever a new section component is
 * wired up to the CMS.
 */
export async function SectionRenderer({ sections }: { sections: PageSection[] }) {
  // Site-wide media some sections need (e.g. the logo on the Career success state).
  const global = await getGlobal();

  return (
    <>
      {sections.map((section, index) => {
        // Strapi component ids are per-type, so id alone can collide across
        // different __component values on the same page (e.g. hero id=3 and
        // founder-highlight id=3). Include type + index for a stable unique key.
        const key = `${section.__component}-${section.id}-${index}`;

        switch (section.__component) {
          case "sections.hero":
            return <CareerHero key={key} {...section} />;
          case "sections.home-hero":
            return <Hero key={key} {...section} />;
          case "sections.founder-highlight":
            return <CareerFounderSection key={key} {...section} />;
          case "sections.founder-spotlight":
            return <FounderSection key={key} {...section} />;
          case "sections.card-grid":
            return <CareerValuesSection key={key} {...section} />;
          case "sections.career-roles":
            return <CareerRolesSection key={key} {...section} logo={global?.logoMark} />;
          case "sections.career-open-call":
            return <CareerOpenCallSection key={key} {...section} />;
          case "sections.problem-grid":
            return <ProblemSection key={key} {...section} />;
          case "sections.stats":
            return <StatsSection key={key} {...section} />;
          case "sections.feature-table":
            return <PricingSection key={key} {...section} />;
          case "sections.faq":
            return <FaqSection key={key} {...section} />;
          case "sections.waitlist":
            return (
              <div key={key}>
                <WaitlistSection {...section} />
                <WaitlistTrustBar {...section} />
              </div>
            );
          case "sections.who-it-is-for":
            return <WhoItIsForSection key={key} {...section} />;
          case "sections.trust-hero":
            return <TrustHeroSection key={key} {...section} />;
          case "sections.trust-benchmark":
            return <TrustBenchmarkSection key={key} {...section} />;
          case "sections.trust-controls":
            return <TrustControlsSection key={key} {...section} />;
          case "sections.trust-faq":
            return <TrustFaqSection key={key} {...section} />;
          case "sections.trust-cta":
            return <TrustCtaSection key={key} {...section} />;
          case "sections.trust-notes":
            return <TrustNotesSection key={key} {...section} />;
          case "sections.team-hero":
            return <TeamHeroSection key={key} {...section} />;
          case "sections.team-roster":
            return <TeamRosterSection key={key} {...section} />;
          case "sections.waitlist-hero":
            return <WaitlistHeroSection key={key} {...section} />;
          case "sections.waitlist-perks":
            return <WaitlistPerksSection key={key} {...section} />;
          case "sections.waitlist-form":
            return <WaitlistFormSection key={key} {...section} />;
          case "sections.solutions-hero":
            return <SolutionsHero key={key} {...section} />;
          case "sections.solutions-features":
            return <SolutionsFeatures key={key} {...section} />;
          case "sections.solutions-workflows":
            return <SolutionsWorkflows key={key} {...section} />;
          case "sections.solutions-partner":
            return <SolutionsPartner key={key} {...section} />;
          case "sections.solutions-founder":
            return <SolutionsFounder key={key} {...section} />;
          case "sections.solutions-security":
            return <SolutionsSecurity key={key} {...section} />;
          case "sections.solutions-cta":
            return <SolutionsCta key={key} {...section} />;
          case "sections.legal-hero":
            return <LegalHero key={key} {...section} />;
          case "sections.legal-body":
            return <LegalContent key={key} {...section} />;
          case "sections.cta":
            return <CtaSection key={key} {...section} />;
          case "sections.about-hero":
            return <AboutHero key={key} {...section} />;
          case "sections.about-foresight":
            return <AboutForesight key={key} {...section} />;
          case "sections.about-name":
            return <AboutName key={key} {...section} />;
          case "sections.about-ethos":
            return <AboutEthos key={key} {...section} />;
          case "sections.design-partner-hero":
            return <DesignPartnerHero key={key} {...section} />;
          case "sections.design-partner-audience":
            return <AudienceSection key={key} {...section} />;
          case "sections.design-partner-cards":
            return <DesignPartnerCardsSection key={key} {...section} />;
          case "sections.design-partner-checklist":
            return <ChecklistSection key={key} {...section} />;
          case "sections.design-partner-timeline":
            return <TimelineSection key={key} {...section} />;
          case "sections.design-partner-form":
            return (
              <DesignPartnerQuestionnaire
                key={key}
                badgeLabel={section.badgeLabel}
                heading={section.heading}
                subhead={section.subhead}
              />
            );
          case "sections.contact-hero":
            return (
              <div key={key}>
                <ContactContent {...section} />
                <ContactFormSection />
                <NewsletterCtaSection />
              </div>
            );
          case "sections.confirmation":
            return <ThankYouContent key={key} {...section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
