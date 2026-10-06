"use client";

import {
  ChipMultiSelect,
  SelectField,
  StepSectionHeading,
  TextField,
  TextareaField,
} from "./shared";

/** Step 4 — Platform Preferences. Figma "Design Partner Program New/Step4" (node 3376:2625). */

export type Step4State = {
  excitedModules: string[];
  dealDeskPriorities: string[];
  currentManagement: string[];
  currentManagementOther: string;
  crm: string;
  successDefinition: string;
  heardAbout: string;
  referrerName: string;
};

export const INITIAL_STEP4: Step4State = {
  excitedModules: [],
  dealDeskPriorities: [],
  currentManagement: [],
  currentManagementOther: "",
  crm: "",
  successDefinition: "",
  heardAbout: "",
  referrerName: "",
};

const EXCITED_MODULES = [
  "Contract Chatbot (ask questions, get answers)",
  "Pricing Intelligence & Benchmarks",
  "Contract Builder & Redline",
  "Deal P&L Builder",
  "Approval & E-Signature Workflow",
  "Consulting Services",
  "Not sure yet",
];

const DEAL_DESK_PRIORITIES = [
  "Deal policy, guidelines and best practices",
  "Pricing and discount rules",
  "Strategy & Structuring (TCV, ACV, Commitment length)",
  "Deal approval process design",
  "Contract terms and non-standard requests",
  "Compliance (Legal, Accounting)",
  "Deal modeling and margin analysis (NPV, ROI, FCF)",
  "Organizational design of deal desk function",
  "Training and onboarding sales teams on deal best practices",
  "None right now",
];

const CURRENT_MANAGEMENT = [
  "Spreadsheets",
  "Shared drive (Google Drive, SharePoint)",
  "CRM (Salesforce, HubSpot)",
  "SAP",
  "Quoting tool / CPQ (e.g. Salesforce CPQ, DealHub)",
  "Contract management software / CLM (Ironclad, DocuSign CLM)",
  "Procurement or finance system (e.g. Coupa, NetSuite)",
  "Email",
];

const CRM_OPTIONS = ["Salesforce", "HubSpot", "Pipedrive", "Microsoft Dynamics", "None", "Other"];

const HEARD_ABOUT_OPTIONS = ["LinkedIn", "Referred by someone", "aptAI team outreach", "Event or webinar", "Other"];

/** PDF UX notes: "Required — all questions except D5a (referrer name, optional)."
 * D4 (successDefinition) is explicitly flagged "Required — cannot submit
 * without," reinforcing the blanket rule. referrerName is only required when
 * it's actually shown (D5 = "Referred by someone"). */
export function isStep4Valid(v: Step4State): boolean {
  return Boolean(
    v.excitedModules.length > 0 &&
      v.dealDeskPriorities.length > 0 &&
      v.currentManagement.length > 0 &&
      v.crm &&
      v.successDefinition.trim() &&
      v.heardAbout &&
      (v.heardAbout !== "Referred by someone" || v.referrerName.trim()),
  );
}

const REQUIRED = "This field is required";
const SELECT_REQUIRED = "Please select at least one option";

export function Step4PlatformPreferences({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: Step4State;
  onChange: (next: Step4State) => void;
  stepLabel: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof Step4State>(key: K, v: Step4State[K]) =>
    onChange({ ...value, [key]: v });
  const err = (filled: boolean) => (showErrors && !filled ? REQUIRED : undefined);
  const errChips = (filled: boolean) => (showErrors && !filled ? SELECT_REQUIRED : undefined);

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <StepSectionHeading title="Platform Preferences" stepLabel={stepLabel} />

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <div className="sm:col-span-2">
          <ChipMultiSelect
            label="Which aptAIvisor modules are you most excited to use?"
            required
            value={value.excitedModules}
            onChange={(v) => set("excitedModules", v)}
            options={EXCITED_MODULES}
            error={errChips(value.excitedModules.length > 0)}
          />
        </div>

        <div className="sm:col-span-2">
          <ChipMultiSelect
            label="If you want aptAIvisor to advise or build your deal desk function, what are your key company/business priorities?"
            required
            value={value.dealDeskPriorities}
            onChange={(v) => set("dealDeskPriorities", v)}
            options={DEAL_DESK_PRIORITIES}
            error={errChips(value.dealDeskPriorities.length > 0)}
          />
        </div>

        <div className="flex flex-col items-start gap-5 sm:col-span-2 sm:max-w-[36.4375rem]">
          <ChipMultiSelect
            label="How do you currently manage contracts and vendor data?"
            required
            value={value.currentManagement}
            onChange={(v) => set("currentManagement", v)}
            options={CURRENT_MANAGEMENT}
            error={errChips(value.currentManagement.length > 0)}
          />
          <TextField
            label="Other"
            value={value.currentManagementOther}
            onChange={(v) => set("currentManagementOther", v)}
            placeholder="Enter category name"
          />
        </div>

        <SelectField
          label="Which CRM does your team use?"
          required
          value={value.crm}
          onChange={(v) => set("crm", v)}
          placeholder="Select"
          options={CRM_OPTIONS}
          error={err(Boolean(value.crm))}
        />

        <div className="sm:col-span-2">
          <TextareaField
            label="How would you define success for your design partner experience after 90 days?"
            hint="Required (60 words max) · Placeholder: e.g. benchmark our AWS renewal, or cut redline cycle from 2 weeks to 3 days"
            value={value.successDefinition}
            onChange={(v) => set("successDefinition", v)}
            placeholder="Describe what success looks like"
            error={err(Boolean(value.successDefinition.trim()))}
          />
        </div>

        <SelectField
          label="How did you hear about aptAIvisor?"
          required
          value={value.heardAbout}
          onChange={(v) => set("heardAbout", v)}
          placeholder="Select"
          options={HEARD_ABOUT_OPTIONS}
          error={err(Boolean(value.heardAbout))}
        />

        {value.heardAbout === "Referred by someone" ? (
          <TextField
            label="If referred — who referred you?"
            required
            value={value.referrerName}
            onChange={(v) => set("referrerName", v)}
            placeholder="Enter referrer name"
            error={err(Boolean(value.referrerName.trim()))}
          />
        ) : null}
      </div>
    </div>
  );
}
