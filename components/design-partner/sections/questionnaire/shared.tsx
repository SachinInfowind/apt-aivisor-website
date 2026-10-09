"use client";

import type { ReactNode } from "react";
import { homeSerif } from "@/components/ui/fonts";

/**
 * Shared primitives for the Design Partner Onboarding Questionnaire
 * (Figma "Design Partner Program New/Step1..5"). Field styling matches the
 * exact values from the Figma export (8px radius, #D0D5DD border, 10px/14px
 * padding, #344054 labels) — these already matched the site's existing
 * `inputClass` convention from the old DesignPartnerFormSection.
 */

export const TOTAL_STEPS = 5;

export const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand-accent";
export const labelClass = "text-sm font-medium leading-5 text-ink";
export const selectClass = `${inputClass} appearance-none bg-no-repeat pr-10`;

export function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#667085"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M9 3L3 9M3 3L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  /** Inline validation message (e.g. "Enter a valid email address"). Takes over from `hint` when present. */
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <label className={labelClass}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {error ? (
        <p className="text-sm leading-5 text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm leading-5 text-nav">{hint}</p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  required,
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  error?: string;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectClass} ${error ? "border-red-400 focus:border-red-500" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDownIcon />
      </div>
    </Field>
  );
}

export function TextField({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
  hint,
  type = "text",
  maxLength,
  maxWords,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
  type?: "text" | "email";
  maxLength?: number;
  /** Shows a live "N/maxWords Words" counter under the field, bottom-right. */
  maxWords?: number;
}) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <input
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${error ? "border-red-400 focus:border-red-500" : ""}`}
      />
      {maxWords ? (
        <p className="w-full text-right text-xs leading-4 text-subtle">
          {wordCount}/{maxWords} Words
        </p>
      ) : null}
    </Field>
  );
}

export function TextareaField({
  label,
  required,
  hint,
  value,
  onChange,
  placeholder,
  error,
  maxWords,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  /** Shows a live "N/maxWords Words" counter under the field, bottom-right. */
  maxWords?: number;
}) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`${inputClass} resize-none ${error ? "border-red-400 focus:border-red-500" : ""}`}
      />
      {maxWords ? (
        <p className="w-full text-right text-xs leading-4 text-subtle">
          {wordCount}/{maxWords} Words
        </p>
      ) : null}
    </Field>
  );
}

/** Pill-style single-select (Yes/No/Not sure, role chooser, etc.). */
export function PillRadioGroup({
  label,
  required,
  value,
  onChange,
  options,
  optionLabels,
  variant = "pill",
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /** Display text per option, when it differs from the stored value. */
  optionLabels?: Record<string, string>;
  /** "card" is a roomier auto-height layout for options whose text wraps to multiple
   * lines. "radio" is plain inline radio circles + label (Figma "I am joining as a"). */
  variant?: "pill" | "card" | "radio";
  error?: string;
}) {
  if (variant === "radio") {
    return (
      <div className="flex w-full flex-col items-start gap-1.5">
        <label className={labelClass}>
          {label}
          {required ? " *" : ""}
        </label>
        <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-6 sm:gap-8">
          {options.map((opt) => {
            const selected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(opt)}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-brand" : "border-line-strong"
                  }`}
                >
                  {selected ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
                </span>
                <span className="text-sm font-medium leading-5 text-navy">
                  {optionLabels?.[opt] ?? opt}
                </span>
              </button>
            );
          })}
        </div>
        {error ? <p className="text-sm leading-5 text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <label className={labelClass}>
        {label}
        {required ? " *" : ""}
      </label>
      <div
        role="radiogroup"
        aria-label={label}
        className={
          variant === "card"
            ? "flex w-full items-stretch gap-2"
            : "flex w-full items-stretch gap-2"
        }
      >
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={
                variant === "card"
                  ? `flex-1 rounded-lg border px-2 py-1 text-center text-xs font-semibold leading-[1.5] transition-colors ${
                      selected
                        ? "border-[#82AEFF] bg-[#E8F0FF] text-brand-deep"
                        : error
                          ? "border-red-300 bg-surface-muted text-ink"
                          : "border-[#EAECF0] bg-surface-muted text-ink"
                    }`
                  : `flex h-11 flex-1 items-center justify-center rounded-lg border px-2 text-xs font-semibold leading-[1.5] transition-colors ${
                      selected
                        ? "border-[#82AEFF] bg-[#E8F0FF] text-brand-deep"
                        : error
                          ? "border-red-300 bg-surface-muted text-ink"
                          : "border-[#EAECF0] bg-surface-muted text-ink"
                    }`
              }
            >
              {optionLabels?.[opt] ?? opt}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}

/** Multi-select chip group (Figma "Badge" component — gray default, blue+X when selected). */
export function ChipMultiSelect({
  label,
  required,
  hint,
  value,
  onChange,
  options,
  labelColor,
  maxSelect,
  error,
  variant = "pill",
  columns = 3,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  /** Sub-group labels (e.g. "Cloud", "AI") use a lighter color than top-level field labels. */
  labelColor?: "default" | "muted";
  /** Caps how many chips can be selected at once (e.g. "Pick your top 3"). */
  maxSelect?: number;
  error?: string;
  /** "checkbox" is a grid of square checkboxes + label (Figma's updated multi-select style). */
  variant?: "pill" | "checkbox";
  /** Grid column count, checkbox variant only. */
  columns?: 1 | 2 | 3 | 4;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
      return;
    }
    if (maxSelect && value.length >= maxSelect) return;
    onChange([...value, opt]);
  };

  const labelEl = (
    <label className={labelColor === "muted" ? "text-sm font-medium leading-5 text-nav" : labelClass}>
      {label}
      {required ? " *" : ""}
    </label>
  );

  if (variant === "checkbox") {
    const gridCols = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[columns];
    return (
      <div className="flex w-full flex-col items-start gap-2.5">
        {labelEl}
        <div className={`grid w-full grid-cols-1 gap-x-4 gap-y-3 ${gridCols}`}>
          {options.map((opt) => {
            const selected = value.includes(opt);
            const disabled = !selected && !!maxSelect && value.length >= maxSelect;
            return (
              <button
                key={opt}
                type="button"
                role="checkbox"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => toggle(opt)}
                className="flex items-start gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                    selected ? "border-brand bg-brand" : "border-line-strong bg-white"
                  }`}
                >
                  {selected ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path
                        d="M8.333 2.5L3.75 7.083L1.667 5"
                        stroke="white"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span className="text-sm leading-5 text-nav">{opt}</span>
              </button>
            );
          })}
        </div>
        {error ? (
          <p className="text-sm leading-5 text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-sm leading-5 text-nav">{hint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      {labelEl}
      <div className="flex w-full flex-wrap items-start gap-2.5">
        {options.map((opt) => {
          const selected = value.includes(opt);
          const disabled = !selected && !!maxSelect && value.length >= maxSelect;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggle(opt)}
              className={`inline-flex items-center gap-0.5 rounded-lg border px-2.5 py-1 text-sm font-medium leading-5 transition-colors ${
                selected
                  ? "border-[#82AEFF] bg-[#E8F0FF] text-brand-deep"
                  : error
                    ? "border-red-300 bg-surface-muted text-nav disabled:cursor-not-allowed disabled:opacity-50"
                    : "border-[#EAECF0] bg-surface-muted text-nav disabled:cursor-not-allowed disabled:opacity-50"
              }`}
            >
              {opt}
              {selected ? <XCloseIcon /> : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm leading-5 text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm leading-5 text-nav">{hint}</p>
      ) : null}
    </div>
  );
}

/** Section sub-heading (serif, bordered) used once per logical group within a step. */
export function StepSectionHeading({
  title,
  stepLabel,
}: {
  title: string;
  /** Only the first sub-heading in a step shows "Step 0X/05". */
  stepLabel?: string;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-[#F1F5F9] pb-4">
      <h3
        className={`${homeSerif.className} text-[1.5rem] leading-[1.267] text-navy sm:text-[1.875rem] sm:leading-[2.375rem]`}
      >
        {title}
      </h3>
      {stepLabel ? (
        <span className="shrink-0 text-base font-semibold leading-6 text-navy">
          {stepLabel}
        </span>
      ) : null}
    </div>
  );
}
