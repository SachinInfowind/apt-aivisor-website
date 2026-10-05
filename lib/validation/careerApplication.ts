import { z } from "zod";

/**
 * Validation shape for the Career page's "Express interest early" modal.
 *
 * Mirrors the zod schema in the CMS's career-application controller
 * (`apt-cms/src/api/career-application/validation.ts`) field-for-field, so a
 * payload this schema accepts is guaranteed to also pass there. They live in
 * separate repos so can't literally share one module — keep them in sync by
 * hand if either changes.
 *
 * The resume file is validated separately (it's a `File`, not part of this
 * JSON-shaped schema) by `validateResumeFile` below.
 */
export const careerApplicationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(160),
  email: z.email("Enter a valid email address").max(254),
  website: z.string().trim().min(1, "Website is required").max(300),
  areaOfInterest: z.enum(["engineering", "product", "sales", "operations", "other"], {
    error: "Select an area of interest",
  }),
  linkedinOrPortfolio: z
    .string()
    .trim()
    .min(1, "LinkedIn or portfolio URL is required")
    .max(300),
  message: z.string().trim().max(4000).optional().default(""),
  // Honeypot — must stay empty. Real users never see this field.
  companyName: z.string().trim().optional().default(""),
});

export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;

export type CareerApplicationErrors = Partial<
  Record<keyof CareerApplicationValues, string>
>;

export function validateCareerApplication(
  values: Partial<Record<keyof CareerApplicationValues, string>>,
):
  | { success: true; data: CareerApplicationValues }
  | { success: false; errors: CareerApplicationErrors } {
  const result = careerApplicationSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: CareerApplicationErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof CareerApplicationValues | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, errors };
}

export const RESUME_MAX_BYTES = 10 * 1024 * 1024; // 10MB
export const RESUME_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const RESUME_ACCEPT = ".pdf,.doc,.docx";

export function validateResumeFile(file: File | null): string | null {
  if (!file || file.size === 0) return "A resume file is required";
  if (file.size > RESUME_MAX_BYTES) return "Resume must be 10MB or smaller";
  if (file.type && !RESUME_ALLOWED_TYPES.includes(file.type)) {
    return "Resume must be a PDF or Word document";
  }
  return null;
}
