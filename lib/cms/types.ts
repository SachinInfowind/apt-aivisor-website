export interface StrapiImage {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: StrapiImage | null;
}

export interface Link {
  label: string;
  href: string;
  badge?: string | null;
}

export interface NavLink {
  label: string;
  href: string;
  mega?: boolean | null;
}

export interface FooterColumn {
  heading: string;
  links: Link[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CardItem {
  title: string;
  description?: string;
  meta?: string;
  icon?: StrapiImage | null;
}

export interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  photo?: StrapiImage | null;
}

export interface HeroSection {
  __component: "sections.hero";
  id: number;
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: StrapiImage | null;
}

export interface StatsSection {
  __component: "sections.stats";
  id: number;
  heading?: string;
  headingAccent?: string;
  items: StatItem[];
}

export interface FaqSection {
  __component: "sections.faq";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  items: FaqItem[];
}

export interface FeatureTableSection {
  __component: "sections.feature-table";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  ctaLabel?: string;
  ctaHref?: string;
  rows: Record<string, unknown>[];
}

export interface CardGridSection {
  __component: "sections.card-grid";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  items: CardItem[];
}

export interface TeamSection {
  __component: "sections.team";
  id: number;
  heading?: string;
  subheading?: string;
  members: TeamMember[];
}

export interface CtaSection {
  __component: "sections.cta";
  id: number;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface RichTextSection {
  __component: "sections.rich-text";
  id: number;
  heading?: string;
  content: string;
}

export interface ContactMethod {
  title: string;
  description?: string;
  href: string;
  label: string;
}

export interface StepItem {
  title: string;
}

export interface ContactHeroSection {
  __component: "sections.contact-hero";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  contactMethods: ContactMethod[];
}

export interface ConfirmationSection {
  __component: "sections.confirmation";
  id: number;
  heading: string;
  headingAccent?: string;
  leadText?: string;
  bodyText?: string;
  stepsHeading?: string;
  steps: StepItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface FounderHighlightSection {
  __component: "sections.founder-highlight";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  body: string;
  cardBadge?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardNote?: string;
}

export interface HomeHeroSection {
  __component: "sections.home-hero";
  id: number;
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface FounderSpotlightSection {
  __component: "sections.founder-spotlight";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  /** Extra intro copy revealed by the Read More toggle. */
  introMore?: string;
  founderName?: string;
  founderTitle?: string;
  founderPhoto?: StrapiImage | null;
  quote?: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlights: StatItem[];
  partnersNote?: string;
}

export interface WaitlistSectionData {
  __component: "sections.waitlist";
  id: number;
  heading: string;
  subhead?: string;
  joinLabel?: string;
  /** Destination for the Join CTA — dedicated waitlist page. */
  joinHref?: string;
  demoLabel?: string;
  demoHref?: string;
  successMessage?: string;
  trustText?: string;
  contactLabel?: string;
  contactHref?: string;
}

/** Waitlist page hero — Figma Frame 128. */
export interface WaitlistHeroSection {
  __component: "sections.waitlist-hero";
  id: number;
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  headlineAfter?: string;
  subhead?: string;
}

/** Waitlist perks row — Figma Frame 207. */
export interface WaitlistPerksSection {
  __component: "sections.waitlist-perks";
  id: number;
  items: TrustFeatureItem[];
}

/** Waitlist signup form — Figma Frame 206. */
export interface WaitlistFormSectionData {
  __component: "sections.waitlist-form";
  id: number;
  heading: string;
  subhead?: string;
  ctaLabel?: string;
  trustText?: string;
  termsHref?: string;
  privacyHref?: string;
  successHref?: string;
}

export interface ProblemGridSection {
  __component: "sections.problem-grid";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  items: CardItem[];
}

export type PricingPlanId = "buyer" | "both" | "seller";

export type PricingAddonId = "cloud-ai" | "seats" | "hubspot" | "strategy";

export interface PricingPlanPrice {
  planId: PricingPlanId;
  name: string;
  priceMonthly: number;
}

export interface PricingAddonPrice {
  addonId: PricingAddonId;
  name: string;
  price: string;
}

export interface PricingCatalogSection {
  __component: "sections.pricing-catalog";
  id: number;
  yearlyDiscountPercent?: number;
  plans: PricingPlanPrice[];
  addons: PricingAddonPrice[];
}

export interface CareerRolesSectionData {
  __component: "sections.career-roles";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  body: string;
  bodyEmphasis?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: StrapiImage | null;
}

export interface CareerOpenCallSectionData {
  __component: "sections.career-open-call";
  id: number;
  heading: string;
  headingAccent?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: StrapiImage | null;
}

export interface PersonaItem {
  quote: string;
  role: string;
  meta?: string;
  moreCount?: number;
  avatars?: StrapiImage[] | null;
}

export interface WhoItIsForSectionData {
  __component: "sections.who-it-is-for";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  ctaLabel?: string;
  ctaHref?: string;
  personas: PersonaItem[];
}

export interface TrustFeatureItem {
  id: number;
  title: string;
  description?: string;
  iconBg?: string;
  icon?: StrapiImage | null;
}

export interface TrustHeroSection {
  __component: "sections.trust-hero";
  id: number;
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  headlineAfter?: string;
  subhead?: string;
  features: TrustFeatureItem[];
}

export interface TrustFlowStep {
  id: number;
  title: string;
  description?: string;
  connectorLabel?: string;
  connectorPlacement?: "below" | "above";
}

export interface TrustBenchmarkSection {
  __component: "sections.trust-benchmark";
  id: number;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  footnote?: string;
  steps: TrustFlowStep[];
}

export interface TrustControlRow {
  id: number;
  reference?: string;
  control: string;
  description: string;
}

export interface TrustControlsSection {
  __component: "sections.trust-controls";
  id: number;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  rows: TrustControlRow[];
}

export interface TrustFaqSection {
  __component: "sections.trust-faq";
  id: number;
  heading: string;
  headingAccent?: string;
  items: FaqItem[];
}

export interface TrustCtaSection {
  __component: "sections.trust-cta";
  id: number;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface TrustNoteItem {
  id?: number;
  body: string;
}

export interface TrustNotesSection {
  __component: "sections.trust-notes";
  id: number;
  heading: string;
  headingAccent?: string;
  notes: TrustNoteItem[];
}

export interface TeamProfile {
  id?: number;
  name: string;
  role?: string;
  bioPreview?: string;
  bio?: string;
  quote?: string;
  linkedinUrl?: string;
  expandedByDefault?: boolean;
  photo?: StrapiImage | null;
  brands?: StrapiImage | null;
}

export type SolutionsAudienceKey = "buyer" | "both" | "seller";

export interface SolutionsAudience {
  id: number;
  key: SolutionsAudienceKey;
  label: string;
}

/** Solutions page hero — Figma Frame 1261154244. */
export type LegalVariant = "privacy" | "terms" | "cookies";

export interface LegalBlock {
  id: number;
  heading?: string;
  headingSize?: "lg" | "md";
  /** Paragraphs before the list, separated by a blank line. */
  intro?: string;
  /** One bullet per line. */
  bullets?: string;
  /** Paragraphs after the list, separated by a blank line. */
  closing?: string;
}

/** Privacy, Terms, and Cookie policy hero. */
export interface LegalHeroSection {
  __component: "sections.legal-hero";
  id: number;
  badge?: string;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  variant: LegalVariant;
}

export interface LegalBodySection {
  __component: "sections.legal-body";
  id: number;
  blocks?: LegalBlock[];
}

export interface SolutionsFeaturePoint {
  id: number;
  text: string;
}

/** Solutions features — Figma FEATURES (26281:28633). */
export interface SolutionsFeaturesSection {
  __component: "sections.solutions-features";
  id: number;
  moduleLabel?: string;
  audienceLabel?: string;
  headline: string;
  headlineAccent?: string;
  body?: string;
  points?: SolutionsFeaturePoint[];
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: StrapiImage | null;
  imageAlt?: string;
  surface?: "white" | "blue";
}

export type WorkflowIcon = "user" | "cloud" | "file" | "cart" | "copy" | "chat";

export interface WorkflowItem {
  id: number;
  title: string;
  body?: string;
  metric?: string;
  icon?: WorkflowIcon;
  image?: StrapiImage | null;
  imageAlt?: string;
}

/** Solutions page — Real problems. Real workflows (26316:10637). */
export interface SolutionsWorkflowsSection {
  __component: "sections.solutions-workflows";
  id: number;
  items?: WorkflowItem[];
}

export type PartnerTone = "success" | "orange" | "pink";

export interface PartnerSource {
  id: number;
  title: string;
  badge?: string;
  tone?: PartnerTone;
  body?: string;
}

/** Solutions page — Design partner program (26316:10479). */
export interface SolutionsPartnerSection {
  __component: "sections.solutions-partner";
  id: number;
  badge?: string;
  headline: string;
  headlineAccent?: string;
  body?: string;
  items?: PartnerSource[];
}

export interface FounderFeature {
  id: number;
  text: string;
}

export interface FounderTab {
  id: number;
  title: string;
  badgeLabel?: string;
  description?: string;
  features: FounderFeature[];
  ctaLabel?: string;
  ctaHref?: string;
  image?: StrapiImage | null;
}

export interface SolutionsFounderSection {
  __component: "sections.solutions-founder";
  id: number;
  badge?: string;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  tabs: FounderTab[];
}

export interface SolutionsSecuritySection {
  __component: "sections.solutions-security";
  id: number;
  badge?: string;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  items?: CardItem[];
}

export interface SolutionsCtaSection {
  __component: "sections.solutions-cta";
  id: number;
  badge?: string;
  headline: string;
  subhead?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  tertiaryButtonLabel?: string;
  tertiaryButtonHref?: string;
  image?: StrapiImage | null;
  footerLeftText?: string;
  footerRightText?: string;
}

export interface SolutionsHeroSection {
  __component: "sections.solutions-hero";
  id: number;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
  audiences?: SolutionsAudience[];
}

export interface TeamHeroSection {
  __component: "sections.team-hero";
  id: number;
  headline: string;
  headlineAccent?: string;
  subhead?: string;
}

export interface TeamRosterSection {
  __component: "sections.team-roster";
  id: number;
  heading: string;
  headingAccent?: string;
  members: TeamProfile[];
}

export type PageSection =
  | HeroSection
  | StatsSection
  | FaqSection
  | FeatureTableSection
  | CardGridSection
  | TeamSection
  | CtaSection
  | RichTextSection
  | FounderHighlightSection
  | ContactHeroSection
  | ConfirmationSection
  | HomeHeroSection
  | FounderSpotlightSection
  | WaitlistSectionData
  | ProblemGridSection
  | PricingCatalogSection
  | CareerRolesSectionData
  | CareerOpenCallSectionData
  | WhoItIsForSectionData
  | TrustHeroSection
  | TrustBenchmarkSection
  | TrustControlsSection
  | TrustFaqSection
  | TrustCtaSection
  | TrustNotesSection
  | TeamHeroSection
  | TeamRosterSection
  | WaitlistHeroSection
  | WaitlistPerksSection
  | WaitlistFormSectionData
  | SolutionsHeroSection
  | SolutionsFeaturesSection
  | SolutionsWorkflowsSection
  | SolutionsPartnerSection
  | SolutionsFounderSection
  | SolutionsSecuritySection
  | SolutionsCtaSection
  | LegalHeroSection
  | LegalBodySection;

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  seo?: Seo;
  sections: PageSection[];
}

export interface CmsGlobal {
  id: number;
  siteName: string;
  footerTagline?: string | null;
  copyrightText?: string | null;
  navLinks: NavLink[];
  footerColumns: FooterColumn[];
  socialLinks: Link[];
  seo?: Seo;
}
