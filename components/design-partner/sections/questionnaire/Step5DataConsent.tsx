"use client";

import { homeSerif } from "@/components/ui/fonts";

/** Step 5 — Data Contribution Consent. Figma "Design Partner Program New/Step5" (node 3376:2699). */

export type Step5State = {
  consentToContribute: boolean;
  agreedToNda: boolean;
  understandsAdvisoryOnly: boolean;
};

export const INITIAL_STEP5: Step5State = {
  consentToContribute: false,
  agreedToNda: false,
  understandsAdvisoryOnly: false,
};

const CONSENT_ITEMS: { key: keyof Step5State; label: string }[] = [
  {
    key: "consentToContribute",
    label: "I consent to contribute anonymized deal intelligence to aptAIvisor's benchmark database",
  },
  { key: "agreedToNda", label: "I have read and agree to the Design Partner NDA terms" },
  {
    key: "understandsAdvisoryOnly",
    label:
      "I understand that aptAIvisor's outputs are for informational and decision-support purposes only and do not constitute legal or financial advice",
  },
];

/** All three consent checkboxes are mandatory per the PDF ("Required to proceed"). */
export function isStep5Valid(v: Step5State): boolean {
  return v.consentToContribute && v.agreedToNda && v.understandsAdvisoryOnly;
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M14.1673 8.33333V6.66667C14.1673 4.36548 12.3018 2.5 10.0007 2.5C7.69946 2.5 5.83398 4.36548 5.83398 6.66667V8.33333M10.0007 12.0833V13.75M7.33398 17.5H12.6673C14.0674 17.5 14.7675 17.5 15.3023 17.2275C15.7727 16.9878 16.1552 16.6054 16.3948 16.135C16.6673 15.6002 16.6673 14.9001 16.6673 13.5V12.3333C16.6673 10.9332 16.6673 10.2331 16.3948 9.69836C16.1552 9.22795 15.7727 8.8455 15.3023 8.60582C14.7675 8.33333 14.0674 8.33333 12.6673 8.33333H7.33398C5.93385 8.33333 5.23379 8.33333 4.69901 8.60582C4.2286 8.8455 3.84615 9.22795 3.60647 9.69836C3.33398 10.2331 3.33398 10.9332 3.33398 12.3333V13.5C3.33398 14.9001 3.33398 15.6002 3.60647 16.135C3.84615 16.6054 4.2286 16.9878 4.69901 17.2275C5.23379 17.5 5.93385 17.5 7.33398 17.5Z"
        stroke="#344054"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 17 17" fill="none" aria-hidden>
      <path
        d="M14.0008 4.2002L6.30078 11.9002L2.80078 8.40019"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Step5DataConsent({
  value,
  onChange,
  stepLabel,
}: {
  value: Step5State;
  onChange: (next: Step5State) => void;
  stepLabel: string;
}) {
  const toggle = (key: keyof Step5State) => onChange({ ...value, [key]: !value[key] });

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <div className="flex w-full items-center justify-between gap-4">
        <h3
          className={`${homeSerif.className} text-[1.5rem] leading-[1.267] text-navy sm:text-[1.875rem] sm:leading-[2.375rem]`}
        >
          Data Contribution Consent
        </h3>
        <span className="shrink-0 text-base font-semibold leading-6 text-navy">{stepLabel}</span>
      </div>

      <div className="flex w-full items-start gap-4 rounded-xl border border-line-strong bg-white p-4 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#EAECF0] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
          <LockIcon />
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm font-semibold leading-5 text-ink">
            Deal intelligence — contributed after NDA is signed
          </p>
          <p className="text-sm leading-5 text-nav">
            aptAIvisor&rsquo;s benchmark intelligence is built from anonymized, aggregated deal
            data contributed by design partners. Your specific data is never shared — only
            statistical patterns across a minimum of 5 contributors are ever surfaced. The
            questions below help us make your benchmark outputs as relevant as possible.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-4">
        {CONSENT_ITEMS.map(({ key, label }) => {
          const checked = value[key];
          return (
            <button
              key={key}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(key)}
              className={`flex w-full items-center gap-4 rounded-lg border-2 bg-white p-4 text-left transition-colors ${
                checked ? "border-brand-accent" : "border-line-strong"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.375rem] border transition-colors ${
                  checked ? "border-brand bg-brand" : "border-line-strong bg-surface"
                }`}
              >
                {checked ? <CheckIcon /> : null}
              </span>
              <span className="text-base leading-6 text-nav">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
