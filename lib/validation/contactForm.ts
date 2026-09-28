import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Validation shape for the "Get in touch" contact form.
 *
 * Mirrors the zod schema in the CMS's contact-submission controller
 * (`apt-cms/src/api/contact-submission/validation.ts`) field-for-field, so a
 * payload this schema accepts is guaranteed to also pass there. They live in
 * separate repos so can't literally share one module — keep them in sync by
 * hand if either changes.
 *
 * Used both client-side (fast inline errors before a round trip) and by
 * `app/api/contact/route.ts` (the authoritative check before forwarding to
 * Strapi).
 */
export const contactFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(120),
    lastName: z.string().trim().min(1, "Last name is required").max(120),
    email: z.email("Enter a valid email address").max(254),
    phoneCountry: z
      .string()
      .trim()
      .length(2, "Select a country")
      .transform((v) => v.toUpperCase()),
    phone: z.string().trim().min(1, "Phone number is required").max(32),
    message: z.string().trim().max(4000).optional().default(""),
    agreedToPrivacyPolicy: z.literal(true, {
      error: "You must agree to the privacy policy",
    }),
    // Honeypot — must stay empty. Real users never see this field.
    companyWebsite: z.string().trim().optional().default(""),
  })
  .refine(
    (data) => isValidPhoneNumber(data.phone, data.phoneCountry as never),
    {
      message: "Enter a valid phone number for the selected country",
      path: ["phone"],
    },
  );

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Loose shape of the raw, not-yet-validated form state (e.g. a checkbox is a plain boolean). */
export type ContactFormInput = {
  [K in keyof ContactFormValues]: ContactFormValues[K] extends true
    ? boolean
    : ContactFormValues[K];
};

/** Field-level error map, keyed by field name, for rendering under each input. */
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

/**
 * Runs the schema and flattens issues into a simple `{ field: message }` map
 * the form can render directly under each input.
 */
export function validateContactForm(
  values: Partial<ContactFormInput>,
): { success: true; data: ContactFormValues } | { success: false; errors: ContactFormErrors } {
  const result = contactFormSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ContactFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactFormValues | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, errors };
}
