import { z } from "zod";

/**
 * Validation shape for the "Request NDA draft" modal (Design Partner page).
 *
 * Mirrors the zod schema in the CMS's nda-request controller
 * (`apt-cms/src/api/nda-request/validation.ts`) field-for-field.
 * They live in separate repos so can't literally share one module — keep
 * them in sync by hand if either changes.
 */
export const ndaRequestFormSchema = z.object({
  signerName: z.string({ error: "Enter your full name" }).trim().min(2, "Enter your full name").max(120),
  signerTitle: z.string({ error: "Enter your job title" }).trim().min(2, "Enter your job title").max(120),
  signerEmail: z.email({ error: "Enter a valid email address" }).max(254),
  companyName: z
    .string({ error: "Enter your company's legal name" })
    .trim()
    .min(2, "Enter your company's legal name")
    .max(160),
  sourcePath: z.string().trim().max(300).optional(),
  // Honeypot — must stay empty. Real users never see this field.
  website: z.string().trim().optional().default(""),
});

export type NdaRequestFormValues = z.infer<typeof ndaRequestFormSchema>;
export type NdaRequestFormErrors = Partial<Record<keyof NdaRequestFormValues, string>>;

/** "Already signed NDA": just the email. Mirrors the CMS's ndaCheckInputSchema. */
export const ndaCheckFormSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).max(254),
});

/** Signed NDA upload (the link in the NDA email). */
export const NDA_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const ndaUploadTokenSchema = z.string().regex(/^[0-9a-f]{64}$/);
