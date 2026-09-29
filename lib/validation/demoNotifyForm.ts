import { z } from "zod";

/**
 * Validation shape for the "Notify me when the demo is live" modal.
 *
 * Mirrors the zod schema in the CMS's demo-notification controller
 * (`apt-cms/src/api/demo-notification/validation.ts`) field-for-field.
 * They live in separate repos so can't literally share one module — keep
 * them in sync by hand if either changes.
 */
export const demoNotifyFormSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  sourcePath: z.string().trim().max(300).optional(),
  // Honeypot — must stay empty. Real users never see this field.
  companyWebsite: z.string().trim().optional().default(""),
});

export type DemoNotifyFormValues = z.infer<typeof demoNotifyFormSchema>;
