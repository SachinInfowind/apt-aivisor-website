"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import {
  ROLE_OPTIONS,
  ROLE_PLACEHOLDER,
  SPEND_OPTIONS,
  SPEND_PLACEHOLDER,
} from "@/components/waitlist/formOptions";
import type { WaitlistFormSectionData } from "@/lib/cms/types";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]";

const labelClass = "text-sm font-medium leading-5 text-ink";

type Interest = "buyer" | "seller" | "both";

const INTEREST_OPTIONS: {
  id: Interest;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: "buyer",
    label: "Buyer",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M1 1H1.65308C1.77609 1 1.8376 1 1.88709 1.02262C1.93071 1.04255 1.96767 1.07461 1.99357 1.11497C2.02297 1.16077 2.03167 1.22166 2.04906 1.34343L2.28571 3M2.28571 3L2.81166 6.8657C2.8784 7.35626 2.91177 7.60154 3.02905 7.78617C3.13239 7.94886 3.28054 8.07822 3.45568 8.15869C3.65443 8.25 3.90197 8.25 4.39705 8.25H8.676C9.14727 8.25 9.38291 8.25 9.57548 8.16521C9.74527 8.09044 9.89092 7.96992 9.99614 7.81711C10.1155 7.64381 10.1596 7.41233 10.2477 6.94938L10.9096 3.47484C10.9406 3.3119 10.9561 3.23043 10.9336 3.16675C10.9139 3.11088 10.875 3.06384 10.8238 3.03401C10.7654 3 10.6825 3 10.5166 3H2.28571ZM5 10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10C4.77614 10 5 10.2239 5 10.5ZM9 10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "seller",
    label: "Seller",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M7.5 10.5V7.8C7.5 7.51997 7.5 7.37996 7.4455 7.273C7.39757 7.17892 7.32108 7.10243 7.227 7.0545C7.12004 7 6.98003 7 6.7 7H5.3C5.01997 7 4.87996 7 4.773 7.0545C4.67892 7.10243 4.60243 7.17892 4.5545 7.273C4.5 7.37996 4.5 7.51997 4.5 7.8V10.5M1.5 3.5C1.5 4.32843 2.17157 5 3 5C3.82843 5 4.5 4.32843 4.5 3.5C4.5 4.32843 5.17157 5 6 5C6.82843 5 7.5 4.32843 7.5 3.5C7.5 4.32843 8.17157 5 9 5C9.82843 5 10.5 4.32843 10.5 3.5M3.1 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "both",
    label: "Buyer + Seller",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M4.5 3.5L2 6L4.5 8.5M7.5 3.5L10 6L7.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/**
 * Waitlist signup form — Figma Frame 206 (26281:29834).
 * “Reserve your spot” card on blue gradient.
 */
export function WaitlistFormSection({
  heading,
  subhead,
  ctaLabel = "Reserve My Spot",
  trustText = "No spam. No credit card. Unsubscribe anytime.",
  termsHref = "/terms",
  privacyHref = "/privacy",
  successHref = "/thank-you",
}: WaitlistFormSectionData) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interest, setInterest] = useState<Interest | "">("");
  const [spend, setSpend] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = useMemo(
    () =>
      Boolean(
        fullName.trim() &&
          email.trim() &&
          company.trim() &&
          role &&
          interest &&
          agreed,
      ),
    [fullName, email, company, role, interest, agreed],
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    router.push(successHref || "/thank-you");
  };

  return (
    <section
      id="waitlist"
      className={`bg-waitlist-section ${layout.sectionX} py-[clamp(3rem,7vw,6.25rem)]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[65rem] justify-center`}
      >
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col overflow-hidden rounded-3xl border border-[rgba(226,232,240,0.9)] bg-white"
          noValidate={false}
        >
          <div className="flex flex-col gap-6 px-5 pb-2 pt-10 sm:px-8 md:px-10 md:pt-10">
            <div className="flex flex-col gap-1">
              <h2
                className={`${homeSerif.className} text-[1.875rem] leading-[2.375rem] tracking-[-0.02em] text-navy`}
              >
                {heading}
              </h2>
              {subhead ? (
                <p className="text-base leading-6 text-ink">{subhead}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-[1.875rem]">
              <div className="grid grid-cols-1 gap-[1.875rem] sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Full name *</span>
                  <input
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Work email *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-[1.875rem] sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Company *</span>
                  <input
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <SelectDropdown
                  name="role"
                  label="Title / Role"
                  placeholder={ROLE_PLACEHOLDER}
                  options={ROLE_OPTIONS}
                  value={role}
                  onChange={setRole}
                  required
                />
              </div>

              <fieldset className="flex flex-col gap-1.5 border-0 p-0">
                <legend className={labelClass}>I am interested as a... *</legend>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                  {INTEREST_OPTIONS.map((opt) => {
                    const selected = interest === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setInterest(opt.id)}
                        className={`inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-lg border text-xs font-semibold leading-[1.125rem] transition-colors ${
                          selected
                            ? "border-brand bg-brand-soft text-brand-deep"
                            : "border-line-muted bg-surface text-ink hover:border-line-strong"
                        }`}
                      >
                        <span
                          className={
                            selected ? "text-brand-deep" : "text-subtle"
                          }
                        >
                          {opt.icon}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  name="interest"
                  value={interest}
                  required
                  readOnly
                  tabIndex={-1}
                  aria-hidden
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />
              </fieldset>

              <SelectDropdown
                name="spend"
                label="Approximate annual technology spend / ARR"
                placeholder={SPEND_PLACEHOLDER}
                options={SPEND_OPTIONS}
                value={spend}
                onChange={setSpend}
              />

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>
                  Anything specific you want aptAIvisor to solve? (optional)
                </span>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="e.g. AWS EDP negotiation, SaaS sprawl, contract redlines..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputClass} min-h-[6.5rem] resize-y`}
                />
              </label>

              <label className="flex items-start gap-3">
                <input
                  name="terms"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border border-line-strong text-brand accent-brand"
                />
                <span className="text-base leading-6 text-nav">
                  I have read and agree to the{" "}
                  <a
                    href={
                      !termsHref || termsHref === "#" ? "/terms" : termsHref
                    }
                    className="text-brand underline-offset-2 hover:underline"
                  >
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href={
                      !privacyHref ||
                      privacyHref === "#" ||
                      privacyHref === "/trust"
                        ? "/privacy"
                        : privacyHref
                    }
                    className="text-brand underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  . I consent to aptAI Group LLC contacting me about aptAIvisor
                  and related updates.
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-[#E2E8F0] px-5 py-8 sm:flex-row sm:items-center sm:px-8 md:px-10 md:py-10">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-pill border px-[1.125rem] text-base font-semibold leading-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-all ${
                canSubmit
                  ? "border-brand bg-brand text-white hover:bg-brand-hover active:scale-[0.98]"
                  : "cursor-not-allowed border-line-muted bg-surface-muted text-faint"
              }`}
            >
              {ctaLabel}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3.33594 10H16.6693M11.6693 15L16.6693 10L11.6693 5"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {trustText ? (
              <p className="text-base font-semibold leading-6 text-brand-deep sm:text-right">
                {trustText}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
