"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rememberThankYou } from "@/lib/thank-you";
import { homeSerif } from "@/components/ui/fonts";
import { useWafFetch } from "@/components/ui/WafProtection";
import { INITIAL_STEP1, Step1AboutYou, isStep1Valid, type Step1State } from "./Step1AboutYou";
import {
  BuyerSnapshot,
  INITIAL_BUYER,
  INITIAL_SELLER,
  SellerSnapshot,
  isBuyerValid,
  isSellerValid,
  type BuyerState,
  type SellerState,
} from "./Step2Snapshot";
import { INITIAL_STEP3, Step3PlatformFit, isStep3Valid, type Step3State } from "./Step3PlatformFit";
import { OTHER } from "./options";

/**
 * Waitlist application form — replaces the old single-step "Reserve your spot" form.
 * Layout from Figma "Waitlist new form"; questions and options from the
 * "aptAIvisor Waitlist Questionnaire V2" document.
 *
 *   Step 1  About You + Company Profile
 *   Step 2  Buyer Snapshot, Seller Snapshot, or both stacked — by the role chosen in step 1
 *   Step 3  Platform Fit + Consent, then submit
 *
 * Nothing is sent to the server until the last step: the answers are kept in this browser
 * (localStorage) as the visitor goes — so a reload picks up where they were — and the whole
 * application is sent once, on "Submit application".
 */

const DRAFT_STORAGE_KEY = "apt-waitlist-application-draft-v1";

type Draft = {
  step1: Step1State;
  buyer: BuyerState;
  seller: SellerState;
  step3: Step3State;
};

type StepId = "about" | "snapshot" | "fit";

/** Figma's bar fills about a quarter, a half, then the whole bar. */
const PROGRESS = [24.5, 52, 100];

const withOther = (choice: string, other: string) => (choice === OTHER ? `${OTHER}: ${other.trim()}` : choice);

export function WaitlistApplication() {
  const [step1, setStep1] = useState<Step1State>(INITIAL_STEP1);
  const [buyer, setBuyer] = useState<BuyerState>(INITIAL_BUYER);
  const [seller, setSeller] = useState<SellerState>(INITIAL_SELLER);
  const [step3, setStep3] = useState<Step3State>(INITIAL_STEP3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRestored, setHasRestored] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const wafFetch = useWafFetch();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const lastDraftJsonRef = useRef<string | null>(null);
  const skipNextScrollRef = useRef(true);

  const applyDraft = (draft: Partial<Draft>) => {
    if (draft.step1) setStep1({ ...INITIAL_STEP1, ...draft.step1 });
    if (draft.buyer) setBuyer({ ...INITIAL_BUYER, ...draft.buyer });
    if (draft.seller) setSeller({ ...INITIAL_SELLER, ...draft.seller });
    if (draft.step3) setStep3({ ...INITIAL_STEP3, ...draft.step3 });
  };

  // Restore an earlier draft (and note that we did). Always opens on step 1. Reading localStorage
  // has to wait for mount (it doesn't exist during server rendering), hence the setState here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<Draft>;
        if (draft.step1) {
          applyDraft(draft);
          setHasSavedDraft(true);
        }
      }
    } catch {
      // Corrupt or inaccessible storage — start blank.
    }
    setHasRestored(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Back from the verification email (?emailVerifyToken=…): re-check the token with the server
  // instead of trusting the URL, then mark the email verified.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("emailVerifyToken");
    if (!verifyToken && !params.get("emailVerifyError")) return;

    const cleanUrl = () => {
      params.delete("emailVerifyToken");
      params.delete("emailVerifyError");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
    };
    if (!verifyToken) {
      cleanUrl();
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/design-partner-application/verify-email/status?token=${encodeURIComponent(verifyToken)}`,
          { cache: "no-store" },
        );
        const body = (await res.json().catch(() => ({}))) as { status?: string; email?: string };
        if (cancelled) return;
        if (res.ok && body.status === "verified" && body.email) {
          setStep1((prev) => ({
            ...prev,
            workEmail: prev.workEmail.trim() ? prev.workEmail : body.email!,
            emailVerification: "verified",
          }));
        }
      } catch {
        // Network blip — the field stays unverified and can be retried.
      } finally {
        if (!cancelled) cleanUrl();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Autosave (skips echoes of what this or another tab already wrote).
  useEffect(() => {
    if (!hasRestored) return;
    try {
      const json = JSON.stringify({ step1, buyer, seller, step3 } satisfies Draft);
      if (json === lastDraftJsonRef.current) return;
      lastDraftJsonRef.current = json;
      window.localStorage.setItem(DRAFT_STORAGE_KEY, json);
    } catch {
      // Best-effort.
    }
  }, [hasRestored, step1, buyer, seller, step3]);

  // A tab opened from the verification email updates this one too.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== DRAFT_STORAGE_KEY || !event.newValue || event.newValue === lastDraftJsonRef.current) return;
      lastDraftJsonRef.current = event.newValue;
      try {
        applyDraft(JSON.parse(event.newValue) as Partial<Draft>);
      } catch {
        // Ignore a malformed write.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Always three steps. The role only decides what step 2 shows: the Buyer Snapshot, the Seller
  // Snapshot, or both stacked ("Both Buyer & Seller").
  const sequence: StepId[] = ["about", "snapshot", "fit"];
  const showBuyer = step1.dealRole !== "Technology Seller";
  const showSeller = step1.dealRole !== "Technology Buyer";
  const safeIndex = Math.min(currentIndex, sequence.length - 1);
  const step = sequence[safeIndex];
  const totalSteps = sequence.length;
  const stepLabel = `Step 0${safeIndex + 1}/0${totalSteps}`;
  const progressPct = PROGRESS[safeIndex];
  const isLastStep = safeIndex === totalSteps - 1;

  // Bring the card back into view when the step changes (not on first load).
  useEffect(() => {
    if (!hasRestored) return;
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex, hasRestored]);

  const isCurrentStepValid =
    step === "about"
      ? isStep1Valid(step1)
      : step === "snapshot"
        ? (!showBuyer || isBuyerValid(buyer)) && (!showSeller || isSellerValid(seller))
        : isStep3Valid(step3);

  const startOver = () => {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setStep1(INITIAL_STEP1);
    setBuyer(INITIAL_BUYER);
    setSeller(INITIAL_SELLER);
    setStep3(INITIAL_STEP3);
    setSaveError(null);
    setCurrentIndex(0);
    setHasSavedDraft(false);
    setShowErrors(false);
  };

  /** Sends the finished application (all three steps) to the CMS. Only called from the last step. */
  const submitApplication = async () => {
    const data1 = {
      firstName: step1.firstName,
      lastName: step1.lastName,
      email: step1.workEmail,
      jobFunction: withOther(step1.jobFunction, step1.jobFunctionOther),
      jobTitle: step1.jobTitle,
      companyName: step1.companyName,
      dealRole: step1.dealRole,
      industry: withOther(step1.industry, step1.industryOther),
      employees: step1.employees,
      revenue: step1.revenue,
      ownership: withOther(step1.ownership, step1.ownershipOther),
      revenueGrowth: step1.revenueGrowth,
      dealApprover: step1.dealApprover,
      dealPolicy: step1.dealPolicy,
      helpWanted: step1.helpWanted,
      mattersMost: step1.mattersMost,
    };
    const data3 = {
      platformInterests: step3.platformInterests,
      currentTools: step3.currentTools,
      crm: withOther(step3.crm, step3.crmOther),
      heardFrom: withOther(step3.heardFrom, step3.heardFromOther),
      referredBy: step3.referredBy,
      consentUpdates: step3.consentUpdates,
      consentDisclaimer: step3.consentDisclaimer,
      consentBenchmark: step3.consentBenchmark,
    };

    setSaving(true);
    setSaveError(null);
    let redirecting = false;
    try {
      const res = await wafFetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: data1,
          // Only the snapshot(s) for the chosen role are sent.
          step2: { ...(showBuyer ? { buyer } : {}), ...(showSeller ? { seller } : {}) },
          step3: data3,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string; firstName?: string; email?: string };
      if (!res.ok) {
        setSaveError(body.message ?? "We couldn't submit your application right now — please try again shortly.");
        return;
      }
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      rememberThankYou({
        name: body.firstName ?? step1.firstName,
        role: step1.dealRole === "Technology Buyer" ? "Buyer" : step1.dealRole === "Technology Seller" ? "Seller" : "Both",
      });
      // Stay disabled while the page changes, so a second click can't submit twice.
      redirecting = true;
      router.push("/thank-you");
      return;
    } catch {
      setSaveError("We couldn't submit your application right now — please try again shortly.");
    } finally {
      if (!redirecting) setSaving(false);
    }
  };

  const onContinue = async () => {
    if (!isCurrentStepValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (isLastStep) {
      await submitApplication();
      return;
    }
    // Earlier steps only move on: the answers stay in the browser until the final submit.
    setCurrentIndex(safeIndex + 1);
  };

  return (
    <section
      id="application"
      className="w-full scroll-mt-24 bg-[linear-gradient(180deg,#B5CFFF_0%,#1C6BFF_100%)] px-4 py-16 sm:px-8 sm:py-20 lg:py-[6.25rem]"
    >
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <h2
            className={`${homeSerif.className} text-[clamp(2rem,3.4vw,3rem)] leading-[1.25] tracking-[-0.02em] text-[#182230]`}
          >
            aptAIvisor Waitinglist <span className="italic text-[#4F8DFF]">Application Form</span>
          </h2>
          <div className="flex shrink-0 flex-col items-start sm:items-end">
            <span className="text-base font-semibold leading-6 text-[#667085]">Estimated completion time</span>
            <span className="text-xl font-semibold leading-[1.875rem] text-[#182230]">15 minutes</span>
          </div>
        </div>

        <div ref={cardRef} className="w-full scroll-mt-24 overflow-hidden rounded-2xl bg-white">
          <div className="h-[5px] w-full bg-white">
            <div
              className="h-full rounded-full bg-[#17B26A] transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {hasSavedDraft ? (
            <div className="flex w-full items-center justify-between gap-4 border-b border-[#F1F5F9] bg-brand-soft/50 px-6 py-2.5 sm:px-10">
              <span className="text-sm leading-5 text-nav">Your earlier answers on this device were restored.</span>
              <button
                type="button"
                onClick={startOver}
                className="shrink-0 text-sm font-semibold leading-5 text-brand-deep underline-offset-2 hover:underline"
              >
                Start over
              </button>
            </div>
          ) : null}

          <div className="flex flex-col items-start gap-8 px-6 pb-10 pt-10 sm:px-10">
            {step === "about" ? (
              <Step1AboutYou value={step1} onChange={setStep1} stepLabel={stepLabel} showErrors={showErrors} />
            ) : step === "snapshot" ? (
              <>
                {showBuyer ? (
                  <BuyerSnapshot value={buyer} onChange={setBuyer} stepLabel={stepLabel} showErrors={showErrors} />
                ) : null}
                {showSeller ? (
                  <SellerSnapshot
                    value={seller}
                    onChange={setSeller}
                    // When the Buyer Snapshot is above it, only that one carries the "Step 02/03" label.
                    stepLabel={showBuyer ? undefined : stepLabel}
                    showErrors={showErrors}
                  />
                ) : null}
              </>
            ) : (
              <Step3PlatformFit value={step3} onChange={setStep3} stepLabel={stepLabel} showErrors={showErrors} />
            )}
          </div>

          {showErrors && !isCurrentStepValid ? (
            <div className="w-full border-t border-[#E2E8F0] bg-red-50 px-6 py-3 sm:px-10">
              <p className="text-sm leading-5 text-red-600">
                Please complete the required fields highlighted above before continuing.
              </p>
            </div>
          ) : null}
          {saveError ? (
            <div className="w-full border-t border-[#E2E8F0] bg-red-50 px-6 py-3 sm:px-10">
              <p className="text-sm leading-5 text-red-600">{saveError}</p>
            </div>
          ) : null}

          <div className="flex w-full flex-col-reverse items-stretch justify-between gap-3 border-t border-[#E2E8F0] px-6 py-6 sm:flex-row sm:items-center sm:px-10 sm:py-10">
            {safeIndex > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setShowErrors(false);
                  setSaveError(null);
                  setCurrentIndex(Math.max(0, safeIndex - 1));
                }}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-pill border border-brand-accent bg-white px-4.5 py-3 text-base font-semibold leading-6 text-brand-deep shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-soft active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M16.6673 10H3.33398M8.33398 5L3.33398 10L8.33398 15" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              disabled={saving}
              onClick={onContinue}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-pill border border-brand bg-brand px-4.5 py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Submitting…" : isLastStep ? "Submit application" : "Continue"}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3.33398 10H16.6673M11.6673 15L16.6673 10L11.6673 5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
