import { z } from 'zod';

/**
 * Answers from the Waitlist application form. Mirrors
 * `aptaivisor-cms/src/api/waitlist-signup/validation-application.ts` — keep them in sync by hand.
 * Everything is stored as plain text; the CMS checks sizes and shape, the website form is what
 * offers the fixed option lists.
 */
const text = (max: number) => z.string().trim().min(1, 'This field is required').max(max);
const list = z.array(z.string().trim().min(1).max(120)).max(40);
const required = (message: string) => list.min(1, message);

export const DEAL_ROLES = ['Technology Buyer', 'Technology Seller', 'Both Buyer & Seller'] as const;

export const waitlistStep1Schema = z.object({
  firstName: text(30),
  lastName: text(30),
  email: z.email("Enter a valid email address").max(254),
  jobFunction: text(160),
  jobTitle: text(60),
  companyName: text(80),
  dealRole: z.enum(DEAL_ROLES, { error: 'Select your role' }),
  industry: text(160),
  employees: text(40),
  revenue: text(40),
  ownership: text(160),
  revenueGrowth: text(40),
  dealApprover: text(160),
  dealPolicy: text(160),
  helpWanted: list.optional().default([]),
  mattersMost: list.optional().default([]),
});

export const waitlistBuyerSchema = z.object({
  techSpend: text(60),
  techSpendGrowth: text(40),
  contractTypes: required('Select at least one'),
  challenges: required('Select at least one'),
});

export const waitlistSellerSchema = z.object({
  dealSize: text(60),
  contractTypes: required('Select at least one'),
  challenges: required('Select at least one'),
});

/** Step 2: the buyer and/or seller snapshot, depending on the role chosen in step 1. */
export const waitlistStep2Schema = z.object({
  buyer: waitlistBuyerSchema.optional(),
  seller: waitlistSellerSchema.optional(),
});

export const waitlistStep3Schema = z.object({
  platformInterests: required('Select at least one'),
  currentTools: required('Select at least one'),
  crm: text(160),
  heardFrom: text(160),
  referredBy: z.string().trim().max(50).optional().default(''),
  consentUpdates: z.literal(true, { error: 'This is required to join the waitlist' }),
  consentDisclaimer: z.literal(true, { error: 'This is required to join the waitlist' }),
  consentBenchmark: z.boolean(),
});

/** The whole application, sent once when the visitor submits the last step. */
export const waitlistSubmitSchema = z.object({
  step1: waitlistStep1Schema,
  step2: waitlistStep2Schema,
  step3: waitlistStep3Schema,
  // Honeypot — must stay empty.
  companyWebsite: z.string().trim().optional().default(""),
});
