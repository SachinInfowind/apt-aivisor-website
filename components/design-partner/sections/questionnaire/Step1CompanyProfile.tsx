"use client";

import {
  Field,
  PillRadioGroup,
  SelectField,
  StepSectionHeading,
  TextField,
} from "./shared";

/** Step 1 — Figma "Design Partner Program New/Step1" (node 3376:2219). */

export type Role = "Buyer" | "Seller" | "Buyer + Seller";

export type Step1State = {
  companyName: string;
  nameAndTitle: string;
  workEmail: string;
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** PDF UX notes: "Required — all questions except B3d, C3g, D5a." Figma's Step 1
 * export only drew asterisks on 5 of 9 fields; the other 4 are required per the
 * document even though the mockup omitted the marker. `workEmail` isn't in the
 * Figma design at all — added per the client's confirmation that applications
 * need a way to be followed up on. */
export function isStep1Valid(v: Step1State): boolean {
  return Boolean(
    v.companyName.trim() &&
      v.nameAndTitle.trim() &&
      EMAIL_PATTERN.test(v.workEmail.trim()) &&
      v.companyWebsite.trim() &&
      v.industry &&
      v.ownership &&
      v.employeeCount &&
      v.hqCountry &&
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
        <TextField
          label="Work email"
          required
          type="email"
          value={value.workEmail}
          onChange={(v) => set("workEmail", v)}
          placeholder="Enter your work email"
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
          error={err(Boolean(value.industry))}
        />
        <SelectField
          label="Company's ownership"
          required
          value={value.ownership}
          onChange={(v) => set("ownership", v)}
          placeholder="Select company stage"
          options={OWNERSHIP_OPTIONS}
          error={err(Boolean(value.ownership))}
        />
        <SelectField
          label="Number of employees"
          required
          value={value.employeeCount}
          onChange={(v) => set("employeeCount", v)}
          placeholder="Select number of employees"
          options={EMPLOYEE_OPTIONS}
          error={err(Boolean(value.employeeCount))}
        />
        <SelectField
          label="Headquarters country"
          required
          value={value.hqCountry}
          onChange={(v) => set("hqCountry", v)}
          placeholder="Select"
          options={["United States"]}
          error={err(Boolean(value.hqCountry))}
        />
        <TextField
          label="Headquarters state / region"
          required
          value={value.hqRegion}
          onChange={(v) => set("hqRegion", v)}
          placeholder="Enter state / region"
          error={err(Boolean(value.hqRegion.trim()))}
        />

        <div className="sm:max-w-[36.8125rem]">
          <PillRadioGroup
            label="I am joining as a"
            required
            value={value.role}
            onChange={(v) => set("role", v as Role)}
            options={ROLE_OPTIONS}
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
