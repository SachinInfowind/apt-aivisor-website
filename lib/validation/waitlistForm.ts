import { z } from "zod";
import {
  ROLE_OPTIONS,
  SPEND_OPTIONS,
} from "@/components/waitlist/formOptions";

/**
 * Validation shape for the "Reserve your spot" waitlist form.
 *
 * Mirrors the zod schema in the CMS's waitlist-signup controller
 * (`apt-cms/src/api/waitlist-signup/validation.ts`) field-for-field, so a
 * payload this schema accepts is guaranteed to also pass there. They live in
 * separate repos so can't literally share one module — keep them in sync by
 * hand if either changes.
 *
 * `role`/`spend` are derived from `formOptions.ts` so this schema never
 * drifts from the dropdown's own option list.
 */
const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const SPEND_VALUES = SPEND_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const waitlistFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(160),
  email: z.email("Enter a valid email address").max(254),
  company: z.string().trim().min(1, "Company is required").max(160),
  role: z.enum(ROLE_VALUES, { error: "Select a role" }),
  interest: z.enum(["buyer", "seller", "both"], {
    error: "Select buyer, seller, or both",
  }),
  spend: z.enum(SPEND_VALUES).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().default(""),
  agreedToTerms: z.literal(true, {
    error: "You must agree to the terms and privacy policy",
  }),
  // Honeypot — must stay empty. Real users never see this field.
  companyWebsite: z.string().trim().optional().default(""),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

/**
 * Loose shape of the raw, not-yet-validated form state — plain strings for
 * the `role`/`interest`/`spend` enums (e.g. `interest` may be `""` before the
 * user picks one) and a plain boolean for the checkbox, since none of that
 * is known to be valid until it's run through the schema.
 */
export type WaitlistFormInput = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  interest: string;
  spend: string;
  notes: string;
  agreedToTerms: boolean;
  companyWebsite: string;
};

/** Field-level error map, keyed by field name, for rendering under each input. */
export type WaitlistFormErrors = Partial<Record<keyof WaitlistFormValues, string>>;

/**
 * Runs the schema and flattens issues into a simple `{ field: message }` map
 * the form can render directly under each input.
 */
export function validateWaitlistForm(
  values: Partial<WaitlistFormInput>,
):
  | { success: true; data: WaitlistFormValues }
  | { success: false; errors: WaitlistFormErrors } {
  const result = waitlistFormSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: WaitlistFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof WaitlistFormValues | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, errors };
}
