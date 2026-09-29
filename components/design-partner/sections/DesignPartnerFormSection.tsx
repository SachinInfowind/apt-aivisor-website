"use client";

import { FormEvent, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import { SelectDropdown, type SelectOption } from "@/components/ui/SelectDropdown";
import { TagInput } from "@/components/ui/TagInput";
import { CATEGORY_DETAIL_FIELD } from "@/components/design-partner/formOptions";
import {
  validateDesignPartnerForm,
  validateStep,
  type DesignPartnerFormErrors,
} from "@/lib/validation/designPartnerForm";
import type { DesignPartnerFormSectionData, FormFieldCopy } from "@/lib/cms/types";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-field outline-none placeholder:text-subtle transition-shadow focus:border-brand-accent focus:shadow-field-focus";
const labelClass = "text-sm font-medium leading-5 text-ink";
const errorClass = "text-sm leading-5 text-danger";
const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-brand bg-brand px-4.5 py-3 text-base font-semibold leading-6 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-accent bg-white px-4.5 py-3 text-base font-semibold leading-6 text-brand-deep shadow-field transition-colors hover:bg-brand-soft active:scale-98";

type Interest = "buyer" | "seller" | "both";
type ArrayField =
  | "techVendors"
  | "aiAppVendorsOther"
  | "cloudVendorsOther"
  | "techCategories"
  | "storageDetail"
  | "dataAnalyticsDetail"
  | "computeDetail"
  | "networkingDetail"
  | "aiServicesDetail"
  | "managedServicesCloudDetail"
  | "peripheralsDetail"
  | "managedServicesDetail";

type FormState = {
  fullName: string;
  workEmail: string;
  title: string;
  participatingAs: Interest | "";
  companyName: string;
  companyWebsite: string;
  annualRevenue: string;
  companySize: string;
  companyStatus: string;
  primaryIndustry: string;
  projectedGrowth: string;

  techVendors: string[];
  aiAppVendorsOther: string[];
  cloudVendorsOther: string[];
  techCategories: string[];
  storageDetail: string[];
  dataAnalyticsDetail: string[];
  computeDetail: string[];
  networkingDetail: string[];
  aiServicesDetail: string[];
  managedServicesCloudDetail: string[];
  peripheralsDetail: string[];
  managedServicesDetail: string[];
  bundledDetail: string;

  avgDiscount: string;
  dealStructure: string;
  commitmentSize: string;
  customDealConsiderations: string;
  agreedToTerms: boolean;
  consentToContact: boolean;
  /** UI-only acknowledgement — not part of the submission schema, never sent. */
  acknowledgedNda: boolean;
  companyWebsiteHoneypot: string;
};

const initialState: FormState = {
  fullName: "",
  workEmail: "",
  title: "",
  participatingAs: "",
  companyName: "",
  companyWebsite: "",
  annualRevenue: "",
  companySize: "",
  companyStatus: "",
  primaryIndustry: "",
  projectedGrowth: "",
  techVendors: [],
  aiAppVendorsOther: [],
  cloudVendorsOther: [],
  techCategories: [],
  storageDetail: [],
  dataAnalyticsDetail: [],
  computeDetail: [],
  networkingDetail: [],
  aiServicesDetail: [],
  managedServicesCloudDetail: [],
  peripheralsDetail: [],
  managedServicesDetail: [],
  bundledDetail: "",
  avgDiscount: "",
  dealStructure: "",
  commitmentSize: "",
  customDealConsiderations: "",
  agreedToTerms: false,
  consentToContact: false,
  acknowledgedNda: false,
  companyWebsiteHoneypot: "",
};

const PARTICIPATING_OPTIONS: { id: Interest; icon: string }[] = [
  {
    id: "buyer",
    icon: "M1 1H1.65308C1.77609 1 1.8376 1 1.88709 1.02262C1.93071 1.04255 1.96767 1.07461 1.99357 1.11497C2.02297 1.16077 2.03167 1.22166 2.04906 1.34343L2.28571 3M2.28571 3L2.81166 6.8657C2.8784 7.35626 2.91177 7.60154 3.02905 7.78617C3.13239 7.94886 3.28054 8.07822 3.45568 8.15869C3.65443 8.25 3.90197 8.25 4.39705 8.25H8.676C9.14727 8.25 9.38291 8.25 9.57548 8.16521C9.74527 8.09044 9.89092 7.96992 9.99614 7.81711C10.1155 7.64381 10.1596 7.41233 10.2477 6.94938L10.9096 3.47484C10.9406 3.3119 10.9561 3.23043 10.9336 3.16675C10.9139 3.11088 10.875 3.06384 10.8238 3.03401C10.7654 3 10.6825 3 10.5166 3H2.28571ZM5 10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10C4.77614 10 5 10.2239 5 10.5ZM9 10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z",
  },
  {
    id: "seller",
    icon: "M7.5 10.5V7.8C7.5 7.51997 7.5 7.37996 7.4455 7.273C7.39757 7.17892 7.32108 7.10243 7.227 7.0545C7.12004 7 6.98003 7 6.7 7H5.3C5.01997 7 4.87996 7 4.773 7.0545C4.67892 7.10243 4.60243 7.17892 4.5545 7.273C4.5 7.37996 4.5 7.51997 4.5 7.8V10.5M1.5 3.5C1.5 4.32843 2.17157 5 3 5C3.82843 5 4.5 4.32843 4.5 3.5C4.5 4.32843 5.17157 5 6 5C6.82843 5 7.5 4.32843 7.5 3.5C7.5 4.32843 8.17157 5 9 5C9.82843 5 10.5 4.32843 10.5 3.5M3.1 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5Z",
  },
  {
    id: "both",
    icon: "M4.5 3.5L2 6L4.5 8.5M7.5 3.5L10 6L7.5 8.5",
  },
];

function CheckMark({ size, stroke = 2 }: { size: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.5l2.2 2.2L9.5 3.5"
        stroke="white"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={
          direction === "right"
            ? "M3.33301 10H16.6663M11.6663 15L16.6663 10L11.6663 5"
            : "M16.6663 10H3.33301M8.33301 15L3.33301 10L8.33301 5"
        }
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepTab({
  n,
  label,
  prefix,
  reached,
  onClick,
}: {
  n: number;
  label: string;
  prefix: string;
  reached: boolean;
  onClick?: () => void;
}) {
  const body = (
    <>
      {reached ? (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="shrink-0">
          <circle className="fill-success-strong" cx="14" cy="14" r="14" />
          <path
            d="M8.75 14L12.25 17.5L19.25 10.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-slate text-xs font-bold leading-4 text-subtle">
          {n}
        </span>
      )}
      <span className="flex flex-col gap-0.5 text-left">
        <span
          className={`text-xs leading-cap ${
            reached ? "text-metric" : "text-faint"
          }`}
        >
          {prefix} {String(n).padStart(2, "0")}
        </span>
        <span
          className={`text-sm font-semibold leading-5 ${
            reached ? "text-ink" : "text-subtle"
          }`}
        >
          {label}
        </span>
      </span>
    </>
  );

  const cls = `flex h-[5.3125rem] w-full items-center gap-3 rounded-xl border bg-white py-2.5 pl-5 pr-2.5 sm:flex-1 ${
    reached ? "border-brand-accent" : "border-line-strong"
  }`;

  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} cursor-pointer`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function StepHeader({
  step,
  labels,
  prefix,
  onGoTo,
}: {
  step: 1 | 2 | 3;
  labels: [string, string, string];
  prefix: string;
  onGoTo: (n: 1 | 2 | 3) => void;
}) {
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-4 bg-brand-accent px-4 py-6 sm:flex-row sm:px-10 sm:py-7.5">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        return (
          <StepTab
            key={n}
            n={n}
            label={label}
            prefix={prefix}
            reached={n <= step}
            // Only earlier steps are clickable; moving forward goes through
            // the Continue button so each step's validation still runs.
            onClick={n < step ? () => onGoTo(n) : undefined}
          />
        );
      })}
    </div>
  );
}

function FormHeading({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col border-b border-line-faint pb-4 ${className}`}
    >
      <h3
        className={`${homeSerif.className} text-2xl leading-8 text-navy sm:text-title sm:leading-title`}
      >
        {title}
      </h3>
      {subtitle ? (
        <p className="text-base leading-6 text-ink">{subtitle}</p>
      ) : null}
    </div>
  );
}

function ChipGrid({
  options,
  value,
  onToggle,
  icons,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onToggle: (v: string) => void;
  /** option value -> icon URL (from Strapi `optionIcons`) */
  icons: Record<string, string>;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-[1.1875rem] sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={checked}
            className={`flex min-h-14 items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
              checked
                ? "border-brand-accent bg-brand-soft"
                : "border-line-strong bg-white hover:border-brand-accent/60"
            }`}
          >
            {icons[opt.value] ? (
              <Image
                src={icons[opt.value]}
                alt=""
                width={24}
                height={24}
                unoptimized
                className="h-6 w-6 shrink-0 object-contain"
              />
            ) : (
              <span aria-hidden className="h-6 w-6 shrink-0" />
            )}
            <span className="min-w-0 flex-1 text-sm font-medium leading-5 text-ink">
              {opt.label}
            </span>
            <span
              aria-hidden
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                checked
                  ? "bg-brand shadow-ring-accent"
                  : "border border-line-strong bg-surface"
              }`}
            >
              {checked ? <CheckMark size={12} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Terms / consent row (Figma "Frame/True/md/Icon simple"). */
function TermsRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-[1.0625rem] rounded-lg border-2 border-line-strong bg-white p-4 transition-colors has-[:checked]:border-brand-accent">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:shadow-ring-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
      >
        <CheckMark size={17} />
      </span>
      <span className="text-base leading-6 text-nav">{children}</span>
    </label>
  );
}

/**
 * "Apply to the Design Partner Program" — 3-step application wizard.
 * Figma "Frame 257" (step 1) + "Design Partner Program" (steps 2 and 3).
 */
export function DesignPartnerFormSection({
  badgeLabel,
  heading,
  subhead,
  options,
  fields,
  ...copy
}: DesignPartnerFormSectionData) {
  // Everything below comes from Strapi: option lists (grouped by field name),
  // chip logos, and per-field label / placeholder / hint.
  const optionsFor = (group: string): SelectOption[] =>
    (options ?? [])
      .filter((o) => o.group === group)
      .map((o) => ({ value: o.key, label: o.label }));
  const chipIcons = Object.fromEntries(
    (options ?? []).flatMap((o) =>
      o.icon?.url ? [[o.key, toAbsoluteMediaUrl(o.icon.url)]] : [],
    ),
  );
  const fieldCopy = Object.fromEntries((fields ?? []).map((f) => [f.key, f]));
  const F = (key: string): FormFieldCopy => fieldCopy[key] ?? { key };
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<DesignPartnerFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleArrayItem = (field: ArrayField, item: string) => {
    setValues((prev) => {
      const current = prev[field];
      const next = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
      return { ...prev, [field]: next };
    });
  };

  const goToStep2 = () => {
    const result = validateStep(1, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const goToStep3 = () => {
    // Step 2 has no required fields, but run it anyway for consistency.
    const result = validateStep(2, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStep(3);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const result = validateDesignPartnerForm(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/design-partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          errors?: DesignPartnerFormErrors;
        };
        if (payload.errors) setErrors(payload.errors);
        setServerError(
          payload.message ??
            "We couldn't submit your application right now — please try again shortly.",
        );
        setStatus("error");
        return;
      }

      setStatus("ok");
    } catch {
      setServerError(
        "We couldn't submit your application right now — please try again shortly.",
      );
      setStatus("error");
    }
  };

  const sectionClass = `w-full bg-linear-to-b from-brand-soft to-brand-light py-16 sm:py-20 md:py-section-y ${layout.sectionX}`;

  if (status === "ok") {
    return (
      <section id="apply" className={sectionClass}>
        <div className={`${layout.inner} mx-auto flex w-full max-w-[40rem] flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center`}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
              <path className="stroke-success"
                d="M6 14.5l5 5L22 8"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {copy.successTitle ? (
            <h2 className={`${homeSerif.className} text-2xl text-navy`}>
              {copy.successTitle}
            </h2>
          ) : null}
          {copy.successBody ? (
            <p className="text-base leading-7 text-ink">{copy.successBody}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className={sectionClass}>
      <div className={`${layout.inner} mx-auto flex w-full max-w-container flex-col gap-10`}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-6">
            {badgeLabel ? (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-info-edge bg-info-bg py-1 pl-2.5 pr-3">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                  <circle className="fill-info" cx="4" cy="4" r="3" />
                </svg>
                <span className="text-sm font-medium leading-5 text-info-fg">
                  {badgeLabel}
                </span>
              </div>
            ) : null}
            <h2
              className={`${homeSerif.className} text-[clamp(2rem,3.4vw,3rem)] leading-heading tracking-heading text-navy`}
            >
              {heading}
            </h2>
          </div>
          {subhead ? (
            <p className="text-base font-medium leading-7 text-ink sm:text-xl sm:leading-title-sm">
              {subhead}
            </p>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-line-frost bg-white"
        >
          <StepHeader
            step={step}
            labels={[copy.step1Label ?? "", copy.step2Label ?? "", copy.step3Label ?? ""]}
            prefix={copy.stepPrefix ?? ""}
            onGoTo={(n) => {
              setErrors({});
              setStep(n);
            }}
          />

          {step === 2 ? (
            <div className="px-5 pt-6 sm:px-10">
              <div className="flex items-start gap-4 rounded-xl border border-line-strong bg-white p-4 shadow-field">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line-muted shadow-field">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path className="stroke-ink"
                      d="M15 8.33333V6.66667C15 3.90524 12.7614 1.66667 10 1.66667C7.23858 1.66667 5 3.90524 5 6.66667V8.33333M10 12.0833V13.75M7.16667 18.3333H12.8333C14.2335 18.3333 14.9335 18.3333 15.4683 18.0608C15.9387 17.8212 16.3212 17.4387 16.5608 16.9683C16.8333 16.4335 16.8333 15.7335 16.8333 14.3333V12.6667C16.8333 11.2665 16.8333 10.5665 16.5608 10.0317C16.3212 9.56129 15.9387 9.17884 15.4683 8.93251C14.9335 8.66667 14.2335 8.66667 12.8333 8.66667H7.16667C5.76654 8.66667 5.06647 8.66667 4.53169 8.93251C4.06129 9.17884 3.67883 9.56129 3.43251 10.0317C3.16667 10.5665 3.16667 11.2665 3.16667 12.6667V14.3333C3.16667 15.7335 3.16667 16.4335 3.43251 16.9683C3.67883 17.4387 4.06129 17.8212 4.53169 18.0608C5.06647 18.3333 5.76654 18.3333 7.16667 18.3333Z"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  {copy.noticeTitle ? (
                    <p className="text-sm font-semibold leading-5 text-ink">
                      {copy.noticeTitle}
                    </p>
                  ) : null}
                  {copy.noticeBody ? (
                    <p className="text-sm leading-5 text-nav">{copy.noticeBody}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-6 px-5 py-8 sm:px-10 sm:py-10">
            {step === 1 ? (
              <>
                <FormHeading
                  title={copy.personalTitle ?? ""}
                  subtitle={copy.personalSubtitle ?? undefined}
                />
                <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{F("fullName").label} *</span>
                    <input
                      value={values.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder={F("fullName").placeholder ?? undefined}
                      className={inputClass}
                    />
                    {errors.fullName ? <span className={errorClass}>{errors.fullName}</span> : null}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{F("workEmail").label} *</span>
                    <input
                      type="email"
                      value={values.workEmail}
                      onChange={(e) => setField("workEmail", e.target.value)}
                      placeholder={F("workEmail").placeholder ?? undefined}
                      className={inputClass}
                    />
                    {errors.workEmail ? <span className={errorClass}>{errors.workEmail}</span> : null}
                  </label>
                  <SelectDropdown
                    name="title"
                    label={F("title").label ?? ""}
                    placeholder={F("title").placeholder ?? undefined}
                    options={optionsFor("title")}
                    value={values.title}
                    onChange={(v) => setField("title", v)}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className={labelClass}>{F("participatingAs").label} *</span>
                    <div className="flex gap-2">
                      {PARTICIPATING_OPTIONS.map((opt) => {
                        const selected = values.participatingAs === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setField("participatingAs", opt.id)}
                            aria-pressed={selected}
                            className={`flex h-11 flex-1 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-semibold leading-cap text-ink transition-colors ${
                              selected
                                ? "border-brand-accent bg-brand-soft"
                                : "border-line-muted bg-surface hover:border-brand-accent/60"
                            }`}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
                              <path className="stroke-subtle"
                                d={opt.icon}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {optionsFor("participatingAs").find((o) => o.value === opt.id)?.label ?? opt.id}
                          </button>
                        );
                      })}
                    </div>
                    {errors.participatingAs ? (
                      <span className={errorClass}>{errors.participatingAs}</span>
                    ) : null}
                  </div>
                </div>

                <FormHeading
                  className="pt-4"
                  title={copy.companyTitle ?? ""}
                  subtitle={copy.companySubtitle ?? undefined}
                />
                <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{F("companyName").label} *</span>
                    <input
                      value={values.companyName}
                      onChange={(e) => setField("companyName", e.target.value)}
                      placeholder={F("companyName").placeholder ?? undefined}
                      className={inputClass}
                    />
                    {errors.companyName ? <span className={errorClass}>{errors.companyName}</span> : null}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{F("companyWebsite").label}</span>
                    <div className="flex overflow-hidden rounded-lg border border-line-strong bg-white shadow-field focus-within:border-brand-accent focus-within:shadow-field-focus">
                      <span className="inline-flex items-center border-r border-line-strong py-2.5 pl-3.5 pr-3 text-base leading-6 text-nav">
                        {F("companyWebsite").prefix}
                      </span>
                      <input
                        value={values.companyWebsite}
                        onChange={(e) => setField("companyWebsite", e.target.value)}
                        placeholder={F("companyWebsite").placeholder ?? undefined}
                        className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-base leading-6 text-heading outline-none placeholder:text-subtle"
                      />
                    </div>
                  </label>
                  <SelectDropdown
                    name="annualRevenue"
                    label={F("annualRevenue").label ?? ""}
                    placeholder={F("annualRevenue").placeholder ?? undefined}
                    options={optionsFor("annualRevenue")}
                    value={values.annualRevenue}
                    onChange={(v) => setField("annualRevenue", v)}
                    required
                  />
                  <SelectDropdown
                    name="companySize"
                    label={F("companySize").label ?? ""}
                    placeholder={F("companySize").placeholder ?? undefined}
                    options={optionsFor("companySize")}
                    value={values.companySize}
                    onChange={(v) => setField("companySize", v)}
                  />
                  <SelectDropdown
                    name="companyStatus"
                    label={F("companyStatus").label ?? ""}
                    placeholder={F("companyStatus").placeholder ?? undefined}
                    options={optionsFor("companyStatus")}
                    value={values.companyStatus}
                    onChange={(v) => setField("companyStatus", v)}
                    required
                  />
                  <SelectDropdown
                    name="primaryIndustry"
                    label={F("primaryIndustry").label ?? ""}
                    placeholder={F("primaryIndustry").placeholder ?? undefined}
                    options={optionsFor("primaryIndustry")}
                    value={values.primaryIndustry}
                    onChange={(v) => setField("primaryIndustry", v)}
                    required
                  />
                  <SelectDropdown
                    name="projectedGrowth"
                    label={F("projectedGrowth").label ?? ""}
                    placeholder={F("projectedGrowth").placeholder ?? undefined}
                    options={optionsFor("projectedGrowth")}
                    value={values.projectedGrowth}
                    onChange={(v) => setField("projectedGrowth", v)}
                    className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]"
                  />
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <FormHeading
                  title={copy.vendorsTitle ?? ""}
                  subtitle={copy.vendorsSubtitle ?? undefined}
                />
                <ChipGrid
                  icons={chipIcons}
                  options={optionsFor("techVendors")}
                  value={values.techVendors}
                  onToggle={(v) => toggleArrayItem("techVendors", v)}
                />
                {values.techVendors.includes("other-ai-app-vendor") ? (
                  <div className="flex flex-col gap-1.5 rounded-2xl bg-brand-soft p-4">
                    <span className={labelClass}>{F("aiAppVendorsOther").label}</span>
                    <TagInput
                      value={values.aiAppVendorsOther}
                      onChange={(v) => setField("aiAppVendorsOther", v)}
                      placeholder={F("aiAppVendorsOther").placeholder ?? undefined}
                      hint={F("aiAppVendorsOther").hint ?? undefined}
                    />
                  </div>
                ) : null}
                {values.techVendors.includes("other-cloud-vendor") ? (
                  <div className="flex flex-col gap-1.5 rounded-2xl bg-brand-soft p-4">
                    <span className={labelClass}>{F("cloudVendorsOther").label}</span>
                    <TagInput
                      value={values.cloudVendorsOther}
                      onChange={(v) => setField("cloudVendorsOther", v)}
                      placeholder={F("cloudVendorsOther").placeholder ?? undefined}
                      hint={F("cloudVendorsOther").hint ?? undefined}
                    />
                  </div>
                ) : null}

                <FormHeading
                  className="pt-4"
                  title={copy.categoriesTitle ?? ""}
                  subtitle={copy.categoriesSubtitle ?? undefined}
                />
                {copy.categoriesPrompt ? (
                  <h4
                    className={`${homeSerif.className} text-2xl leading-8 text-navy`}
                  >
                    {copy.categoriesPrompt}
                  </h4>
                ) : null}
                <ChipGrid
                  icons={chipIcons}
                  options={optionsFor("techCategories")}
                  value={values.techCategories}
                  onToggle={(v) => toggleArrayItem("techCategories", v)}
                />

                {values.techCategories.map((cat) => {
                  const field = CATEGORY_DETAIL_FIELD[cat];
                  if (!field) return null;
                  const detail = F(field);
                  if (field === "bundledDetail") {
                    return (
                      <div
                        key={cat}
                        className="flex flex-col gap-1.5 rounded-2xl bg-brand-soft p-4"
                      >
                        <span className={labelClass}>{detail.label}</span>
                        <textarea
                          rows={3}
                          value={values.bundledDetail}
                          onChange={(e) => setField("bundledDetail", e.target.value)}
                          placeholder={detail.placeholder ?? undefined}
                          className={`${inputClass} resize-y`}
                        />
                        <p className="text-sm leading-5 text-nav">{detail.hint}</p>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={cat}
                      className="flex flex-col gap-1.5 rounded-2xl bg-brand-soft p-4"
                    >
                      <span className={labelClass}>{detail.label}</span>
                      <TagInput
                        value={values[field as ArrayField]}
                        onChange={(v) => setField(field as ArrayField, v)}
                        placeholder={detail.placeholder ?? undefined}
                        hint={detail.hint ?? undefined}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <FormHeading
                  title={copy.economicsTitle ?? ""}
                  subtitle={copy.economicsSubtitle ?? undefined}
                />
                <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                  <SelectDropdown
                    name="avgDiscount"
                    label={F("avgDiscount").label ?? ""}
                    placeholder={F("avgDiscount").placeholder ?? undefined}
                    options={optionsFor("avgDiscount")}
                    value={values.avgDiscount}
                    onChange={(v) => setField("avgDiscount", v)}
                  />
                  <SelectDropdown
                    name="dealStructure"
                    label={F("dealStructure").label ?? ""}
                    placeholder={F("dealStructure").placeholder ?? undefined}
                    options={optionsFor("dealStructure")}
                    value={values.dealStructure}
                    onChange={(v) => setField("dealStructure", v)}
                  />
                  <SelectDropdown
                    name="commitmentSize"
                    label={F("commitmentSize").label ?? ""}
                    placeholder={F("commitmentSize").placeholder ?? undefined}
                    options={optionsFor("commitmentSize")}
                    value={values.commitmentSize}
                    onChange={(v) => setField("commitmentSize", v)}
                  />
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>{F("customDealConsiderations").label}</span>
                  <textarea
                    rows={5}
                    value={values.customDealConsiderations}
                    onChange={(e) => setField("customDealConsiderations", e.target.value)}
                    placeholder={F("customDealConsiderations").placeholder ?? undefined}
                    className={`${inputClass} min-h-tile resize-y`}
                  />
                </label>

                {/* Honeypot — hidden from real users via CSS, not display:none. */}
                <label className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0">
                  Company website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.companyWebsiteHoneypot}
                    onChange={(e) => setField("companyWebsiteHoneypot", e.target.value)}
                  />
                </label>

                <div className="flex flex-col gap-7.5">
                  <div className="flex flex-col gap-3">
                    <TermsRow
                      checked={values.agreedToTerms}
                      onChange={(v) => setField("agreedToTerms", v)}
                    >
                      {copy.termsPrefix}{" "}
                      <Link
                        href={copy.termsHref ?? "/terms"}
                        className="text-brand hover:underline"
                      >
                        {copy.termsLinkLabel}
                      </Link>{" "}
                      and{" "}
                      <Link
                        href={copy.privacyHref ?? "/privacy"}
                        className="text-brand hover:underline"
                      >
                        {copy.privacyLinkLabel}
                      </Link>{" "}
                      {copy.termsSuffix}
                    </TermsRow>
                    {errors.agreedToTerms ? (
                      <span className={errorClass}>{errors.agreedToTerms}</span>
                    ) : null}

                    {/* Optional acknowledgement — clickable like the others, but not
                        part of the submission schema, so nothing is sent. */}
                    <TermsRow
                      checked={values.acknowledgedNda}
                      onChange={(v) => setField("acknowledgedNda", v)}
                    >
                      {copy.ndaText}{" "}
                      {copy.ndaLinkLabel && copy.ndaLinkHref ? (
                        <a
                          href={copy.ndaLinkHref}
                          className="text-brand hover:underline"
                        >
                          {copy.ndaLinkLabel}
                        </a>
                      ) : null}
                    </TermsRow>

                    <TermsRow
                      checked={values.consentToContact}
                      onChange={(v) => setField("consentToContact", v)}
                    >
                      {copy.consentText}
                    </TermsRow>
                  </div>

                  {serverError ? (
                    <p className="rounded-lg border border-danger bg-danger-bg px-4 py-3 text-center text-sm font-medium text-danger-fg">
                      {serverError}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <div
            className={`flex flex-col-reverse items-stretch gap-3 px-5 pb-8 sm:flex-row sm:items-center sm:gap-4 sm:px-10 sm:pb-10 ${
              step === 1 ? "sm:justify-end" : "sm:justify-between"
            }`}
          >
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStep((step - 1) as 1 | 2);
                }}
                className={secondaryButtonClass}
              >
                <ArrowIcon direction="left" />
                {copy.backLabel}
              </button>
            ) : null}
            {step === 1 ? (
              <button type="button" onClick={goToStep2} className={primaryButtonClass}>
                {copy.continueToStep2Label}
                <ArrowIcon direction="right" />
              </button>
            ) : null}
            {step === 2 ? (
              <button type="button" onClick={goToStep3} className={primaryButtonClass}>
                {copy.continueToStep3Label}
                <ArrowIcon direction="right" />
              </button>
            ) : null}
            {step === 3 ? (
              <button
                type="submit"
                disabled={status === "submitting"}
                className={primaryButtonClass}
              >
                {status === "submitting" ? copy.submittingLabel : copy.submitLabel}
                <ArrowIcon direction="right" />
              </button>
            ) : null}
          </div>

          {step === 3 && copy.footerNote ? (
            <p className="bg-brand-soft px-5 py-3.75 text-center text-sm leading-5 text-ink sm:text-base sm:leading-6">
              {copy.footerNote}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
