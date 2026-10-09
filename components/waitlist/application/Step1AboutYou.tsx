"use client";

import {
  BusinessEmailField,
  type EmailVerificationStatus,
} from "@/components/design-partner/sections/questionnaire/Step1CompanyProfile";
import {
  SelectField,
  StepSectionHeading,
  TextField,
} from "@/components/design-partner/sections/questionnaire/shared";
import { CheckboxGroupField, RadioGroupField, SelectWithOther } from "./fields";
import {
  ALL_OF_THE_ABOVE,
  APPROVER_OPTIONS,
  DEAL_POLICY_OPTIONS,
  DEAL_ROLE_OPTIONS,
  EMPLOYEE_OPTIONS,
  FUNCTION_OPTIONS,
  GROWTH_OPTIONS,
  HELP_OPTIONS,
  INDUSTRY_OPTIONS,
  MATTERS_OPTIONS,
  NONE_RIGHT_NOW,
  OTHER,
  OWNERSHIP_OPTIONS,
  REVENUE_OPTIONS,
  type DealRole,
} from "./options";

/** Step 1 — "About You" + "Company Profile" (questionnaire Sections A and B). */

export type Step1State = {
  firstName: string;
  lastName: string;
  workEmail: string;
  emailVerification: EmailVerificationStatus;
  jobFunction: string;
  jobFunctionOther: string;
  jobTitle: string;
  companyName: string;
  dealRole: DealRole | "";
  industry: string;
  industryOther: string;
  employees: string;
  revenue: string;
  ownership: string;
  ownershipOther: string;
  revenueGrowth: string;
  dealApprover: string;
  dealPolicy: string;
  helpWanted: string[];
  mattersMost: string[];
};

export const INITIAL_STEP1: Step1State = {
  firstName: "",
  lastName: "",
  workEmail: "",
  emailVerification: "unverified",
  jobFunction: "",
  jobFunctionOther: "",
  jobTitle: "",
  companyName: "",
  dealRole: "",
  industry: "",
  industryOther: "",
  employees: "",
  revenue: "",
  ownership: "",
  ownershipOther: "",
  revenueGrowth: "",
  dealApprover: "",
  dealPolicy: "",
  helpWanted: [],
  mattersMost: [],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED = "This field is required";

/** Which fields are still missing/invalid — one entry per field, used for both the red text and the Continue check. */
export function step1Errors(v: Step1State): Partial<Record<keyof Step1State, string>> {
  const e: Partial<Record<keyof Step1State, string>> = {};
  const need = (key: keyof Step1State, ok: boolean) => {
    if (!ok) e[key] = REQUIRED;
  };
  need("firstName", Boolean(v.firstName.trim()));
  need("lastName", Boolean(v.lastName.trim()));
  if (!v.workEmail.trim()) e.workEmail = REQUIRED;
  else if (!EMAIL_PATTERN.test(v.workEmail.trim())) e.workEmail = "Enter a valid email address (e.g. name@company.com)";
  need("jobFunction", Boolean(v.jobFunction));
  need("jobFunctionOther", v.jobFunction !== OTHER || Boolean(v.jobFunctionOther.trim()));
  need("jobTitle", Boolean(v.jobTitle.trim()));
  need("companyName", Boolean(v.companyName.trim()));
  need("dealRole", Boolean(v.dealRole));
  need("industry", Boolean(v.industry));
  need("industryOther", v.industry !== OTHER || Boolean(v.industryOther.trim()));
  need("employees", Boolean(v.employees));
  need("revenue", Boolean(v.revenue));
  need("ownership", Boolean(v.ownership));
  need("ownershipOther", v.ownership !== OTHER || Boolean(v.ownershipOther.trim()));
  need("revenueGrowth", Boolean(v.revenueGrowth));
  need("dealApprover", Boolean(v.dealApprover));
  need("dealPolicy", Boolean(v.dealPolicy));
  return e;
}

export const isStep1Valid = (v: Step1State) => Object.keys(step1Errors(v)).length === 0;

/** "None right now" excludes the others. */
const nextHelp = (prev: string[], next: string[]) => {
  const added = next.find((o) => !prev.includes(o));
  if (added === NONE_RIGHT_NOW) return [NONE_RIGHT_NOW];
  return next.filter((o) => o !== NONE_RIGHT_NOW);
};

/** "All of the above" ticks everything; unticking any other option clears it. */
const nextMatters = (prev: string[], next: string[]) => {
  const everyOther = MATTERS_OPTIONS.filter((o) => o !== ALL_OF_THE_ABOVE);
  const added = next.find((o) => !prev.includes(o));
  if (added === ALL_OF_THE_ABOVE) return [...MATTERS_OPTIONS];
  if (prev.includes(ALL_OF_THE_ABOVE) && !next.includes(ALL_OF_THE_ABOVE)) return [];
  const others = next.filter((o) => o !== ALL_OF_THE_ABOVE);
  return everyOther.every((o) => others.includes(o)) ? [...MATTERS_OPTIONS] : others;
};

export function Step1AboutYou({
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
  const set = <K extends keyof Step1State>(key: K, v: Step1State[K]) => onChange({ ...value, [key]: v });
  const errors = step1Errors(value);
  const err = (key: keyof Step1State) => (showErrors ? errors[key] : undefined);
  // An invalid email format is worth showing as soon as something is typed.
  const emailError = errors.workEmail && (showErrors || value.workEmail.trim()) ? errors.workEmail : undefined;

  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="About You" stepLabel={stepLabel} />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
          <TextField
            label="Your first name"
            required
            value={value.firstName}
            onChange={(v) => set("firstName", v)}
            placeholder="Enter first name"
            maxLength={30}
            error={err("firstName")}
          />
          <TextField
            label="Your last name"
            required
            value={value.lastName}
            onChange={(v) => set("lastName", v)}
            placeholder="Enter last name"
            maxLength={30}
            error={err("lastName")}
          />
          <BusinessEmailField
            label="Your work email address"
            sourcePath="/waitlist"
            value={value.workEmail}
            verification={value.emailVerification}
            onChange={(v) => set("workEmail", v)}
            onVerifyNow={() => set("emailVerification", "pending")}
            error={emailError}
          />
          <SelectWithOther
            label="Your function"
            required
            value={value.jobFunction}
            otherValue={value.jobFunctionOther}
            onChange={(v) => set("jobFunction", v)}
            onOtherChange={(v) => set("jobFunctionOther", v)}
            options={FUNCTION_OPTIONS}
            error={err("jobFunction")}
            otherError={err("jobFunctionOther")}
          />
          <TextField
            label="Your job title"
            required
            value={value.jobTitle}
            onChange={(v) => set("jobTitle", v)}
            placeholder="e.g. VP Procurement, VP Sales, CFO"
            maxLength={60}
            error={err("jobTitle")}
          />
          <TextField
            label="Your company name"
            required
            value={value.companyName}
            onChange={(v) => set("companyName", v)}
            placeholder="Enter company name"
            maxLength={80}
            error={err("companyName")}
          />
          <RadioGroupField
            label="Your role in contract and deal workflows"
            required
            value={value.dealRole}
            onChange={(v) => set("dealRole", v as DealRole)}
            options={DEAL_ROLE_OPTIONS}
            error={err("dealRole")}
          />
          <SelectWithOther
            label="Your company's industry"
            required
            value={value.industry}
            otherValue={value.industryOther}
            onChange={(v) => set("industry", v)}
            onOtherChange={(v) => set("industryOther", v)}
            options={INDUSTRY_OPTIONS}
            error={err("industry")}
            otherError={err("industryOther")}
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Company Profile" />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
          <SelectField
            label="Number of employees at your company"
            required
            value={value.employees}
            onChange={(v) => set("employees", v)}
            placeholder="Select"
            options={EMPLOYEE_OPTIONS}
            error={err("employees")}
          />
          <SelectField
            label="Your company's annual revenue"
            required
            value={value.revenue}
            onChange={(v) => set("revenue", v)}
            placeholder="Select"
            options={REVENUE_OPTIONS}
            error={err("revenue")}
          />
          <SelectWithOther
            label="Your company's ownership"
            required
            value={value.ownership}
            otherValue={value.ownershipOther}
            onChange={(v) => set("ownership", v)}
            onOtherChange={(v) => set("ownershipOther", v)}
            options={OWNERSHIP_OPTIONS}
            error={err("ownership")}
            otherError={err("ownershipOther")}
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
          <SelectField
            label="Expected annual revenue growth over the next 3 years (a rough guess is fine)"
            required
            value={value.revenueGrowth}
            onChange={(v) => set("revenueGrowth", v)}
            placeholder="Select"
            options={GROWTH_OPTIONS}
            error={err("revenueGrowth")}
          />
          <SelectField
            label="Who reviews and approves deals (discounts, special terms) at your company?"
            required
            value={value.dealApprover}
            onChange={(v) => set("dealApprover", v)}
            placeholder="Select"
            options={APPROVER_OPTIONS}
            error={err("dealApprover")}
          />
        </div>
        <RadioGroupField
          label="Do you have Deal policies and best practices?"
          required
          value={value.dealPolicy}
          onChange={(v) => set("dealPolicy", v)}
          options={DEAL_POLICY_OPTIONS}
          error={err("dealPolicy")}
        />
        <CheckboxGroupField
          label="Where would you want help?"
          value={value.helpWanted}
          onChange={(next) => set("helpWanted", nextHelp(value.helpWanted, next))}
          options={HELP_OPTIONS}
        />
        <CheckboxGroupField
          label="What matters most to your company when structuring deals?"
          value={value.mattersMost}
          onChange={(next) => set("mattersMost", nextMatters(value.mattersMost, next))}
          options={MATTERS_OPTIONS}
        />
      </div>
    </div>
  );
}
