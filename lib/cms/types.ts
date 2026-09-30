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

export interface BlockNode {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  url?: string;
  image?: StrapiImage;
  children?: BlockNode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  role?: string | null;
  avatar?: StrapiImage | null;
  linkedinUrl?: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: StrapiImage | null;
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
  readingTimeMinutes?: number | null;
  views?: number | null;
  content?: BlockNode[];
  seo?: Seo;
  publishedAt?: string;
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

export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string | null;
  icon?: "flag" | "people" | "book" | "play" | null;
  badge?: string | null;
}

export interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuFeatured {
  title?: string | null;
  thumbLine1?: string | null;
  thumbLine2?: string | null;
  heading?: string | null;
  body?: string | null;
  watchHref?: string | null;
  watchLabel?: string | null;
  allHref?: string | null;
  allLabel?: string | null;
}

export interface MegaMenu {
  company: MegaMenuColumn;
  resources: MegaMenuColumn;
  featured: MegaMenuFeatured;
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
  /** design-partner benefit cards: colour of the `meta` badge */
  badgeColor?: "purple" | "orange" | "blue" | "green" | "pink" | "yellow" | null;
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
  headerImage?: StrapiImage | null;
  /** Comparison columns: [{ key: "vendr" | "ironclad" | "generic", name, price }]. */
  competitors?: Record<string, unknown>[] | null;
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
  /** Rendered after `heading` in the accent colour (panel variant). */
  headingAccent?: string | null;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** `panel` = rounded grey card with serif heading (design-partner NDA). */
  variant?: "default" | "panel" | null;
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
  mapImage?: StrapiImage | null;
  flagImage?: StrapiImage | null;
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
  cardImage?: StrapiImage | null;
  decorImages?: StrapiImage[] | null;
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
  partnerLogos?: StrapiImage[] | null;
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
  /** Replaces the "Or reach us directly …" line in the trust bar when set. */
  trustSecondaryText?: string;
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
  description?: string | null;
  badge?: string | null;
  featured?: boolean | null;
  groups?: FeatureGroup[];
}

export interface PricingAddonPrice {
  addonId: PricingAddonId;
  name: string;
  description?: string | null;
  icon?: StrapiImage | null;
  footerType?: "none" | "avatars" | "hubspot" | "pratt" | "clouds" | null;
  footerImages?: StrapiImage[] | null;
  footerLabel?: string | null;
  price: string;
}

export interface PricingCatalogSection {
  __component: "sections.pricing-catalog";
  id: number;
  yearlyDiscountPercent?: number;
  plans: PricingPlanPrice[];
  addons: PricingAddonPrice[];
  plansHeading?: string | null;
  plansHeadingAccent?: string | null;
  plansSubhead?: string | null;
  plansCtaLabel?: string | null;
  plansCtaHref?: string | null;
  priceSuffix?: string | null;
  billedMonthlyLabel?: string | null;
  billedYearlyLabel?: string | null;
  addonsBadge?: string | null;
  addonsHeading?: string | null;
  addonsHeadingAccent?: string | null;
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

export interface BulletPoint {
  id?: number;
  text: string;
}

export interface AudienceTab {
  id?: number;
  tabLabel: string;
  heading: string;
  body?: string;
  image?: StrapiImage | null;
  points?: BulletPoint[];
}

export interface DesignPartnerHeroSection {
  __component: "sections.design-partner-hero";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  headingAfter?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface DesignPartnerAudienceSection {
  __component: "sections.design-partner-audience";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  tabs: AudienceTab[];
}

export interface DesignPartnerCardsSection {
  __component: "sections.design-partner-cards";
  id: number;
  variant: "benefits" | "security" | "commitment";
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  items: CardItem[];
}

export interface DesignPartnerChecklistSection {
  __component: "sections.design-partner-checklist";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  items: BulletPoint[];
}

export interface TimelineStep {
  id?: number;
  number: string;
  title: string;
  description?: string;
  image?: StrapiImage | null;
}

export interface DesignPartnerTimelineSection {
  __component: "sections.design-partner-timeline";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  steps: TimelineStep[];
}

export interface FormOption {
  id?: number;
  group: string;
  key: string;
  label: string;
  icon?: StrapiImage | null;
}

export interface FormFieldCopy {
  id?: number;
  key: string;
  label?: string | null;
  placeholder?: string | null;
  hint?: string | null;
  prefix?: string | null;
}

export interface DesignPartnerFormSectionData {
  __component: "sections.design-partner-form";
  id: number;
  badgeLabel?: string;
  heading: string;
  subhead?: string;
  successHref?: string;
  // Wizard copy — all editable in Strapi (sections.design-partner-form).
  /** Dropdown / chip / buyer-seller options. `group` = field name, `key` = submitted value. */
  options?: FormOption[];
  /** Per-field label, placeholder, hint (and prefix) — keyed by field name. */
  fields?: FormFieldCopy[];
  stepPrefix?: string | null;
  step1Label?: string | null;
  step2Label?: string | null;
  step3Label?: string | null;
  personalTitle?: string | null;
  personalSubtitle?: string | null;
  companyTitle?: string | null;
  companySubtitle?: string | null;
  noticeTitle?: string | null;
  noticeBody?: string | null;
  vendorsTitle?: string | null;
  vendorsSubtitle?: string | null;
  categoriesTitle?: string | null;
  categoriesSubtitle?: string | null;
  categoriesPrompt?: string | null;
  economicsTitle?: string | null;
  economicsSubtitle?: string | null;
  continueToStep2Label?: string | null;
  continueToStep3Label?: string | null;
  backLabel?: string | null;
  submitLabel?: string | null;
  submittingLabel?: string | null;
  termsPrefix?: string | null;
  termsLinkLabel?: string | null;
  termsHref?: string | null;
  privacyLinkLabel?: string | null;
  privacyHref?: string | null;
  termsSuffix?: string | null;
  ndaText?: string | null;
  ndaLinkLabel?: string | null;
  ndaLinkHref?: string | null;
  consentText?: string | null;
  footerNote?: string | null;
  successTitle?: string | null;
  successBody?: string | null;
}

export interface AboutHeroSection {
  __component: "sections.about-hero";
  id: number;
  heading: string;
  headingAccent?: string;
  /** Wrap words in **double asterisks** to render them bold. */
  intro?: string;
}

export interface AboutForesightSection {
  __component: "sections.about-foresight";
  id: number;
  heading: string;
  headingAccent?: string;
  intro?: string;
  readMoreLabel?: string;
  readMoreHref?: string;
  quoteBefore?: string;
  quoteAccent?: string;
  quoteAfter?: string;
  quoteLogo?: StrapiImage | null;
  items: CardItem[];
}

export interface AboutNameTile {
  id?: number;
  name: string;
  script?: string;
  label?: string;
  description?: string;
  image?: StrapiImage | null;
}

export interface AboutNameSection {
  __component: "sections.about-name";
  id: number;
  anchorId?: string;
  badgeLabel?: string;
  word?: string;
  wordScript?: string;
  meaningPrefix?: string;
  meaning?: string;
  tiles: AboutNameTile[];
}

export interface AboutEthosSection {
  __component: "sections.about-ethos";
  id: number;
  badgeLabel?: string;
  heading: string;
  headingAccent?: string;
  headingAfter?: string;
  subheading?: string;
  items: CardItem[];
}

/* ───────────── Reusable content building blocks ───────────── */

export interface ContentStat {
  value?: string;
  label?: string;
  note?: string;
}

export interface FeatureLine {
  label: string;
  included?: boolean | null;
}

export interface FeatureGroup {
  title?: string | null;
  features: FeatureLine[];
}

/** Generic item used by tabs, modules, steps, ROI variants… (see the CMS `shared.content-item`). */
export interface ContentItem {
  id?: number;
  label?: string | null;
  title?: string | null;
  titleAccent?: string | null;
  body?: string | null;
  badge?: string | null;
  price?: string | null;
  variant?: string | null;
  href?: string | null;
  hrefLabel?: string | null;
  icon?: StrapiImage | null;
  image?: StrapiImage | null;
  imageSecondary?: StrapiImage | null;
  imageTertiary?: StrapiImage | null;
  bullets?: { text: string }[];
  stats?: ContentStat[];
  groups?: FeatureGroup[];
}

export interface PlatformTabsSection {
  __component: "sections.platform-tabs";
  id: number;
  heading?: string;
  headingAccent?: string;
  headingAfter?: string;
  tabsLabel?: string;
  tabs: ContentItem[];
}

export interface ModulesSectionData {
  __component: "sections.modules";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaHref?: string;
  viewingLabel?: string;
  items: ContentItem[];
}

export interface HowItWorksSectionData {
  __component: "sections.how-it-works";
  id: number;
  badgeLabel?: string;
  heading?: string;
  headingAccent?: string;
  steps: ContentItem[];
  integrationLogos?: StrapiImage[] | null;
  integrationsBody?: string;
}

export interface PricingHeroSection {
  __component: "sections.pricing-hero";
  id: number;
  heading?: string;
  headingAccent?: string;
  subhead?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  /** Supports a `{percent}` placeholder. */
  saveLabel?: string;
  toggleLabel?: string;
}

export interface PlatformRoiSection {
  __component: "sections.platform-roi";
  id: number;
  tabsLabel?: string;
  tabs: ContentItem[];
}

export interface EnterprisePlanSection {
  __component: "sections.enterprise-plan";
  id: number;
  badge?: string;
  badgeNote?: string;
  heading?: string;
  headingAccent?: string;
  quote?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  features: { text: string }[];
}

export interface NotFoundSection {
  __component: "sections.not-found";
  id: number;
  eyebrow?: string;
  heading?: string;
  body?: string;
  backLabel?: string;
  homeLabel?: string;
  homeHref?: string;
}

export interface BlogHeroSection {
  __component: "sections.blog-hero";
  id: number;
  heading?: string;
  headingAccent?: string;
  subhead?: string;
  emailPlaceholder?: string;
  subscribeLabel?: string;
  privacyPrefix?: string;
  privacyLinkLabel?: string;
  privacyLinkHref?: string;
  emptyLabel?: string;
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
  | LegalBodySection
  | DesignPartnerHeroSection
  | DesignPartnerAudienceSection
  | DesignPartnerCardsSection
  | DesignPartnerChecklistSection
  | DesignPartnerTimelineSection
  | DesignPartnerFormSectionData
  | AboutHeroSection
  | AboutForesightSection
  | AboutNameSection
  | AboutEthosSection
  | PlatformTabsSection
  | ModulesSectionData
  | HowItWorksSectionData
  | PricingHeroSection
  | PlatformRoiSection
  | EnterprisePlanSection
  | NotFoundSection
  | BlogHeroSection;

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  seo?: Seo;
  sections: PageSection[];
}

/** Copy + links for the "See aptAIvisor in action" modal (Global singleton). */
export interface DemoModalCopy {
  logo?: StrapiImage | null;
  closeLabel?: string | null;
  introTitle?: string | null;
  introBody?: string | null;
  requestLabel?: string | null;
  requestHref?: string | null;
  exploreLabel?: string | null;
  exploreHref?: string | null;
  notifyLabel?: string | null;
  emailTitle?: string | null;
  emailBody?: string | null;
  emailFieldLabel?: string | null;
  emailPlaceholder?: string | null;
  cancelLabel?: string | null;
  submitLabel?: string | null;
  submittingLabel?: string | null;
  thanksTitle?: string | null;
  thanksBody?: string | null;
  homeLabel?: string | null;
  homeHref?: string | null;
}

export interface CmsGlobal {
  id: number;
  siteName: string;
  footerTagline?: string | null;
  copyrightText?: string | null;
  navLinks: NavLink[];
  aboutMegaMenu?: MegaMenu | null;
  footerColumns: FooterColumn[];
  socialLinks: Link[];
  demoModal?: DemoModalCopy | null;
  seo?: Seo;
  logoMark?: StrapiImage | null;
  footerClouds?: StrapiImage | null;
  cloudBand?: StrapiImage | null;
  cloudEdge?: StrapiImage | null;
  headerDemoLabel?: string | null;
  headerDemoHref?: string | null;
  headerWaitlistLabel?: string | null;
  headerWaitlistHref?: string | null;
  footerWaitlistLabel?: string | null;
  footerWaitlistHref?: string | null;
  footerBackToTopLabel?: string | null;
}
