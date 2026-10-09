"use client";

import { useState } from "react";
import { ALL_COUNTRY_NAMES } from "@/lib/countries";
import { useWafFetch } from "@/components/ui/WafProtection";
import {
  Field,
  PillRadioGroup,
  SelectField,
  StepSectionHeading,
  TextField,
} from "./shared";

/** Step 1 — Figma "Design Partner Program New/Step1" (node 3376:2219). */

export type Role = "Buyer" | "Seller" | "Buyer + Seller";

export type EmailVerificationStatus = "unverified" | "pending" | "verified";

export type Step1State = {
  companyName: string;
  nameAndTitle: string;
  workEmail: string;
  /** Business Email verification state — Figma "Business Email" component set
   * (Pending Email / Email Verify Now / Email Verified). Driven locally for
   * now; sending the real verification link is backend work, not yet wired. */
  emailVerification: EmailVerificationStatus;
  companyWebsite: string;
  industry: string;
  ownership: string;
  employeeCount: string;
  hqCountry: string;
  hqRegion: string;
  role: Role | "";
};

export const INITIAL_STEP1: Step1State = {
  companyName: "",
  nameAndTitle: "",
  workEmail: "",
  emailVerification: "unverified",
  companyWebsite: "",
  industry: "",
  ownership: "",
  employeeCount: "",
  hqCountry: "",
  hqRegion: "",
  role: "",
};

const INDUSTRY_OPTIONS = [
  "Technology (Software / SaaS / Cyber Security)",
  "Technology (Hardware / Infrastructure)",
  "Financial Services",
  "Healthcare / Life Sciences",
  "Manufacturing",
  "Retail / E-commerce",
  "Media & Entertainment",
  "Professional Services",
  "Energy / Utilities",
  "Education",
  "Telecommunications",
  "Government / Public Sector",
  "Other",
];

const OWNERSHIP_OPTIONS = [
  "Public",
  "Private (PE or VC backed)",
  "Private (founder or family owned)",
  "Other",
];

const EMPLOYEE_OPTIONS = [
  "1–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001–5,000",
  "5,001–25,000",
  "25,001+",
];

const ROLE_OPTIONS: Role[] = ["Buyer", "Seller", "Buyer + Seller"];
/** Display labels only — stored value stays "Buyer"/"Seller"/"Buyer + Seller"
 * so routing logic, CMS schema and seed data don't need to change. */
const ROLE_OPTION_LABELS: Record<string, string> = {
  Buyer: "Technology Buyer",
  Seller: "Technology Seller",
  "Buyer + Seller": "Both Buyer & Seller",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
      <path
        d="M1.66602 5.83301L8.47011 10.5959C9.02109 10.9816 9.29658 11.1744 9.59624 11.2491C9.86093 11.3151 10.1378 11.3151 10.4025 11.2491C10.7021 11.1744 10.9776 10.9816 11.5286 10.5959L18.3327 5.83301M5.66602 16.6663H14.3327C15.7328 16.6663 16.4329 16.6663 16.9677 16.3939C17.4381 16.1542 17.8205 15.7717 18.0602 15.3013C18.3327 14.7665 18.3327 14.0665 18.3327 12.6663V7.33301C18.3327 5.93288 18.3327 5.23281 18.0602 4.69803C17.8205 4.22763 17.4381 3.84517 16.9677 3.60549C16.4329 3.33301 15.7328 3.33301 14.3327 3.33301H5.66602C4.26588 3.33301 3.56582 3.33301 3.03104 3.60549C2.56063 3.84517 2.17818 4.22763 1.9385 4.69803C1.66602 5.23281 1.66602 5.93288 1.66602 7.33301V12.6663C1.66602 14.0665 1.66602 14.7665 1.9385 15.3013C2.17818 15.7717 2.56063 16.1542 3.03104 16.3939C3.56582 16.6663 4.26588 16.6663 5.66602 16.6663Z"
        stroke="#667085"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PendingClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path
        d="M15.1333 7.66667L13.8004 9L12.4666 7.66667M13.9634 8.66667C13.9876 8.44778 14 8.22534 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C9.88484 14 11.5667 13.1309 12.6667 11.7716M8 4.66667V8L10 9.33333"
        stroke="#F79009"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifiedCheckIcon() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-brand">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="white"
          strokeWidth="1.6666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Business Email field — Figma "Business Email" component set (3395:6528):
 * Pending Email / Email Verify Now / Email Verified. Clicking "Verify Now"
 * only flips local state to "pending" for now — actually sending the
 * verification email and handling the inbound link click is backend work,
 * not yet wired (see conversation). */
export function BusinessEmailField({
  value,
  verification,
  onChange,
  onVerifyNow,
  error,
  label = "Business Email",
  sourcePath = "/design-partner",
}: {
  value: string;
  verification: EmailVerificationStatus;
  onChange: (v: string) => void;
  onVerifyNow: () => void;
  error?: string;
  label?: string;
  /** Page the emailed link returns to (the CMS only accepts known pages). */
  sourcePath?: "/design-partner" | "/waitlist";
}) {
  const wafFetch = useWafFetch();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleVerifyClick = async () => {
    setSendError(null);
    setSending(true);
    try {
      const res = await wafFetch("/api/design-partner-application/verify-email/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value.trim(),
          sourcePath,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setSendError(body.message ?? "Couldn't send the verification email — please try again.");
        return;
      }
      onVerifyNow();
    } catch {
      setSendError("Couldn't send the verification email — please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Field label={label} required error={error ?? sendError ?? undefined} hint="A verification link will be sent to this email.">
      <div
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:border-brand-accent ${
          error || sendError ? "border-red-400" : "border-line-strong"
        }`}
      >
        <MailIcon />
        <input
          type="email"
          value={value}
          onChange={(e) => {
            setSendError(null);
            onChange(e.target.value);
          }}
          placeholder="Enter your work email"
          className="w-full text-base leading-6 text-heading outline-none placeholder:text-subtle"
        />
        {verification === "pending" ? (
          <PendingClockIcon />
        ) : verification === "verified" ? (
          <VerifiedCheckIcon />
        ) : (
          <button
            type="button"
            onClick={handleVerifyClick}
            disabled={sending || !value.trim() || !EMAIL_PATTERN.test(value.trim())}
            className="inline-flex h-6 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[#4F8DFF] bg-white px-3 text-xs font-semibold leading-[1.5] text-brand-deep shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending…" : "Verify Now"}
          </button>
        )}
      </div>
    </Field>
  );
}

/** Latest Step 1 Figma (frame 3423:4690) marks all 10 fields required,
 * matching the PDF spec's blanket rule — confirmed with the client. */
export function isStep1Valid(v: Step1State): boolean {
  return Boolean(
    v.companyName.trim() &&
      v.nameAndTitle.trim() &&
      EMAIL_PATTERN.test(v.workEmail.trim()) &&
      v.companyWebsite.trim() &&
      v.industry.trim() &&
      v.ownership.trim() &&
      v.employeeCount.trim() &&
      v.hqCountry.trim() &&
      v.hqRegion.trim() &&
      v.role,
  );
}

export function estimatedTimeFor(role: Role | ""): string | null {
  if (role === "Buyer" || role === "Seller") return "Estimated time to complete: ~10 minutes";
  if (role === "Buyer + Seller") return "Estimated time to complete: ~15 minutes";
  return null;
}

const REQUIRED = "This field is required";

export function Step1CompanyProfile({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: Step1State;
  onChange: (next: Step1State) => void;
  stepLabel: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof Step1State>(key: K, v: Step1State[K]) =>
    onChange({ ...value, [key]: v });
  const err = (filled: boolean) => (showErrors && !filled ? REQUIRED : undefined);

  const emailInvalid = value.workEmail.trim() && !EMAIL_PATTERN.test(value.workEmail.trim());
  const emailError = emailInvalid
    ? "Enter a valid email address (e.g. name@company.com)"
    : err(Boolean(value.workEmail.trim()));

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <StepSectionHeading title="Your Company Profile" stepLabel={stepLabel} />

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <TextField
          label="Company name"
          required
          value={value.companyName}
          onChange={(v) => set("companyName", v)}
          placeholder="Enter company name"
          error={err(Boolean(value.companyName.trim()))}
        />
        <TextField
          label="Your name and title"
          required
          value={value.nameAndTitle}
          onChange={(v) => set("nameAndTitle", v)}
          placeholder="Enter your name and title"
          error={err(Boolean(value.nameAndTitle.trim()))}
        />
        <BusinessEmailField
          value={value.workEmail}
          verification={value.emailVerification}
          onChange={(v) => set("workEmail", v)}
          onVerifyNow={() => set("emailVerification", "pending")}
          error={emailError}
        />

        <Field label="Company website" required error={err(Boolean(value.companyWebsite.trim()))}>
          <div
            className={`flex w-full items-stretch overflow-hidden rounded-lg border bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:border-brand-accent ${
              err(Boolean(value.companyWebsite.trim())) ? "border-red-400" : "border-line-strong"
            }`}
          >
            <span className="flex items-center border-r border-line-strong pl-3.5 pr-3 text-base leading-6 text-ink">
              http://
            </span>
            <input
              type="text"
              value={value.companyWebsite}
              onChange={(e) => set("companyWebsite", e.target.value)}
              placeholder="Enter company website"
              className="w-full px-3.5 py-2.5 text-base leading-6 text-heading outline-none placeholder:text-subtle"
            />
          </div>
        </Field>

        <SelectField
          label="Industry"
          required
          value={value.industry}
          onChange={(v) => set("industry", v)}
          placeholder="Select"
          options={INDUSTRY_OPTIONS}
          error={err(Boolean(value.industry.trim()))}
        />
        <SelectField
          label="Company's ownership"
          required
          value={value.ownership}
          onChange={(v) => set("ownership", v)}
          placeholder="Select company stage"
          options={OWNERSHIP_OPTIONS}
          error={err(Boolean(value.ownership.trim()))}
        />
        <SelectField
          label="Number of employees"
          required
          value={value.employeeCount}
          onChange={(v) => set("employeeCount", v)}
          placeholder="Select number of employees"
          options={EMPLOYEE_OPTIONS}
          error={err(Boolean(value.employeeCount.trim()))}
        />
        <SelectField
          label="Headquarters country"
          required
          value={value.hqCountry}
          onChange={(v) => set("hqCountry", v)}
          placeholder="Select"
          options={ALL_COUNTRY_NAMES}
          error={err(Boolean(value.hqCountry.trim()))}
        />
        <TextField
          label="Headquarters state / region"
          required
          value={value.hqRegion}
          onChange={(v) => set("hqRegion", v)}
          placeholder="Enter State/ region"
          error={err(Boolean(value.hqRegion.trim()))}
        />

        <div className="sm:max-w-[36.8125rem]">
          <PillRadioGroup
            label="I am joining as a"
            required
            value={value.role}
            onChange={(v) => set("role", v as Role)}
            options={ROLE_OPTIONS}
            optionLabels={ROLE_OPTION_LABELS}
            variant="radio"
            error={err(Boolean(value.role))}
          />
          {value.role ? (
            <p className="mt-2 text-sm leading-5 text-nav">{estimatedTimeFor(value.role)}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
