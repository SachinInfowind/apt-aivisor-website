"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { homeSerif } from "@/components/ui/fonts";
import { useRecaptcha } from "@/components/ui/Recaptcha";
import { RECAPTCHA_ACTIONS, RECAPTCHA_FIELD } from "@/lib/recaptcha-actions";
import { validateDesignPartnerForm } from "@/lib/validation/designPartnerForm";
import {
  Step1CompanyProfile,
  INITIAL_STEP1,
  isStep1Valid,
  type Step1State,
} from "./questionnaire/Step1CompanyProfile";
import {
  Step2BuyerProfile,
  INITIAL_STEP2,
  isStep2Valid,
  type Step2State,
} from "./questionnaire/Step2BuyerProfile";
import {
  Step3SellerProfile,
  INITIAL_STEP3,
  isStep3Valid,
  type Step3State,
} from "./questionnaire/Step3SellerProfile";
import {
  Step4PlatformPreferences,
  INITIAL_STEP4,
  isStep4Valid,
  type Step4State,
} from "./questionnaire/Step4PlatformPreferences";
import {
  Step5DataConsent,
  INITIAL_STEP5,
  isStep5Valid,
  type Step5State,
} from "./questionnaire/Step5DataConsent";

/**
 * Design Partner Onboarding Questionnaire — Figma "Design Partner Program
 * New/Step1..5". Replaces the old single-step DesignPartnerFormSection.
 *
 * Role-based routing (PDF "A9 master branch"): Buyer skips Step 3 (Seller
 * Profile), Seller skips Step 2 (Buyer Profile), Buyer + Seller sees all 5.
 * Until a role is picked on Step 1, the full 5-step sequence is shown.
 *
 * Save & Resume: scoped to same-device only (no email field exists in the
 * Figma Step 1 design to key a cross-device/DB-backed draft on, per the PDF's
 * "resume via email" note — see conversation). Progress autosaves to
 * localStorage on every change and silently restores on mount.
 */

const DRAFT_STORAGE_KEY = "apt-design-partner-questionnaire-draft-v1";

type QuestionnaireDraft = {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
  step4: Step4State;
  step5: Step5State;
  currentIndex: number;
};

export function DesignPartnerQuestionnaire({
  badgeLabel,
  heading,
  subhead,
}: {
  badgeLabel?: string;
  heading?: string;
  subhead?: string;
}) {
  const [step1, setStep1] = useState<Step1State>(INITIAL_STEP1);
  const [step2, setStep2] = useState<Step2State>(INITIAL_STEP2);
  const [step3, setStep3] = useState<Step3State>(INITIAL_STEP3);
  const [step4, setStep4] = useState<Step4State>(INITIAL_STEP4);
  const [step5, setStep5] = useState<Step5State>(INITIAL_STEP5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRestored, setHasRestored] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { execute: executeRecaptcha } = useRecaptcha();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<QuestionnaireDraft>;
        if (draft.step1) setStep1(draft.step1);
        if (draft.step2) setStep2(draft.step2);
        if (draft.step3) setStep3(draft.step3);
        if (draft.step4) setStep4(draft.step4);
        if (draft.step5) setStep5(draft.step5);
        if (typeof draft.currentIndex === "number") setCurrentIndex(draft.currentIndex);
        setHasSavedDraft(true);
      }
    } catch {
      // Corrupt or inaccessible storage — proceed with a blank form.
    }

    // A CTA link like /design-partner?type=seller#apply (Solutions page
    // "Apply as a buyer/seller partner" buttons) is explicit, just-clicked
    // intent — it always wins and overrides any saved draft's role, so a
    // stale draft from an earlier visit/test can never make this link a
    // no-op.
    const type = new URLSearchParams(window.location.search).get("type")?.toLowerCase();
    if (type === "buyer") setStep1((prev) => ({ ...prev, role: "Buyer" }));
    else if (type === "seller") setStep1((prev) => ({ ...prev, role: "Seller" }));

    setHasRestored(true);
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    try {
      const draft: QuestionnaireDraft = { step1, step2, step3, step4, step5, currentIndex };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — autosave is best-effort.
    }
  }, [hasRestored, step1, step2, step3, step4, step5, currentIndex]);

  const startOver = () => {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setStep1(INITIAL_STEP1);
    setStep2(INITIAL_STEP2);
    setStep3(INITIAL_STEP3);
    setStep4(INITIAL_STEP4);
    setStep5(INITIAL_STEP5);
    setCurrentIndex(0);
    setHasSavedDraft(false);
    setShowErrors(false);
  };

  const onSubmit = async () => {
    setSubmitError(null);

    const payload = {
      ...step1,
      ...step2,
      ...step3,
      ...step4,
      ...step5,
      companyWebsiteHoneypot: "",
    };

    const result = validateDesignPartnerForm(payload);
    if (!result.success) {
      setSubmitStatus("error");
      setSubmitError("Some answers look incomplete — please check each step and try again.");
      return;
    }

    setSubmitStatus("submitting");
    try {
      const res = await fetch("/api/design-partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          [RECAPTCHA_FIELD]: await executeRecaptcha(RECAPTCHA_ACTIONS.designPartner),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setSubmitError(
          body.message ?? "We couldn't submit your application right now — please try again shortly.",
        );
        setSubmitStatus("error");
        return;
      }

      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      setSubmitStatus("ok");
      router.push("/thank-you");
    } catch {
      setSubmitError("We couldn't submit your application right now — please try again shortly.");
      setSubmitStatus("error");
    }
  };

  const sequence = useMemo<number[]>(() => {
    if (step1.role === "Buyer") return [1, 2, 4, 5];
    if (step1.role === "Seller") return [1, 3, 4, 5];
    return [1, 2, 3, 4, 5];
  }, [step1.role]);

  const step = sequence[Math.min(currentIndex, sequence.length - 1)];
  const stepLabel = `Step 0${currentIndex + 1}/0${sequence.length}`;
  const progressPct = Math.round(((currentIndex + 1) / sequence.length) * 100);
  const isLastStep = currentIndex === sequence.length - 1;
  const canGoBack = currentIndex > 0;

  const isCurrentStepValid =
    step === 1
      ? isStep1Valid(step1)
      : step === 2
        ? isStep2Valid(step2)
        : step === 3
          ? isStep3Valid(step3)
          : step === 4
            ? isStep4Valid(step4)
            : isStep5Valid(step5);

  return (
    <section
      id="apply"
      className="w-full bg-linear-to-b from-brand-soft to-brand-light px-4 py-16 sm:px-8 sm:py-20 md:py-section-y"
    >
      <div className="mx-auto flex w-full max-w-container flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-6">
            {badgeLabel ? (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-badge-edge bg-badge-bg py-1 pl-2.5 pr-3">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                  <circle className="fill-badge-dot" cx="4" cy="4" r="3" />
                </svg>
                <span className="text-sm font-medium leading-5 text-badge-text">
                  {badgeLabel}
                </span>
              </div>
            ) : null}
            {heading ? (
              <h2
                className={`${homeSerif.className} text-[clamp(2rem,3.4vw,3rem)] leading-heading tracking-heading text-navy`}
              >
                {heading}
              </h2>
            ) : null}
          </div>
          {subhead ? (
            <p className="text-base font-medium leading-7 text-ink sm:text-xl sm:leading-title-sm">
              {subhead}
            </p>
          ) : null}
        </div>

        <div className="mx-auto w-full max-w-[80rem] overflow-hidden rounded-3xl border border-[#E2E8F0]/90 bg-white">
          <div className="h-1 w-full bg-surface-muted">
            <div
              className="h-full bg-metric transition-[width]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {hasSavedDraft ? (
            <div className="flex w-full items-center justify-between gap-4 border-b border-[#F1F5F9] bg-brand-soft/50 px-6 py-2.5 sm:px-10">
              <span className="text-sm leading-5 text-nav">
                Resumed from where you left off on this device.
              </span>
              <button
                type="button"
                onClick={startOver}
                className="shrink-0 text-sm font-semibold leading-5 text-brand-deep underline-offset-2 hover:underline"
              >
                Start over
              </button>
            </div>
          ) : null}
          <div className="flex flex-col items-start gap-8 px-6 pt-10 pb-10 sm:px-10">
            {step === 1 ? (
              <Step1CompanyProfile
                value={step1}
                onChange={setStep1}
                stepLabel={stepLabel}
                showErrors={showErrors}
              />
            ) : step === 2 ? (
              <Step2BuyerProfile
                value={step2}
                onChange={setStep2}
                stepLabel={stepLabel}
                showErrors={showErrors}
              />
            ) : step === 3 ? (
              <Step3SellerProfile
                value={step3}
                onChange={setStep3}
                stepLabel={stepLabel}
                showErrors={showErrors}
              />
            ) : step === 4 ? (
              <Step4PlatformPreferences
                value={step4}
                onChange={setStep4}
                stepLabel={stepLabel}
                showErrors={showErrors}
              />
            ) : (
              <Step5DataConsent value={step5} onChange={setStep5} stepLabel={stepLabel} />
            )}
          </div>

          {showErrors && !isCurrentStepValid ? (
            <div className="w-full border-t border-[#E2E8F0] bg-red-50 px-6 py-3 sm:px-10">
              <p className="text-sm leading-5 text-red-600">
                Please complete the required fields highlighted above before continuing.
              </p>
            </div>
          ) : null}

          {submitError ? (
            <div className="w-full border-t border-[#E2E8F0] bg-red-50 px-6 py-3 sm:px-10">
              <p className="text-sm leading-5 text-red-600">{submitError}</p>
            </div>
          ) : null}

          <div className="flex w-full items-center justify-between gap-4 border-t border-[#E2E8F0] px-6 py-6 sm:px-10 sm:py-10">
            {canGoBack ? (
              <button
                type="button"
                onClick={() => {
                  setShowErrors(false);
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border border-brand-accent bg-white px-4.5 py-3 text-base font-semibold leading-6 text-brand-deep shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-soft active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M16.6673 10H3.33398M8.33398 5L3.33398 10L8.33398 15"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
            ) : (
              <span />
            )}

            <div className="flex flex-1 items-center justify-end">
              <button
                type="button"
                disabled={submitStatus === "submitting"}
                onClick={() => {
                  if (!isCurrentStepValid) {
                    setShowErrors(true);
                    return;
                  }
                  if (isLastStep) {
                    void onSubmit();
                    return;
                  }
                  setShowErrors(false);
                  setCurrentIndex((i) => Math.min(sequence.length - 1, i + 1));
                }}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border border-brand bg-brand px-4.5 py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLastStep ? (submitStatus === "submitting" ? "Submitting…" : "Submit application") : "Continue"}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M3.33398 10H16.6673M11.6673 15L16.6673 10L11.6673 5"
                    stroke="white"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
