import { z } from "zod";

/**
 * Validation shape for the "Join 2,000+ subscribers" newsletter form.
 *
 * Mirrors the zod schema in the CMS's newsletter-subscriber controller
 * (`apt-cms/src/api/newsletter-subscriber/validation.ts`) field-for-field.
 * They live in separate repos so can't literally share one module — keep
 * them in sync by hand if either changes.
 */
export const newsletterFormSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  // Honeypot — must stay empty. Real users never see this field.
  companyWebsite: z.string().trim().optional().default(""),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

/** Field-level error map, keyed by field name, for rendering under the input. */
export type NewsletterFormErrors = Partial<Record<keyof NewsletterFormValues, string>>;

/**
 * Runs the schema and flattens issues into a simple `{ field: message }` map
 * the form can render directly under the input.
 */
export function validateNewsletterForm(
  values: { email: string; companyWebsite?: string },
):
  | { success: true; data: NewsletterFormValues }
  | { success: false; errors: NewsletterFormErrors } {
  const result = newsletterFormSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: NewsletterFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof NewsletterFormValues | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, errors };
}
