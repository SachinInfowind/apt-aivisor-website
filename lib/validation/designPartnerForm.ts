import { z } from "zod";

/**
 * Validation shape for the Design Partner 3-step application form.
 *
 * Mirrors the zod schema in the CMS's design-partner-application controller
 * (`apt-cms/src/api/design-partner-application/validation.ts`) field-for-field.
 * They live in separate repos so can't literally share one module — keep
 * them in sync by hand if either changes.
 */
const tagArray = z.array(z.string().trim().min(1).max(120)).max(40).optional();

export const designPartnerFormSchema = z.object({
  // Step 1 — Profile & Company
  fullName: z.string().trim().min(1, "Full name is required").max(160),
  workEmail: z.email("Enter a valid email address").max(254),
  title: z.string().trim().min(1, "Title / role is required").max(160),
  participatingAs: z.enum(["buyer", "seller", "both"], {
    error: "Select buyer, seller, or both",
  }),
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  companyWebsite: z.string().trim().max(300).optional().default(""),
  annualRevenue: z.string().trim().min(1, "Select annual revenue").max(80),
  companySize: z.string().trim().max(80).optional().default(""),
  companyStatus: z.string().trim().min(1, "Select company status").max(80),
  primaryIndustry: z.string().trim().min(1, "Select an industry").max(80),
  projectedGrowth: z.string().trim().max(80).optional().default(""),

  // Step 2 — Tech & Vendors (all optional)
  techVendors: tagArray,
  aiAppVendorsOther: tagArray,
  cloudVendorsOther: tagArray,
  techCategories: tagArray,
  storageDetail: tagArray,
  dataAnalyticsDetail: tagArray,
  computeDetail: tagArray,
  networkingDetail: tagArray,
  aiServicesDetail: tagArray,
  managedServicesCloudDetail: tagArray,
  peripheralsDetail: tagArray,
  managedServicesDetail: tagArray,
  bundledDetail: z.string().trim().max(2000).optional().default(""),

  // Step 3 — Economics & Terms
  avgDiscount: z.string().trim().max(80).optional().default(""),
  dealStructure: z.string().trim().max(80).optional().default(""),
  commitmentSize: z.string().trim().max(80).optional().default(""),
  customDealConsiderations: z.string().trim().max(4000).optional().default(""),
  agreedToTerms: z.literal(true, {
    error: "You must agree to the Terms & Conditions and Privacy Policy",
  }),
  consentToContact: z.boolean().optional().default(false),

  // Honeypot — must stay empty. Real users never see this field. Named
  // differently from the real `companyWebsite` field above.
  companyWebsiteHoneypot: z.string().trim().optional().default(""),
});

export type DesignPartnerFormValues = z.infer<typeof designPartnerFormSchema>;

/** Loose pre-validation shape — every field as a plain string/boolean/array,
 * since raw form state isn't known to satisfy the enum/literal constraints
 * above until it's run through the schema. */
export type DesignPartnerFormInput = {
  [K in keyof DesignPartnerFormValues]: DesignPartnerFormValues[K] extends true
    ? boolean
    : DesignPartnerFormValues[K] extends "buyer" | "seller" | "both"
      ? string
      : DesignPartnerFormValues[K];
};

export type DesignPartnerFormErrors = Partial<Record<keyof DesignPartnerFormValues, string>>;

/** Field groups per wizard step, used to validate one step at a time. */
export const STEP_FIELDS = {
  1: [
    "fullName",
    "workEmail",
    "title",
    "participatingAs",
    "companyName",
    "companyWebsite",
    "annualRevenue",
    "companySize",
    "companyStatus",
    "primaryIndustry",
    "projectedGrowth",
  ],
  2: [
    "techVendors",
    "aiAppVendorsOther",
    "cloudVendorsOther",
    "techCategories",
    "storageDetail",
    "dataAnalyticsDetail",
    "computeDetail",
    "networkingDetail",
    "aiServicesDetail",
    "managedServicesCloudDetail",
    "peripheralsDetail",
    "managedServicesDetail",
    "bundledDetail",
  ],
  3: [
    "avgDiscount",
    "dealStructure",
    "commitmentSize",
    "customDealConsiderations",
    "agreedToTerms",
    "consentToContact",
  ],
} as const satisfies Record<number, readonly (keyof DesignPartnerFormValues)[]>;

/**
 * Validates only the fields belonging to one step (Step 2 is all-optional so
 * it always passes; Steps 1 and 3 have real required fields).
 */
export function validateStep(
  step: 1 | 2 | 3,
  values: Partial<DesignPartnerFormInput>,
): { success: true } | { success: false; errors: DesignPartnerFormErrors } {
  const shape = designPartnerFormSchema.shape;
  const stepSchema = z.object(
    Object.fromEntries(STEP_FIELDS[step].map((key) => [key, shape[key]])) as never,
  );
  const result = stepSchema.safeParse(values);
  if (result.success) return { success: true };

  const errors: DesignPartnerFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof DesignPartnerFormValues | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}

/** Full-form validation, run right before submit. */
export function validateDesignPartnerForm(
  values: Partial<DesignPartnerFormInput>,
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
