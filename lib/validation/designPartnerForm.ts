import { z } from "zod";

/**
 * Validation shape for the Design Partner 5-step onboarding questionnaire
 * (Company Profile, Buyer Profile, Seller Profile, Platform Preferences,
 * Data Consent).
 *
 * Mirrors the zod schema in the CMS's design-partner-application controller
 * (`apt-cms/src/api/design-partner-application/validation.ts`) field-for-field.
 * They live in separate repos so can't literally share one module — keep
 * them in sync by hand if either changes.
 *
 * Per-step required-field gating already happens client-side via
 * `isStep1Valid` .. `isStep5Valid` in `components/design-partner/sections/
 * questionnaire/Step1..5*.tsx` — this schema is the final full-submission
 * check run right before POST, not a per-step validator.
 */
const chipArray = z.array(z.string().trim().min(1).max(160)).max(40).optional().default([]);
const optionalString = (max = 120) => z.string().trim().max(max).optional().default("");

const baseSchema = z.object({
  // Step 1 — Company Profile
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  nameAndTitle: z.string().trim().min(1, "Your name and title is required").max(160),
  workEmail: z.email("Enter a valid work email address").max(254),
  companyWebsite: z.string().trim().min(1, "Company website is required").max(300),
  industry: z.string().trim().min(1, "Select an industry").max(120),
  ownership: z.string().trim().min(1, "Select the company's ownership").max(120),
  employeeCount: z.string().trim().min(1, "Select number of employees").max(80),
  hqCountry: z.string().trim().min(1, "Select headquarters country").max(80),
  hqRegion: z.string().trim().min(1, "Headquarters state / region is required").max(160),
  role: z.enum(["Buyer", "Seller", "Buyer + Seller"], {
    error: "Select Buyer, Seller, or Buyer + Seller",
  }),

  // Step 2 — Buyer Profile (optional at the schema level; see superRefine)
  annualSpend: optionalString(80),
  spendGrowth: optionalString(80),
  vendorCategories: chipArray,
  hasCommitments: optionalString(40),
  commitmentPlatforms: chipArray,
  activeContracts: optionalString(40),
  contractLength: optionalString(40),
  renewalsPerYear: optionalString(40),
  renewalAdvanceNotice: optionalString(80),
  negotiationOwners: chipArray,
  pricingConfidence: optionalString(80),
  usedExternalService: optionalString(80),
  negotiationChallenges: chipArray,
  buyerNotes: z.string().trim().max(2000).optional().default(""),

  // Step 3 — Seller Profile (optional at the schema level; see superRefine)
  annualRevenue: optionalString(80),
  revenueGrowth: optionalString(80),
  dealSize: optionalString(80),
  termLength: optionalString(40),
  salesMotion: optionalString(120),
  contractTypes: chipArray,
  contractTypeOther: optionalString(160),
  dealDeskFunction: optionalString(160),
  dealPolicy: optionalString(160),
  dealDeskHelp: chipArray,
  nonStandardDealsPerQuarter: optionalString(40),
  approvalCycleTime: optionalString(40),
  dealApprovalInvolved: chipArray,
  contractChangePct: optionalString(40),
  signTimeAfterApproval: optionalString(40),
  avgDealCycleTime: optionalString(40),
  buyerPushbackTerms: chipArray,
  lostDealSlowApprovals: optionalString(40),
  biggestChallengeClosing: optionalString(160),
  sellerNotes: z.string().trim().max(2000).optional().default(""),

  // Step 4 — Platform Preferences (always asked, regardless of role)
  excitedModules: chipArray,
  dealDeskPriorities: chipArray,
  currentManagement: chipArray,
  currentManagementOther: optionalString(160),
  crm: optionalString(80),
  successDefinition: z.string().trim().max(2000).optional().default(""),
  heardAbout: optionalString(80),
  referrerName: optionalString(160),

  // Step 5 — Data Consent
  consentToContribute: z.literal(true, { error: "Consent to contribute data is required" }),
  agreedToNda: z.literal(true, { error: "Agreement to the Design Partner NDA terms is required" }),
  understandsAdvisoryOnly: z.literal(true, {
    error: "Acknowledging advisory-only outputs is required",
  }),

  // Honeypot — must stay empty. Real users never see this field. Named
  // differently from the real `companyWebsite` field above.
  companyWebsiteHoneypot: z.string().trim().optional().default(""),
});

export const designPartnerFormSchema = baseSchema.superRefine((data, ctx) => {
  const includesBuyer = data.role === "Buyer" || data.role === "Buyer + Seller";
  const includesSeller = data.role === "Seller" || data.role === "Buyer + Seller";

  const requireField = (key: keyof typeof data, message: string) => {
    const value = data[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      ctx.addIssue({ code: "custom", path: [key], message });
    }
  };

  if (includesBuyer) {
    requireField("annualSpend", "Annual technology spend is required");
    requireField("spendGrowth", "Expected spend growth is required");
    requireField("vendorCategories", "Select at least one vendor category");
    requireField("hasCommitments", "Select whether you have committed spend agreements");
    if (data.hasCommitments === "Yes" && data.commitmentPlatforms.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["commitmentPlatforms"],
        message: "Select at least one committed platform",
      });
    }
    requireField("activeContracts", "Active contract count is required");
    requireField("contractLength", "Most common contract length is required");
    requireField("renewalsPerYear", "Renewals per year is required");
    requireField("renewalAdvanceNotice", "Renewal advance notice is required");
    requireField("negotiationOwners", "Select at least one negotiation owner");
    requireField("pricingConfidence", "Pricing confidence is required");
    requireField("usedExternalService", "This field is required");
    requireField("negotiationChallenges", "Select at least one negotiation challenge");
  }

  if (includesSeller) {
    requireField("annualRevenue", "Annual revenue is required");
    requireField("revenueGrowth", "Expected revenue growth is required");
    requireField("dealSize", "Typical deal size is required");
    requireField("termLength", "Most typical term length is required");
    requireField("salesMotion", "Primary sales motion is required");
    requireField("contractTypes", "Select at least one contract type");
    requireField("dealDeskFunction", "Deal desk function is required");
    requireField("dealPolicy", "Deal policy / best practices answer is required");
    requireField("dealDeskHelp", "Select at least one area for help");
    requireField("nonStandardDealsPerQuarter", "Non-standard deals per quarter is required");
    requireField("approvalCycleTime", "Approval cycle time is required");
    requireField("dealApprovalInvolved", "Select at least one deal approval participant");
    requireField("contractChangePct", "Contract change percentage is required");
    requireField("signTimeAfterApproval", "Sign time after approval is required");
    requireField("avgDealCycleTime", "Average deal cycle time is required");
    requireField("buyerPushbackTerms", "Select at least one pushback term");
    requireField("lostDealSlowApprovals", "This field is required");
    requireField("biggestChallengeClosing", "Biggest closing challenge is required");
  }

  requireField("excitedModules", "Select at least one module");
  requireField("dealDeskPriorities", "Select at least one priority");
  requireField("currentManagement", "Select at least one option");
  requireField("crm", "Select your CRM");
  requireField("successDefinition", "Define success for your design partner experience");
  requireField("heardAbout", "Select how you heard about us");
  if (data.heardAbout === "Referred by someone" && !data.referrerName.trim()) {
    ctx.addIssue({ code: "custom", path: ["referrerName"], message: "Referrer name is required" });
  }
});

export type DesignPartnerFormValues = z.infer<typeof designPartnerFormSchema>;
export type DesignPartnerFormErrors = Partial<Record<keyof DesignPartnerFormValues, string>>;

/** Full-form validation, run right before submit. */
export function validateDesignPartnerForm(
  values: Record<string, unknown>,
): { success: true; data: DesignPartnerFormValues } | { success: false; errors: DesignPartnerFormErrors } {
  const result = designPartnerFormSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: DesignPartnerFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof DesignPartnerFormValues | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}
