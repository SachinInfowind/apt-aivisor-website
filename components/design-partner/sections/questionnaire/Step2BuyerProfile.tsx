"use client";

import {
  ChipMultiSelect,
  PillRadioGroup,
  SelectField,
  StepSectionHeading,
  TextareaField,
} from "./shared";

/** Step 2 — Buyer Profile. Figma "Design Partner Program New/Step2" (node 3376:2266). */

export type Step2State = {
  annualSpend: string;
  spendGrowth: string;
  vendorCategories: string[];
  hasCommitments: string;
  commitmentPlatforms: string[];
  activeContracts: string;
  contractLength: string;
  renewalsPerYear: string;
  renewalAdvanceNotice: string;
  negotiationOwners: string[];
  pricingConfidence: string;
  usedExternalService: string;
  negotiationChallenges: string[];
  buyerNotes: string;
};

export const INITIAL_STEP2: Step2State = {
  annualSpend: "",
  spendGrowth: "",
  vendorCategories: [],
  hasCommitments: "",
  commitmentPlatforms: [],
  activeContracts: "",
  contractLength: "",
  renewalsPerYear: "",
  renewalAdvanceNotice: "",
  negotiationOwners: [],
  pricingConfidence: "",
  usedExternalService: "",
  negotiationChallenges: [],
  buyerNotes: "",
};

const ANNUAL_SPEND = [
  "Under $500K",
  "$500K – $2M",
  "$2M – $10M",
  "$10M – $50M",
  "$50M – $250M",
  "Above $250M",
  "Not sure",
];

const SPEND_GROWTH = ["Declining", "0 – 10%", "10% – 25%", "25% – 50%", "50% – 100%", "Over 100%", "Not sure"];

const VENDOR_CATEGORIES = [
  "Cloud infrastructure (AWS/Azure/GCP/Other)",
  "AI models and APIs (e.g., OpenAI, Anthropic, Gemini)",
  "GPU / AI compute capacity",
  "Data platforms & analytics (e.g., Snowflake, Databricks)",
  "Business software (CRM, HR, finance, productivity)",
  "Cybersecurity",
  "Developer tools",
  "Hardware (servers, devices, networking)",
  "Professional & managed services",
  "Other",
];

const COMMITMENT_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Cloud",
    options: [
      "AWS EDP / Private Pricing Addendum",
      "Azure MACC",
      "Google Cloud commitments",
      "Oracle / Other Cloud commitments",
      "Rate Card / RI / CUD",
    ],
  },
  {
    label: "AI (Anthropic / OpenAI / Gemini / Other)",
    options: ["AI committed spend", "AI reserved capacity (provisioned throughput)", "AI compute capacity"],
  },
  {
    label: "Data",
    options: ["Snowflake capacity commitment", "Databricks commitment", "Other"],
  },
  {
    label: "Software",
    options: ["Microsoft Enterprise Agreement", "Salesforce ELA", "Other multi-year software (e.g., Oracle, SAP)"],
  },
  {
    label: "Hardware (Dell, HP, Lenovo, Cisco, etc.)",
    options: ["Volume purchase agreement", "Multi-year bundle (hardware + software + support)", "Lease or lease-to-own"],
  },
  {
    label: "Other",
    options: ["Other commitment", "Not sure"],
  },
];

const ACTIVE_CONTRACTS = ["1–5", "6–15", "16–30", "31–50", "50+"];
const CONTRACT_LENGTH = ["Month to month", "1 year", "2 years", "3 years", "Above 3 years"];
const RENEWALS_PER_YEAR = ["1–5", "6–10", "11–20", "20+"];
const RENEWAL_ADVANCE_NOTICE = [
  "Under 30 days",
  "30 to under 60 days",
  "60 to under 90 days",
  "90 to under 180 days",
  "More than 180 days",
  "Often miss it (auto renews)",
  "Varies/No set timing",
];
const NEGOTIATION_OWNERS = [
  "Procurement / Sourcing",
  "Finance (CFO, FP&A)",
  "IT / Engineering (CTO, CIO)",
  "Operations (COO, RevOps, BizOps)",
  "Legal / Contracts",
  "CEO / Founder",
  "Outside advisor or consultant",
  "No dedicated owner",
];

const PRICING_CONFIDENCE = ["Very confident", "Somewhat confident", "Not very confident", "We have no benchmark data at all"];
const USED_EXTERNAL_SERVICE = ["Yes, and would again", "Yes, but wouldn't again", "No, but would consider it", "No, not interested"];
const NEGOTIATION_CHALLENGES = [
  "Don't know what market pricing looks like",
  "Hard to size commitments before signing",
  "Paying for committed spend we don't use",
  "Internal approvals are slow",
  "Legal / redline cycles take too long",
  "Contracts auto-renew before we can act",
  "Not enough people or expertise in-house",
  "Too little spend to get leverage",
  "All of the above",
];

/** PDF UX notes: "Required — all questions except B3d (open-ended, optional)."
 * commitmentPlatforms (B1e) is only required when it's actually shown (B1d = Yes). */
export function isStep2Valid(v: Step2State): boolean {
  return Boolean(
    v.annualSpend &&
      v.spendGrowth &&
      v.vendorCategories.length > 0 &&
      v.hasCommitments &&
      (v.hasCommitments !== "Yes" || v.commitmentPlatforms.length > 0) &&
      v.activeContracts &&
      v.contractLength &&
      v.renewalsPerYear &&
      v.renewalAdvanceNotice &&
      v.negotiationOwners.length > 0 &&
      v.pricingConfidence &&
      v.usedExternalService &&
      v.negotiationChallenges.length > 0,
  );
}

const REQUIRED = "This field is required";
const SELECT_REQUIRED = "Please select at least one option";

export function Step2BuyerProfile({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: Step2State;
  onChange: (next: Step2State) => void;
  stepLabel: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof Step2State>(key: K, v: Step2State[K]) =>
    onChange({ ...value, [key]: v });
  const err = (filled: boolean) => (showErrors && !filled ? REQUIRED : undefined);
  const errChips = (filled: boolean) => (showErrors && !filled ? SELECT_REQUIRED : undefined);

  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Technology Spend" stepLabel={stepLabel} />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <SelectField
            label="Annual technology spend (cloud + SaaS + services combined)"
            required
            value={value.annualSpend}
            onChange={(v) => set("annualSpend", v)}
            placeholder="Select"
            options={ANNUAL_SPEND}
            error={err(Boolean(value.annualSpend))}
          />
          <SelectField
            label="Expected annual tech spend growth over the next 3 years (a rough guess is fine)"
            required
            value={value.spendGrowth}
            onChange={(v) => set("spendGrowth", v)}
            placeholder="Select"
            options={SPEND_GROWTH}
            error={err(Boolean(value.spendGrowth))}
          />
          <ChipMultiSelect
            label="Which vendor categories represent your largest spend? (Pick your top 3)"
            required
            maxSelect={3}
            value={value.vendorCategories}
            onChange={(v) => set("vendorCategories", v)}
            options={VENDOR_CATEGORIES}
            error={errChips(value.vendorCategories.length > 0)}
          />
          <PillRadioGroup
            label="Do you have any multi-year committed spend agreements currently active?"
            required
            value={value.hasCommitments}
            onChange={(v) => set("hasCommitments", v)}
            options={["Yes", "No", "Not sure"]}
            error={err(Boolean(value.hasCommitments))}
          />
          {value.hasCommitments === "Yes" ? (
            <div className="flex w-full flex-col items-start gap-5 sm:max-w-[36.4375rem]">
              <p className="text-sm font-medium leading-5 text-ink">If yes — which platforms? *</p>
              {COMMITMENT_GROUPS.map((group) => (
                <ChipMultiSelect
                  key={group.label}
                  label={group.label}
                  labelColor="muted"
                  value={value.commitmentPlatforms}
                  onChange={(v) => set("commitmentPlatforms", v)}
                  options={group.options}
                />
              ))}
              {errChips(value.commitmentPlatforms.length > 0) ? (
                <p className="text-sm leading-5 text-red-600">Please select at least one platform</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Contract & Renewal Management" />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <SelectField
            label="How many active technology vendor contracts does your company manage?"
            required
            value={value.activeContracts}
            onChange={(v) => set("activeContracts", v)}
            placeholder="Select"
            options={ACTIVE_CONTRACTS}
            error={err(Boolean(value.activeContracts))}
          />
          <SelectField
            label="Most common contract length"
            required
            value={value.contractLength}
            onChange={(v) => set("contractLength", v)}
            placeholder="Select"
            options={CONTRACT_LENGTH}
            error={err(Boolean(value.contractLength))}
          />
          <SelectField
            label="How many contracts come up for renewal in a typical year?"
            required
            value={value.renewalsPerYear}
            onChange={(v) => set("renewalsPerYear", v)}
            placeholder="Select"
            options={RENEWALS_PER_YEAR}
            error={err(Boolean(value.renewalsPerYear))}
          />
          <SelectField
            label="How far in advance do you typically begin renewal negotiations?"
            required
            value={value.renewalAdvanceNotice}
            onChange={(v) => set("renewalAdvanceNotice", v)}
            placeholder="Select"
            options={RENEWAL_ADVANCE_NOTICE}
            error={err(Boolean(value.renewalAdvanceNotice))}
          />
          <ChipMultiSelect
            label="Who owns vendor contract negotiations at your company?"
            required
            value={value.negotiationOwners}
            onChange={(v) => set("negotiationOwners", v)}
            options={NEGOTIATION_OWNERS}
            error={errChips(value.negotiationOwners.length > 0)}
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Negotiation Experience" />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <SelectField
            label="How confident is your team in knowing whether your vendor pricing is fair compared with what similar companies pay?"
            required
            value={value.pricingConfidence}
            onChange={(v) => set("pricingConfidence", v)}
            placeholder="Select"
            options={PRICING_CONFIDENCE}
            error={err(Boolean(value.pricingConfidence))}
          />
          <SelectField
            label="Have you ever used an external service or consultant to help negotiate a vendor contract or pricing?"
            required
            value={value.usedExternalService}
            onChange={(v) => set("usedExternalService", v)}
            placeholder="Select"
            options={USED_EXTERNAL_SERVICE}
            error={err(Boolean(value.usedExternalService))}
          />
          <ChipMultiSelect
            label="What are your biggest challenges in technology vendor negotiations today? (Pick maximum of 3)"
            required
            maxSelect={3}
            value={value.negotiationChallenges}
            onChange={(v) => set("negotiationChallenges", v)}
            options={NEGOTIATION_CHALLENGES}
            error={errChips(value.negotiationChallenges.length > 0)}
          />
          <TextareaField
            label="Anything else you'd like us to know about your buyer situation? (optional)"
            hint="Optional (60 words max)· Placeholder: e.g. specific vendors you want benchmarks for, upcoming renewals, key pain points"
            value={value.buyerNotes}
            onChange={(v) => set("buyerNotes", v)}
            placeholder="Add a note"
          />
        </div>
      </div>
    </div>
  );
}
