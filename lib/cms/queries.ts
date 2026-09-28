import "server-only";
import qs from "qs";
import { fetchList, fetchSingle } from "./client";
import type { CmsGlobal, CmsPage } from "./types";

const SECTIONS_POPULATE = {
  on: {
    "sections.hero": { populate: ["image"] },
    "sections.stats": { populate: ["items"] },
    "sections.faq": { populate: ["items"] },
    "sections.feature-table": true,
    "sections.card-grid": { populate: { items: { populate: ["icon"] } } },
    "sections.team": { populate: { members: { populate: ["photo"] } } },
    "sections.cta": true,
    "sections.rich-text": true,
    "sections.founder-highlight": true,
    "sections.contact-hero": { populate: ["contactMethods"] },
    "sections.confirmation": { populate: ["steps"] },
    "sections.home-hero": true,
    "sections.founder-spotlight": { populate: ["highlights", "founderPhoto"] },
    "sections.waitlist": true,
    "sections.waitlist-hero": true,
    "sections.waitlist-perks": {
      populate: { items: { populate: ["icon"] } },
    },
    "sections.waitlist-form": true,
    "sections.problem-grid": { populate: { items: { populate: ["icon"] } } },
    "sections.pricing-catalog": { populate: ["plans", "addons"] },
    "sections.career-roles": { populate: ["image"] },
    "sections.career-open-call": { populate: ["image"] },
    "sections.who-it-is-for": { populate: { personas: { populate: ["avatars"] } } },
    "sections.trust-hero": { populate: { features: { populate: ["icon"] } } },
    "sections.trust-benchmark": { populate: ["steps"] },
    "sections.trust-controls": { populate: ["rows"] },
    "sections.trust-faq": { populate: ["items"] },
    "sections.trust-cta": true,
    "sections.trust-notes": { populate: ["notes"] },
    "sections.team-hero": true,
    "sections.solutions-hero": { populate: ["audiences"] },
    "sections.solutions-features": { populate: ["points", "image"] },
    "sections.solutions-workflows": { populate: { items: { populate: ["image"] } } },
    "sections.solutions-partner": { populate: ["items"] },
    "sections.solutions-security": { populate: { items: { populate: ["icon"] } } },
    "sections.solutions-founder": { populate: { tabs: { populate: ["features", "image"] } } },
    "sections.solutions-cta": { populate: ["image"] },
    "sections.legal-hero": true,
    "sections.legal-body": { populate: ["blocks"] },
    "sections.team-roster": {
      populate: { members: { populate: ["photo", "brands"] } },
    },
  },
};

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        seo: { populate: ["ogImage"] },
        sections: SECTIONS_POPULATE,
      },
    },
    { encodeValuesOnly: true },
  );

  const pages = await fetchList<CmsPage>(`/api/pages?${query}`, {
    tags: [`page:${slug}`],
  });

  const page = pages[0] ?? null;

  // TEMPORARY: Inject missing sections for the Home page
  if (page && slug === "home") {
    const statsSection: any = {
      id: 8881,
      __component: "sections.stats",
      heading: "See Why Customer Love Us",
      items: [
        { value: "20%", label: "Of technology contracts never negotiated" },
        { value: "21%", label: "Avg vendor cost reduction with intelligence" },
        { value: "$36k+", label: "Entry price for enterprise procurement tools" },
        { value: "$0", label: "Institutional deal knowledge most startups have" }
      ]
    };
    
    const problemGridSection: any = {
      id: 8882,
      __component: "sections.problem-grid",
      badgeLabel: "The Problem",
      heading: "Your vendors know exactly what you should pay.",
      headingAccent: "You don't.",
      subheading: "Most startups and mid-market companies sign technology contracts without knowing what the market pays, what terms are negotiable, or what risks are buried in the fine print.",
      items: [
        { title: "No price transparency", description: "Vendors hide discounts behind NDAs. You never know if you're getting a good deal." },
        { title: "Hidden risks", description: "Auto-renewals and predatory terms are buried in MSAs." },
        { title: "Wasted time", description: "Weeks spent negotiating terms that vendors standardly concede." },
        { title: "Siloed knowledge", description: "Institutional deal knowledge leaves when your procurement lead does." }
      ]
    };

    const founderSpotlightSection: any = {
      id: 8883,
      __component: "sections.founder-spotlight",
      badgeLabel: "Build by the builders who've on both sides",
      heading: "30+ years pricing the world's",
      headingAccent: "largest technology deals",
      intro: "We spent over 30 combined years at AWS and other hyperscalers at the center of complex technology deal-making structuring multi-billion dollar custom technology",
      introMore: "deals and strategic collaborations for digital transformations across industry verticals, public sector, mid-market and startups.\n\nWe are now democratizing the deal intelligence. The institutional deal intelligence that made those large deals work is now available to every company not just the ones with enterprise procurement and deal teams.",
      founderName: "Pratt Dey",
      founderTitle: "Founder, CEO, aptAI Solutions Group",
      quote: "The biggest friction in enterprise technology isn't the product — it's the contract. Pricing is opaque. Negotiation is asymmetric. Most companies are signing agreements with no idea what the market actually pays.",
      ctaLabel: "See More",
      ctaHref: "#about",
      highlights: [
        { value: "30+ years", label: "At Hyperscale deal pricing and partner strategy" },
        { value: "$100B+", label: "In cloud/AI/SaaS Marketplace commit" },
        { value: "Global", label: "Strategic collaboration and equity investment" }
      ],
      partnersNote: "Complex cloud/AI, tech OEM pricing, and datacenter finance"
    };
    
    // Reconstruct the page sections in the correct order
    const newSections = [];
    const hero = page.sections.find((s: any) => s.__component === "sections.home-hero");
    if (hero) newSections.push(hero);
    
    newSections.push(statsSection);
    newSections.push(problemGridSection);
    
    const who = page.sections.find((s: any) => s.__component === "sections.who-it-is-for");
    if (who) newSections.push(who);
    
    newSections.push(founderSpotlightSection);
    
    const pricing = page.sections.find((s: any) => s.__component === "sections.feature-table");
    if (pricing) newSections.push(pricing);
    
    const faq = page.sections.find((s: any) => s.__component === "sections.faq");
    if (faq) newSections.push(faq);
    
    const waitlistSection: any = {
      id: 9999,
      __component: "sections.waitlist",
      heading: "Your next technology contract should cost less.",
      subhead: "Join the aptAIvisor waitlist. Be first to access pricing benchmarks, contract intelligence, and negotiation playbooks for your vendor stack. Launching in Q1 2027.",
      joinLabel: "Join the waitlist",
      joinHref: "/waitlist"
    };

    const waitlist = page.sections.find((s: any) => s.__component === "sections.waitlist");
    if (waitlist) {
      newSections.push({ ...waitlistSection, ...waitlist });
    } else {
      newSections.push(waitlistSection);
    }
    
    page.sections = newSections;
  }

  return page;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const query = qs.stringify({ fields: ["slug"] }, { encodeValuesOnly: true });
  const pages = await fetchList<{ slug: string }>(`/api/pages?${query}`, {
    tags: ["pages"],
  });
  return pages.map((page) => page.slug);
}

export async function getGlobal(): Promise<CmsGlobal | null> {
  const query = qs.stringify(
    {
      populate: {
        navLinks: true,
        footerColumns: { populate: ["links"] },
        socialLinks: true,
        seo: { populate: ["ogImage"] },
      },
    },
    { encodeValuesOnly: true },
  );

  return fetchSingle<CmsGlobal>(`/api/global?${query}`, { tags: ["global"] });
}
