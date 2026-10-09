"use client";

import { StepSectionHeading, TextField } from "@/components/design-partner/sections/questionnaire/shared";
import { CheckboxBox, CheckboxGroupField, CheckboxGroupWithOther, otherIsEmpty } from "./fields";
import { SelectWithOther } from "./fields";
import {
  BENCHMARK_NOTICE,
  CAPABILITY_OPTIONS,
  CRM_OPTIONS,
  HEARD_OPTIONS,
  OTHER,
  REFERRED,
  REFERRER_MAX_LENGTH,
  TOOLS_OPTIONS,
} from "./options";

/** Step 3 — Platform Fit (Section E) and Consent & Notification (Section F). */

export type Step3State = {
  platformInterests: string[];
  currentTools: string[];
  crm: string;
  crmOther: string;
  heardFrom: string;
  heardFromOther: string;
  referredBy: string;
  consentUpdates: boolean;
  consentDisclaimer: boolean;
  /** Optional, ticked by default; the visitor can opt out. */
  consentBenchmark: boolean;
};

export const INITIAL_STEP3: Step3State = {
  platformInterests: [],
  currentTools: [],
  crm: "",
  crmOther: "",
  heardFrom: "",
  heardFromOther: "",
  referredBy: "",
  consentUpdates: false,
  consentDisclaimer: false,
  consentBenchmark: true,
};

const REQUIRED = "This field is required";
const PICK_ONE = "Select at least one";
const CONSENT_REQUIRED = "This is required to join the waitlist";

export const step3Errors = (v: Step3State) => ({
  platformInterests: v.platformInterests.length ? undefined : PICK_ONE,
  currentTools: !v.currentTools.length ? PICK_ONE : otherIsEmpty(v.currentTools) ? REQUIRED : undefined,
  crm: v.crm ? undefined : REQUIRED,
  crmOther: v.crm !== OTHER || v.crmOther.trim() ? undefined : REQUIRED,
  heardFrom: v.heardFrom ? undefined : REQUIRED,
  heardFromOther: v.heardFrom !== OTHER || v.heardFromOther.trim() ? undefined : REQUIRED,
  consentUpdates: v.consentUpdates ? undefined : CONSENT_REQUIRED,
  consentDisclaimer: v.consentDisclaimer ? undefined : CONSENT_REQUIRED,
});
export const isStep3Valid = (v: Step3State) => Object.values(step3Errors(v)).every((e) => !e);

function ConsentRow({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex min-h-11 items-start gap-3 py-2 text-left text-base leading-6 text-nav"
      >
        <span className="mt-0.5 flex shrink-0 [&>span]:mt-0 [&>span]:h-6 [&>span]:w-6 [&>span]:rounded-md">
          <CheckboxBox checked={checked} />
        </span>
        <span>{children}</span>
      </button>
      {error ? <p className="pl-9 text-sm leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}

export function Step3PlatformFit({
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
  const set = <K extends keyof Step3State>(key: K, v: Step3State[K]) => onChange({ ...value, [key]: v });
  const errors = step3Errors(value);
  const err = (key: keyof ReturnType<typeof step3Errors>) => (showErrors ? errors[key] : undefined);
  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Platform Fit" stepLabel={stepLabel} />
        <CheckboxGroupField
          label="Which aptAIvisor capability excites you most?"
          required
          value={value.platformInterests}
          onChange={(v) => set("platformInterests", v)}
          options={CAPABILITY_OPTIONS}
          error={err("platformInterests")}
          columns={2}
        />
        <CheckboxGroupWithOther
          label="How do you currently manage contracts and vendor data?"
          required
          value={value.currentTools}
          onChange={(v) => set("currentTools", v)}
          options={TOOLS_OPTIONS}
          error={err("currentTools")}
          otherLabel="Other way you manage contracts and vendor data"
          otherPlaceholder="Enter other you currently manage contracts and vendor data..."
          columns={2}
        />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
          <SelectWithOther
            label="Which CRM does your team use?"
            required
            value={value.crm}
            otherValue={value.crmOther}
            onChange={(v) => set("crm", v)}
            onOtherChange={(v) => set("crmOther", v)}
            options={CRM_OPTIONS}
            error={err("crm")}
            otherError={err("crmOther")}
          />
          <SelectWithOther
            label="How did you hear about aptAIvisor?"
            required
            value={value.heardFrom}
            otherValue={value.heardFromOther}
            onChange={(v) => set("heardFrom", v)}
            onOtherChange={(v) => set("heardFromOther", v)}
            options={HEARD_OPTIONS}
            error={err("heardFrom")}
            otherError={err("heardFromOther")}
          />
          {value.heardFrom === REFERRED ? (
            <TextField
              label="If referred — who referred you? (optional)"
              value={value.referredBy}
              onChange={(v) => set("referredBy", v)}
              placeholder="Referred by someone"
              maxLength={REFERRER_MAX_LENGTH}
            />
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <StepSectionHeading title="Consent & Notification" />
        <div className="flex w-full items-start gap-4 rounded-xl border border-[#D0D5DD] p-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#EAECF0] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#344054" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5.83 9.17V5.83a4.17 4.17 0 1 1 8.34 0v3.34m-8.84 0h9.34c.93 0 1.4 0 1.75.18.31.16.57.42.73.73.18.36.18.82.18 1.75v3.34c0 .93 0 1.4-.18 1.75-.16.31-.42.57-.73.73-.36.18-.82.18-1.75.18H5.33c-.93 0-1.4 0-1.75-.18a1.67 1.67 0 0 1-.73-.73c-.18-.36-.18-.82-.18-1.75v-3.34c0-.93 0-1.4.18-1.75.16-.31.42-.57.73-.73.36-.18.82-.18 1.75-.18Z" />
            </svg>
          </span>
          <p className="text-sm font-semibold leading-5 text-[#344054]">{BENCHMARK_NOTICE}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <ConsentRow
            checked={value.consentUpdates}
            onChange={(v) => set("consentUpdates", v)}
            error={err("consentUpdates")}
          >
            I agree to receive product updates and launch notifications from aptAIvisor at the email I provided *
          </ConsentRow>
          <ConsentRow
            checked={value.consentDisclaimer}
            onChange={(v) => set("consentDisclaimer", v)}
            error={err("consentDisclaimer")}
          >
            I understand that aptAIvisor&apos;s outputs are for informational and decision-support purposes only and do
            not constitute legal or financial advice *
          </ConsentRow>
          <ConsentRow checked={value.consentBenchmark} onChange={(v) => set("consentBenchmark", v)}>
            I consent to contribute anonymized deal intelligence to aptAIvisor&apos;s benchmark database (you can opt out
            at any time after launch)
          </ConsentRow>
        </div>
      </div>
    </div>
  );
}

