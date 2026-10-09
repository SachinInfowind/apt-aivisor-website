"use client";

import {
  ChipMultiSelect,
  PillRadioGroup,
  SelectField,
  StepSectionHeading,
  TextField,
  TextareaField,
} from "./shared";

/** Step 3 — Seller Profile. Figma "Design Partner Program New/Step3" (node 3376:2418). */

export type Step3State = {
  annualRevenue: string;
  revenueGrowth: string;
  dealSize: string;
  termLength: string;
  salesMotion: string;
  contractTypes: string[];
  /** Shown only when contractTypes includes "Other" (the Hardware subgroup's Other chip). */
  contractTypeOther: string;
  dealDeskFunction: string;
  dealPolicy: string;
  dealDeskHelp: string[];
  nonStandardDealsPerQuarter: string;
  approvalCycleTime: string;
  dealApprovalInvolved: string[];
  contractChangePct: string;
  signTimeAfterApproval: string;
  avgDealCycleTime: string;
  buyerPushbackTerms: string[];
  /** Shown only when buyerPushbackTerms includes "Other". */
  buyerPushbackTermsOther: string;
  lostDealSlowApprovals: string;
  biggestChallengeClosing: string;
  sellerNotes: string;
};

export const INITIAL_STEP3: Step3State = {
  annualRevenue: "",
  revenueGrowth: "",
  dealSize: "",
  termLength: "",
  salesMotion: "",
  contractTypes: [],
  contractTypeOther: "",
  dealDeskFunction: "",
  dealPolicy: "",
  dealDeskHelp: [],
  nonStandardDealsPerQuarter: "",
  approvalCycleTime: "",
  dealApprovalInvolved: [],
  contractChangePct: "",
  signTimeAfterApproval: "",
  avgDealCycleTime: "",
  buyerPushbackTerms: [],
  buyerPushbackTermsOther: "",
  lostDealSlowApprovals: "",
  biggestChallengeClosing: "",
  sellerNotes: "",
};

const ANNUAL_REVENUE = [
  "Under $1M",
  "$1M – $5M",
  "$5M – $10M",
  "$10M – $25M",
  "$25M – $50M",
  "$50M – $100M",
  "$100M – $500M",
  "$500M – $1B",
  "Over $1B",
];

const REVENUE_GROWTH = ["Declining", "0–10%", "10–25%", "25–50%", "50–100%", "Over 100%", "Not sure"];

const DEAL_SIZE = [
  "Under $50K",
  "$50K to under $250K",
  "$250K to under $1M",
  "$1M to under $5M",
  "$5M to under $25M",
  "$25M+",
  "Varies widely",
];

const TERM_LENGTH = ["Month to month", "1 year", "2 years", "3 years", "Above 3 years"];

const SALES_MOTION = [
  "Direct (field sales)",
  "Inside sales",
  "PLG (product-led)",
  "Channel / partner",
  "Technology marketplace (AWS, Azure, Google, other)",
];

const CONTRACT_TYPE_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Select Pricing",
    options: [
      "Public / self-serve pricing",
      "Pay-as-you-go usage / subscription (incl. per-token)",
      "Negotiated discount off list price (rate card, % off MSRP)",
    ],
  },
  {
    label: "Select Commitments",
    options: [
      "Committed spend discount (e.g., AWS EDP, Azure MACC, GCP EDP, Other)",
      "Reserved capacity (e.g., CUD, provisioned throughput, storage)",
      "Program credits (Strategic Collaboration, Migration, Partnership, Partner Bounty, etc.)",
      "Revenue Share",
    ],
  },
  {
    label: "Select Subscriptions",
    options: ["Annual subscription", "Multi-year or company-wide license (ELA)", "Per-user fee plus usage credits"],
  },
  {
    label: "Select Hardware",
    options: ["Bundle (hardware + software + support)", "Volume purchase agreement", "Lease or lease-to-own"],
  },
  {
    /** New in the latest Figma (frame 3423:4966) — not in the original PDF spec's
     * contract-type list. No CMS schema change needed: contractTypes is a loose
     * JSON array (global::chip-list), not an enum, so new options just work. */
    label: "Select Channels and services",
    options: ["Cloud marketplace private offers", "Professional services (SOW)"],
  },
  {
    label: "Other",
    options: ["Other"],
  },
];

const DEAL_DESK_FUNCTION = [
  "Dedicated function",
  "Part-time responsibility of functions like Finance, Sales Ops, or RevOps",
  "Self-serve by Sales",
  "Sales leaders approve deals directly",
  "Outsourced to an external partner",
  "No formal process",
  "Not sure",
];

const DEAL_POLICY = [
  "Yes - Robust official deal policy, guidelines and best practices",
  "Some - Informal process exists, not scalable or well managed",
  "None - We have not invested in this area",
];

const DEAL_DESK_HELP = [
  "Defining deal policy, guidelines and best practices",
  "Pricing and discount rules",
  "Deal approval process design",
  "Contract terms and non-standard requests",
  "Deal modeling and margin analysis",
  "Deal related FP&A (Financial Planning & Analysis)",
  "Organizational design of deal desk function",
  "Training and onboarding sales teams on deal best practices",
  "None right now",
];

const NON_STANDARD_DEALS = ["0–5", "6–15", "16–30", "31–50", "50+"];
const APPROVAL_CYCLE_TIME = ["Same day", "1–3 days", "4–7 days", "1–2 weeks", "More than 2 weeks", "Not sure"];

const DEAL_APPROVAL_INVOLVED = [
  "Sales rep only (no approval needed)",
  "Sales manager",
  "Sales Leadership (VP Sales, CRO)",
  "Deal desk / Pricing",
  "Finance / CFO",
  "Legal",
  "Product / Engineering",
  "CEO / Executive",
];

const CONTRACT_CHANGE_PCT = ["Under 10%", "10 – 25%", "25 – 50%", "50 – 75%", "Over 75%", "Not sure"];
const SIGN_TIME = ["Same day", "1–3 days", "4–7 days", "1–2 weeks", "2–4 weeks", "Over a month", "Not sure"];

const BUYER_PUSHBACK_TERMS = [
  "Payment terms",
  "Discount/Credits",
  "Partner incentives",
  "Minimum Annual Commitment",
  "Minimum Total Commitment",
  "Auto-renewal",
  "Price escalation",
  "Data / privacy",
  "Limitation of liability",
  "Indemnity clause",
  "IP ownership",
  "SLA / uptime",
  "Termination rights",
  "Other",
];

const LOST_DEAL_SLOW_APPROVALS = ["Yes, often", "Yes, sometimes", "Rarely", "Never", "Not sure"];

const BIGGEST_CHALLENGE_CLOSING = [
  "Lack of deal policy, guidelines and best practices",
  "Pricing and discount rules",
  "Deal approval process design",
  "Contract terms and non-standard requests",
  "Deal modeling and margin analysis",
  "No dedicated function",
  "Pricing intelligence / benchmark",
  "Training and onboarding sales teams on deal best practices",
  "None right now",
  "Other",
];

/** PDF UX notes: "Required — all questions except C3g (open-ended, optional)."
 * The PDF's own field table lists the open-ended optional field as C3g
 * ("Anything else... seller situation?"), not C3f (a dropdown) — treated as a
 * typo in the summary doc and corrected here. contractTypeOther is a free-text
 * fallback for "Other" and isn't counted as required on its own. */
export function isStep3Valid(v: Step3State): boolean {
  return Boolean(
    v.annualRevenue &&
      v.revenueGrowth &&
      v.dealSize &&
      v.termLength &&
      v.salesMotion &&
      v.contractTypes.length > 0 &&
      v.dealDeskFunction &&
      v.dealPolicy &&
      v.dealDeskHelp.length > 0 &&
      v.nonStandardDealsPerQuarter &&
      v.approvalCycleTime &&
      v.dealApprovalInvolved.length > 0 &&
      v.contractChangePct &&
      v.signTimeAfterApproval &&
      v.avgDealCycleTime &&
      v.buyerPushbackTerms.length > 0 &&
      v.lostDealSlowApprovals &&
      v.biggestChallengeClosing,
  );
}

const REQUIRED = "This field is required";
const SELECT_REQUIRED = "Please select at least one option";

export function Step3SellerProfile({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: Step3State;
  onChange: (next: Step3State) => void;
  stepLabel: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof Step3State>(key: K, v: Step3State[K]) =>
    onChange({ ...value, [key]: v });
  const err = (filled: boolean) => (showErrors && !filled ? REQUIRED : undefined);
  const errChips = (filled: boolean) => (showErrors && !filled ? SELECT_REQUIRED : undefined);

  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Sales & Deal Profile" stepLabel={stepLabel} />
        <div className="flex w-full flex-col items-start gap-6">
          <SelectField
            label="Your company's Annual revenue (ARR if you sell subscriptions)"
            required
            value={value.annualRevenue}
            onChange={(v) => set("annualRevenue", v)}
            placeholder="Select"
            options={ANNUAL_REVENUE}
            error={err(Boolean(value.annualRevenue))}
          />
          <SelectField
            label="Expected annual revenue growth over the next 3 years (a rough guess is fine)"
            required
            value={value.revenueGrowth}
            onChange={(v) => set("revenueGrowth", v)}
            placeholder="Select"
            options={REVENUE_GROWTH}
            error={err(Boolean(value.revenueGrowth))}
          />
          <SelectField
            label="Typical deal size (average Total Contract Value or TCV)"
            required
            value={value.dealSize}
            onChange={(v) => set("dealSize", v)}
            placeholder="Select"
            options={DEAL_SIZE}
            error={err(Boolean(value.dealSize))}
          />
          <SelectField
            label="Most typical term length"
            required
            value={value.termLength}
            onChange={(v) => set("termLength", v)}
            placeholder="Select"
            options={TERM_LENGTH}
            error={err(Boolean(value.termLength))}
          />
          <SelectField
            label="Primary sales motion"
            required
            value={value.salesMotion}
            onChange={(v) => set("salesMotion", v)}
            placeholder="Select"
            options={SALES_MOTION}
            error={err(Boolean(value.salesMotion))}
          />

          <div className="flex w-full flex-col items-start gap-5">
            <p className="text-sm font-medium leading-5 text-ink">
              What type of contracts do you primarily sell? *
            </p>
            <div className="grid w-full grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
              {CONTRACT_TYPE_GROUPS.map((group) => (
                <ChipMultiSelect
                  key={group.label}
                  label={group.label}
                  labelColor="muted"
                  variant="checkbox"
                  columns={1}
                  value={value.contractTypes}
                  onChange={(v) => set("contractTypes", v)}
                  options={group.options}
                />
              ))}
            </div>
            {errChips(value.contractTypes.length > 0) ? (
              <p className="text-sm leading-5 text-red-600">Please select at least one contract type</p>
            ) : null}
            {value.contractTypes.includes("Other") ? (
              <TextField
                label="Enter Other"
                value={value.contractTypeOther}
                onChange={(v) => set("contractTypeOther", v.slice(0, 15))}
                placeholder="Enter Other"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Deal Desk & Approval Workflow" />
        <div className="flex w-full flex-col items-start gap-6">
          <SelectField
            label="Do you have a dedicated deal desk function?"
            required
            value={value.dealDeskFunction}
            onChange={(v) => set("dealDeskFunction", v)}
            placeholder="Select"
            options={DEAL_DESK_FUNCTION}
            error={err(Boolean(value.dealDeskFunction))}
          />
          <PillRadioGroup
            label="Do you have deal policy or deal best practices guidelines"
            required
            variant="radio"
            value={value.dealPolicy}
            onChange={(v) => set("dealPolicy", v)}
            options={DEAL_POLICY}
            error={err(Boolean(value.dealPolicy))}
          />
          <ChipMultiSelect
            label="Where would you want help? (Select all that apply)"
            required
            variant="checkbox"
            columns={3}
            value={value.dealDeskHelp}
            onChange={(v) => set("dealDeskHelp", v)}
            options={DEAL_DESK_HELP}
            error={errChips(value.dealDeskHelp.length > 0)}
          />
          <SelectField
            label="How many non-standard deals (requiring special approval) do you review per quarter on average?"
            required
            value={value.nonStandardDealsPerQuarter}
            onChange={(v) => set("nonStandardDealsPerQuarter", v)}
            placeholder="Select"
            options={NON_STANDARD_DEALS}
            error={err(Boolean(value.nonStandardDealsPerQuarter))}
          />
          <SelectField
            label="What is your typical approval cycle time for a non-standard deal?"
            required
            value={value.approvalCycleTime}
            onChange={(v) => set("approvalCycleTime", v)}
            placeholder="Select"
            options={APPROVAL_CYCLE_TIME}
            error={err(Boolean(value.approvalCycleTime))}
          />
          <ChipMultiSelect
            label="Who is typically involved in deal approval?"
            required
            variant="checkbox"
            columns={3}
            value={value.dealApprovalInvolved}
            onChange={(v) => set("dealApprovalInvolved", v)}
            options={DEAL_APPROVAL_INVOLVED}
            error={errChips(value.dealApprovalInvolved.length > 0)}
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Contract & Redline Operations" />
        <div className="flex w-full flex-col items-start gap-6">
          <SelectField
            label="What percentage of your deals involves changes to your standard contract?"
            required
            value={value.contractChangePct}
            onChange={(v) => set("contractChangePct", v)}
            placeholder="Select"
            options={CONTRACT_CHANGE_PCT}
            error={err(Boolean(value.contractChangePct))}
          />
          <SelectField
            label="Once a deal is approved internally, how long until the contract is signed?"
            required
            value={value.signTimeAfterApproval}
            onChange={(v) => set("signTimeAfterApproval", v)}
            placeholder="Select"
            options={SIGN_TIME}
            error={err(Boolean(value.signTimeAfterApproval))}
          />
          <SelectField
            label="What is your average deal cycle time (from opportunity creation to fully executed contract)?"
            required
            value={value.avgDealCycleTime}
            onChange={(v) => set("avgDealCycleTime", v)}
            placeholder="Select"
            options={SIGN_TIME}
            error={err(Boolean(value.avgDealCycleTime))}
          />
          <ChipMultiSelect
            label="Which terms do buyers push back on most? (Pick up to 3)"
            required
            maxSelect={3}
            variant="checkbox"
            columns={4}
            value={value.buyerPushbackTerms}
            onChange={(v) => set("buyerPushbackTerms", v)}
            options={BUYER_PUSHBACK_TERMS}
            error={errChips(value.buyerPushbackTerms.length > 0)}
          />
          {value.buyerPushbackTerms.includes("Other") ? (
            <TextField
              label="Enter Other"
              value={value.buyerPushbackTermsOther}
              onChange={(v) => set("buyerPushbackTermsOther", v.slice(0, 15))}
              placeholder="Enter Other"
            />
          ) : null}
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <SelectField
              label="Have you ever lost a deal because internal approvals took too long?"
              required
              value={value.lostDealSlowApprovals}
              onChange={(v) => set("lostDealSlowApprovals", v)}
              placeholder="Select"
              options={LOST_DEAL_SLOW_APPROVALS}
              error={err(Boolean(value.lostDealSlowApprovals))}
            />
            <SelectField
              label="What is your biggest challenge in closing deals faster?"
              required
              value={value.biggestChallengeClosing}
              onChange={(v) => set("biggestChallengeClosing", v)}
              placeholder="Select"
              options={BIGGEST_CHALLENGE_CLOSING}
              error={err(Boolean(value.biggestChallengeClosing))}
            />
          </div>
          <TextareaField
            label="Anything else you'd like us to know about your seller situation?"
            value={value.sellerNotes}
            onChange={(v) => set("sellerNotes", v)}
            placeholder="e.g. deal types you want help with, specific bottlenecks, team size"
            maxWords={60}
          />
        </div>
      </div>
    </div>
  );
}
